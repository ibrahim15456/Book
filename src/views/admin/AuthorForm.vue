<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-4">{{ isEditMode ? 'Edit Author' : 'Add New Author' }}</h2>

    <form @submit.prevent="handleSubmit" class="bg-white p-4 rounded shadow-sm border">
      <div class="mb-3">
        <label class="form-label">Author Name *</label>
        <input 
          type="text" 
          class="form-control" 
          v-model="form.name" 
          required
          minlength="2"
          maxlength="60"
        >
      </div>

      <div class="mb-3">
        <label class="form-label">Avatar URL</label>
        <input 
          type="url" 
          class="form-control" 
          v-model="form.avatarUrl" 
          placeholder="https://..."
        >
      </div>

      <div class="mb-3">
        <label class="form-label">Biography</label>
        <textarea 
          class="form-control" 
          v-model="form.bio" 
          rows="4"
          maxlength="800"
        ></textarea>
        <div class="form-text">Max 800 characters.</div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <button type="submit" class="btn btn-success" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ isEditMode ? 'Update Author' : 'Create Author' }}
      </button>
      <router-link to="/admin/authors" class="btn btn-outline-secondary ms-2">Cancel</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthorsStore } from '../../stores/authorsStore'

const route = useRoute()
const router = useRouter()
const authorsStore = useAuthorsStore()

const isEditMode = computed(() => !!route.params.id)
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  name: '',
  avatarUrl: '',
  bio: ''
})

onMounted(async () => {
  if (sessionStorage.getItem('isAdminAuth') !== 'true') {
    router.push('/admin')
    return
  }

  if (isEditMode.value) {
    const author = await authorsStore.fetchById(route.params.id)
    if (author) {
      form.value = { ...author }
    }
  }
})

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    if (isEditMode.value) {
      await authorsStore.updateAuthor(route.params.id, form.value)
    } else {
      await authorsStore.createAuthor(form.value)
    }
    router.push('/admin/authors')
  } catch (err) {
    errorMessage.value = err.message || 'An error occurred while saving the author.'
  } finally {
    loading.value = false
  }
}
</script>