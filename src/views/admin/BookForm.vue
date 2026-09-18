<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-4">{{ isEditMode ? 'Edit Book' : 'Add New Book' }}</h2>

    <form @submit.prevent="handleSubmit" class="bg-white p-4 rounded shadow-sm border">
      <div class="mb-3">
        <label class="form-label">Book Title *</label>
        <input 
          type="text" 
          class="form-control" 
          v-model="form.title" 
          required
          minlength="3"
          maxlength="100"
        >
        <div class="form-text">Title must be between 3 and 100 characters.</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Author *</label>
        <select class="form-select" v-model="form.authorId" required>
          <option value="" disabled>Select an author</option>
          <option v-for="author in authorsStore.authors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Publication Year (1800 - Current) *</label>
        <input 
          type="number" 
          class="form-control" 
          v-model.number="form.year" 
          min="1800" 
          :max="new Date().getFullYear()"
          required
        >
      </div>

      <div class="mb-3">
        <label class="form-label">Tags (comma separated)</label>
        <input 
          type="text" 
          class="form-control" 
          v-model="tagsInput" 
          placeholder="e.g. sci-fi, space"
        >
      </div>

      <div class="mb-3">
        <label class="form-label">Cover URL</label>
        <input 
          type="url" 
          class="form-control" 
          v-model="form.coverUrl" 
          placeholder="https://..."
        >
      </div>

      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea 
          class="form-control" 
          v-model="form.description" 
          rows="4"
          maxlength="2000"
        ></textarea>
      </div>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ isEditMode ? 'Update Book' : 'Create Book' }}
      </button>
      <router-link to="/admin/books" class="btn btn-outline-secondary ms-2">Cancel</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '../../stores/booksStore'
import { useAuthorsStore } from '../../stores/authorsStore'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const authorsStore = useAuthorsStore()

const isEditMode = computed(() => !!route.params.id)
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  title: '',
  authorId: '',
  year: new Date().getFullYear(),
  coverUrl: '',
  description: ''
})

const tagsInput = ref('')

onMounted(async () => {
  if (sessionStorage.getItem('isAdminAuth') !== 'true') {
    router.push('/admin')
    return
  }

  await authorsStore.fetchList()
  if (isEditMode.value) {
    const book = await booksStore.fetchById(route.params.id)
    if (book) {
      form.value = { ...book }
      tagsInput.value = book.tags ? book.tags.join(', ') : ''
    }
  }
})

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true

  const tags = tagsInput.value
    ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
    : []

  const payload = {
    ...form.value,
    tags
  }

  try {
    if (isEditMode.value) {
      await booksStore.updateBook(route.params.id, payload)
    } else {
      await booksStore.createBook(payload)
    }
    router.push('/admin/books')
  } catch (err) {
    errorMessage.value = err.message || 'An error occurred while saving the book.'
  } finally {
    loading.value = false
  }
}
</script>