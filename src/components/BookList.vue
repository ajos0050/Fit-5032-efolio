<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import {
  collection, query, where, orderBy, limit,
  onSnapshot, doc, updateDoc, deleteDoc
} from 'firebase/firestore'
import { db } from '../firebase/init'

const books = ref([])

// Query controls
const minIsbn = ref(0)
const sortDir = ref('asc')
const maxResults = ref(10)

// Shown on the page so the screenshot makes the query obvious
const queryText = computed(
  () =>
    `where('isbn', '>=', ${Number(minIsbn.value) || 0}) · orderBy('isbn', '${sortDir.value}') · limit(${Number(maxResults.value) || 10})`
)

let unsubscribe = null

const runQuery = () => {
  if (unsubscribe) unsubscribe()
  const q = query(
    collection(db, 'books'),
    where('isbn', '>=', Number(minIsbn.value) || 0),
    orderBy('isbn', sortDir.value),
    limit(Number(maxResults.value) || 10)
  )
  // onSnapshot keeps the list live: adds, edits and deletes show instantly
  unsubscribe = onSnapshot(q, (snapshot) => {
    books.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    console.log(`Query returned ${books.value.length} book(s):`, queryText.value)
  })
}

// Re-run whenever a control changes
watch([minIsbn, sortDir, maxResults], runQuery, { immediate: true })
onUnmounted(() => unsubscribe && unsubscribe())

// Update
const editingId = ref(null)
const editIsbn = ref('')
const editName = ref('')

const startEdit = (book) => {
  editingId.value = book.id
  editIsbn.value = book.isbn
  editName.value = book.name
}

const saveEdit = async (id) => {
  await updateDoc(doc(db, 'books', id), {
    isbn: Number(editIsbn.value),
    name: editName.value.trim()
  })
  console.log('Book updated:', id)
  editingId.value = null
}

// Delete
const removeBook = async (book) => {
  if (!confirm(`Delete "${book.name}"?`)) return
  await deleteDoc(doc(db, 'books', book.id))
  console.log('Book deleted:', book.id)
}
</script>

<template>
  <div>
    <h3>Book List</h3>

    <div class="row g-2 align-items-end mb-2">
      <div class="col-sm-4">
        <label class="form-label small">Min ISBN (where)</label>
        <input v-model="minIsbn" type="number" class="form-control" />
      </div>
      <div class="col-sm-4">
        <label class="form-label small">Sort by ISBN (orderBy)</label>
        <select v-model="sortDir" class="form-select">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div class="col-sm-4">
        <label class="form-label small">Max results (limit)</label>
        <input v-model="maxResults" type="number" min="1" class="form-control" />
      </div>
    </div>
    <p class="small text-muted"><code>{{ queryText }}</code></p>

    <table class="table table-striped align-middle">
      <thead>
        <tr><th>ISBN</th><th>Name</th><th class="text-end">Actions</th></tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <template v-if="editingId === book.id">
            <td><input v-model="editIsbn" type="number" class="form-control form-control-sm" /></td>
            <td><input v-model="editName" class="form-control form-control-sm" /></td>
            <td class="text-end">
              <button class="btn btn-sm btn-success me-1" @click="saveEdit(book.id)">Save</button>
              <button class="btn btn-sm btn-secondary" @click="editingId = null">Cancel</button>
            </td>
          </template>
          <template v-else>
            <td>{{ book.isbn }}</td>
            <td>{{ book.name }}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-primary me-1" @click="startEdit(book)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" @click="removeBook(book)">Delete</button>
            </td>
          </template>
        </tr>
        <tr v-if="!books.length">
          <td colspan="3" class="text-center text-muted">No books match this query.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>