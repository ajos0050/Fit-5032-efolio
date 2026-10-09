<script setup>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/init'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')
const error = ref(null)
const message = ref(null)

const addBook = async () => {
  error.value = null
  message.value = null

  const isbnNumber = Number(isbn.value)
  if (!isbn.value || Number.isNaN(isbnNumber)) {
    error.value = 'ISBN must be a valid number.'
    return
  }
  if (!name.value.trim()) {
    error.value = 'Book name is required.'
    return
  }

  try {
    const docRef = await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value.trim(),
      createdAt: serverTimestamp()
    })
    console.log('Book added with ID:', docRef.id)
    message.value = `Added "${name.value.trim()}"`
    isbn.value = ''
    name.value = ''
  } catch (e) {
    console.error('Error adding book:', e)
    error.value = 'Could not add the book.'
  }
}
</script>

<template>
  <div class="container mt-4">
    <h1>Add Book</h1>
    <form class="row g-2 mb-4" @submit.prevent="addBook">
      <div class="col-sm-4">
        <input v-model="isbn" type="text" inputmode="numeric" class="form-control" placeholder="ISBN" />
      </div>
      <div class="col-sm-5">
        <input v-model="name" type="text" class="form-control" placeholder="Book name" />
      </div>
      <div class="col-sm-3">
        <button type="submit" class="btn btn-primary w-100">Add Book</button>
      </div>
      <div v-if="error" class="text-danger">{{ error }}</div>
      <div v-if="message" class="text-success">{{ message }}</div>
    </form>

    <BookList />
  </div>
</template>