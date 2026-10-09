<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/init'
import { userRole } from '../store/auth'

const email = ref('')
const password = ref('')
const role = ref('user')
const error = ref(null)
const router = useRouter()

const register = async () => {
  error.value = null
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)

    // Save the role in Firestore, keyed by the Firebase user ID
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email,
      role: role.value,
      createdAt: serverTimestamp()
    })
    userRole.value = role.value

    console.log('Registered user:', cred.user)
    console.log('Role:', role.value)
    router.push('/')
  } catch (e) {
    error.value =
      e.code === 'auth/email-already-in-use' ? 'That email is already registered.'
      : e.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
      : e.code === 'auth/invalid-email' ? 'Please enter a valid email.'
      : e.message
    console.error(e)
  }
}
</script>

<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h2>Create an account</h2>
        <form @submit.prevent="register">
          <input v-model="email" type="email" class="form-control mb-2" placeholder="Email" />
          <input v-model="password" type="password" class="form-control mb-2" placeholder="Password" />
          <label class="form-label">Role</label>
          <!-- Demo only: in a real app roles are assigned server-side, not chosen by the user -->
          <select v-model="role" class="form-select mb-3">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div v-if="error" class="text-danger mb-2">{{ error }}</div>
          <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
        <p class="mt-3 text-center">
          Already have an account? <router-link to="/login">Log in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>