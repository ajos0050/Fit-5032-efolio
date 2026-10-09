<script setup>
import { useRouter } from "vue-router";
import { isAuthenticated, logout } from "@/store/auth";

const router = useRouter();

const handleLogout = () => {
  logout();
  router.push({ name: "Login" });
};
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
        </li>
        <li v-else class="nav-item">
          <button class="nav-link" @click="handleLogout">Logout</button>
        </li>
      </ul>
    </header>
  </div>
</template>