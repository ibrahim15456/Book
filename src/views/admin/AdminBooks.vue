<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold">Manage Books</h2>
      <router-link to="/admin/books/new" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i> Add Book
      </router-link>
    </div>

    <div v-if="booksStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else class="table-responsive bg-white shadow-sm rounded border">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-dark">
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in booksStore.books" :key="book.id">
            <td>
              <img :src="book.coverUrl" class="rounded" style="width: 40px; height: 50px; object-fit: cover;">
            </td>
            <td class="fw-bold">{{ book.title }}</td>
            <td>{{ book.year }}</td>
            <td>
              <router-link :to="`/admin/books/${book.id}/edit`" class="btn btn-sm btn-outline-warning me-2">
                <i class="bi bi-pencil"></i> Edit
              </router-link>
              <button @click="deleteBook(book.id)" class="btn btn-sm btn-outline-danger">
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
import { useBooksStore } from '../../stores/booksStore'

const router = useRouter()
const booksStore = useBooksStore()

onMounted(() => {
  // التحقق من الباسورد قبل السماح بالدخول، وإذا لم يتم الدخول يتم تحويله للوحة الدخول الرئيسية
  if (sessionStorage.getItem('isAdminAuth') !== 'true') {
    router.push('/admin')
    return
  }
  booksStore.fetchList()
})

const deleteBook = async (id) => {
  if (confirm('Are you sure you want to delete this book?')) {
    try {
      await booksStore.removeBook(id)
    } catch (err) {
      alert('Failed to delete book')
    }
  }
}
</script>