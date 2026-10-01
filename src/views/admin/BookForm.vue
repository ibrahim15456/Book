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

      <!-- تعديل خانة المؤلف لتكون نصاً حراً بدلاً من القائمة -->
      <div class="mb-3">
        <label class="form-label">Author *</label>
        <input 
          type="text" 
          class="form-control" 
          v-model="form.author" 
          placeholder="e.g. Andy Weir"
          required
        >
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

      <!-- إضافة خانة رابط القراءة PDF أو تعيينها كـ free -->
      <div class="mb-3">
        <label class="form-label">Read / PDF URL</label>
        <input 
          type="text" 
          class="form-control" 
          v-model="form.readUrl" 
          placeholder="https://... or type 'free'"
        >
        <div class="form-text">Enter the PDF link or leave/type "free" if available for free reading.</div>
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

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const isEditMode = computed(() => !!route.params.id)
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  title: '',
  author: '', // تم تغييرها من authorId إلى author (نص حر)
  year: new Date().getFullYear(),
  coverUrl: '',
  readUrl: 'free', // القيمة الافتراضية لو مفيش رابط PDF
  description: ''
})

const tagsInput = ref('')

onMounted(async () => {
  if (sessionStorage.getItem('isAdminAuth') !== 'true') {
    router.push('/admin')
    return
  }

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
    tags,
    readUrl: form.value.readUrl ? form.value.readUrl.trim() : 'free' // لو فاضية تخليها free
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