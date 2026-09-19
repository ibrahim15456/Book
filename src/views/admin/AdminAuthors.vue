<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Manage Authors</h2>
      <router-link to="/admin/authors/new" class="btn btn-success">
        <i class="bi bi-plus-lg"></i> Add Author
      </router-link>
    </div>

    <div v-if="authorsStore.loading" class="text-center py-5">
      <div class="spinner-border text-success"></div>
    </div>

    <div v-else class="table-responsive bg-white shadow-sm rounded border">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-dark">
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="author in authorsStore.authors" :key="author.id">
            <td>
              <img :src="author.avatarUrl" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
            </td>
            <td class="fw-bold">{{ author.name }}</td>
            <td>
              <router-link :to="`/admin/authors/${author.id}/edit`" class="btn btn-sm btn-outline-warning me-2">
                <i class="bi bi-pencil"></i> Edit
              </router-link>
              <button @click="deleteAuthor(author.id)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4">
      <router-link to="/admin" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left"></i> Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthorsStore } from '../../stores/authorsStore'

const router = useRouter()
const authorsStore = useAuthorsStore()

onMounted(() => {
  if (sessionStorage.getItem('isAdminAuth') !== 'true') {
    router.push('/admin')
    return
  }
  authorsStore.fetchList()
})

const deleteAuthor = async (id) => {
  if (confirm('Are you sure you want to delete this author?')) {
    try {
      await authorsStore.removeAuthor(id)
    } catch (err) {
      alert('Failed to delete author')
    }
  }
}
</script>