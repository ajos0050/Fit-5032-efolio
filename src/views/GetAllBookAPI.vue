<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const ALL_BOOKS_URL = 'http://127.0.0.1:5001/fit5032-892f5/australia-southeast1/getAllBooks'

const jsondata = ref(null)

// API page: fetch straight away on load and show the raw JSON
const getAllBooksAPI = async () => {
  try {
    const response = await axios.get(ALL_BOOKS_URL)
    jsondata.value = response.data
  } catch (e) {
    jsondata.value = { error: 'Error fetching books' }
    console.error('Error fetching books:', e)
  }
}

onMounted(getAllBooksAPI)
</script>

<template>
  <pre>{{ jsondata }}</pre>
</template>