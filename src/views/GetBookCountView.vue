<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Emulator URL in dev. To call the deployed function instead, use:
// https://australia-southeast1-fit5032-892f5.cloudfunctions.net/countBooks
const COUNT_URL = 'http://127.0.0.1:5001/fit5032-892f5/australia-southeast1/countBooks'

const count = ref(null)
const error = ref(null)

const getBookCount = async () => {
  error.value = null
  try {
    const response = await axios.get(COUNT_URL)
    count.value = response.data.count
    console.log('countBooks response:', response.data)
  } catch (e) {
    error.value = 'Error fetching book count'
    console.error('Error fetching book count:', e)
  }
}
</script>

<template>
  <div class="container mt-4 text-center">
    <h1>Book Counter</h1>
    <button class="btn btn-primary" @click="getBookCount">Get Book Count</button>
    <p v-if="count !== null" class="mt-3 fs-4">Total number of books: {{ count }}</p>
    <p v-if="error" class="text-danger mt-3">{{ error }}</p>
  </div>
</template>