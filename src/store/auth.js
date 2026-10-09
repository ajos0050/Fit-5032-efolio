import { ref, computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/init'

export const currentUser = ref(null)
export const userRole = ref(null)
export const isAuthenticated = computed(() => !!currentUser.value)

// Look up the user's role from Firestore (users/{uid})
export async function fetchRole(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data().role : 'user'
}

// Firebase restores the session asynchronously on page load.
// The router waits for this so a refresh doesn't kick you to /login.
let resolveReady
export const authReady = new Promise((resolve) => (resolveReady = resolve))

onAuthStateChanged(auth, async (user) => {
  currentUser.value = user
  userRole.value = user ? await fetchRole(user.uid) : null
  resolveReady()
})