<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/init'
import { fetchRole, userRole } from '../store/auth'

const email = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()
const route = useRoute()

const login = async () => {
  error.value = null
  try {
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value)
    userRole.value = await fetchRole(cred.user.uid)

    console.log('Current user:', auth.currentUser)
    console.log('Email:', auth.currentUser.email, '| Role:', userRole.value)

    // Admins go to the admin page; everyone else back to where they were heading
    const redirect = route.query.redirect
    if (userRole.value === 'admin') router.push('/admin')
    else router.push(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/')
  } catch (e) {
    error.value = 'Invalid email or password.'
    console.error(e.code)
  }
}
</script>

<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <input v-model="email" type="email" class="form-control mb-2" placeholder="Email" />
          <input v-model="password" type="password" class="form-control mb-2" placeholder="Password" />
          <div v-if="error" class="text-danger mb-2">{{ error }}</div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        <p class="mt-3 text-center">
          No account? <router-link to="/register">Register</router-link>
        </p>
      </div>
    </div>
  </div>
</template>