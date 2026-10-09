<script setup>
import { onMounted } from 'vue'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/init'

onMounted(async () => {
  console.log('Current user before logout:', auth.currentUser?.email ?? null)
  await signOut(auth)
  console.log('Current user after logout:', auth.currentUser) // null
})
</script>

<template>
  <div class="container mt-4 text-center">
    <h2>You have been logged out</h2>
    <router-link to="/login" class="btn btn-primary mt-3">Log in again</router-link>
  </div>
</template>