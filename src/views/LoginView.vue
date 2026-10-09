<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '../store/auth'

const username = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()
const route = useRoute()

const handleLogin = () => {
  if (login(username.value, password.value)) {
    // Only allow internal redirects (stops ?redirect=https://evil.com tricks)
    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/')
  } else {
    error.value = 'Invalid username or password.'
  }
}
</script>

<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <input v-model="username" class="form-control mb-2" placeholder="Username" />
          <input v-model="password" type="password" class="form-control mb-2" placeholder="Password" />
          <div v-if="error" class="text-danger mb-2">{{ error }}</div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>