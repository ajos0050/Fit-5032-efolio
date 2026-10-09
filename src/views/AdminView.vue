<script setup>
import { currentUser, userRole } from '../store/auth'
</script>

<template>
  <div class="container mt-4">
    <h1>Admin Dashboard</h1>
    <p>Welcome, {{ currentUser?.email }}. Your role is <strong>{{ userRole }}</strong>.</p>
    <p>Only users with the admin role can see this page.</p>
  </div>
</template>