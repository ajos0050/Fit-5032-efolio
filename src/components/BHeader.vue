<script setup>
import { currentUser, userRole, isAuthenticated } from '@/store/auth'
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-center align-items-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/GetBookCount" class="nav-link" active-class="active">Get Book Count</router-link>
        </li>
        <li v-if="userRole === 'admin'" class="nav-item">
          <router-link to="/admin" class="nav-link" active-class="active">Admin</router-link>
        </li>
        <template v-if="!isAuthenticated">
          <li class="nav-item">
            <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link" active-class="active">Register</router-link>
          </li>
        </template>
        <li v-else class="nav-item">
          <router-link to="/logout" class="nav-link">Logout</router-link>
        </li>
      </ul>
      <span v-if="isAuthenticated" class="ms-3 small text-muted">
        {{ currentUser.email }} ({{ userRole }})
      </span>
    </header>
  </div>
</template>