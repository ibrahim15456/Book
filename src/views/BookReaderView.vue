<template>
  <div class="container-fluid py-3 d-flex flex-column vh-100">
    <div class="d-flex justify-content-between align-items-center mb-3 px-3">
      <h3 class="mb-0">
         Reading: <span class="text-primary">{{ book?.title || 'Loading...' }}</span>
      </h3>
      <div class="d-flex gap-2 align-items-center">
        
        <button 
          v-if="book"
          @click="toggleReadStatus" 
          :class="['btn', isAlreadyRead ? 'btn-success' : 'btn-outline-success']"
        >
          {{ isAlreadyRead ? '✅ Already Read' : '📌 Mark as Read' }}
        </button>

        <router-link :to="`../../books/${route.params.id}`" class="btn btn-outline-secondary">
          ⬅ Back to Book Details
        </router-link>
      </div>
    </div>

    <div class="flex-grow-1 border rounded shadow-sm bg-light overflow-hidden position-relative">
      <div v-if="loading" class="d-flex justify-content-center align-items-center h-100">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      
      <iframe 
        v-if="book?.readUrl" 
        :src="book.readUrl" 
        class="w-100 h-100 border-0"
        @load="loading = false"
      ></iframe>
      
      <div v-else-if="!loading" class="d-flex justify-content-center align-items-center h-100 text-muted">
        No PDF available for this book.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBooksStore } from '../stores/booksStore'

const route = useRoute()
const booksStore = useBooksStore()

const book = ref(null)
const loading = ref(true)

onMounted(async () => {
  const bookId = route.params.id
  book.value = await booksStore.fetchById(bookId)
  if (!book.value?.readUrl) {
    loading.value = false
  }
})

const isAlreadyRead = computed(() => {
  if (!book.value) return false
  return booksStore.alreadyReadBooks.some(b => b.id == book.value.id)
})

const toggleReadStatus = () => {
  if (!book.value) return
  if (isAlreadyRead.value) {
    booksStore.removeFromAlreadyRead(book.value.id)
  } else {
    booksStore.markAsRead(book.value)
  }
}
</script>