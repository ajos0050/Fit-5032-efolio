import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'demo-api-key', // the emulator accepts any key
  authDomain: 'fit5032-892f5.firebaseapp.com',
  projectId: 'fit5032-892f5' // must match the emulator's project
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// In development, talk to the local emulators instead of the real cloud
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}