<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()

// API pages should return only JSON, so hide the header on them
const apiRoutes = ['CountBookAPI', 'GetAllBookAPI']
const showHeader = computed(() => !apiRoutes.includes(route.name))
</script>

<template>
  <header v-if="showHeader">
    <BHeader />
  </header>

  <main>
    <router-view />
  </main>
</template>