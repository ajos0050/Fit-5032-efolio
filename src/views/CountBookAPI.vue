<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const COUNT_URL = 'http://127.0.0.1:5001/fit5032-892f5/australia-southeast1/countBooks'

const jsondata = ref(null)

// API page: fetch straight away on load, no button needed
const getBookCountAPI = async () => {
  try {
    const response = await axios.get(COUNT_URL)
    jsondata.value = response.data
  } catch (e) {
    jsondata.value = { error: 'Error fetching book count' }
    console.error('Error fetching book count:', e)
  }
}

onMounted(getBookCountAPI)
</script>

<template>
  <pre>{{ jsondata }}</pre>
</template>