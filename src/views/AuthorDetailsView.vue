<template>
  <div class="container py-4">
    <div v-if="authorsStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="author" class="row">
      <div class="col-md-4 text-center">
        <img 
          :src="author.avatarUrl" 
          class="rounded-circle img-fluid shadow mb-3" 
          alt="Author Avatar"
          style="width: 180px; height: 180px; object-fit: cover;"
        >
        <h2 class="fw-bold">{{ author.name }}</h2>
      </div>
      <div class="col-md-8">
        <h4 class="mb-3">Biography</h4>
        <p class="lead fs-6 text-muted">{{ author.bio }}</p>

        <hr class="my-4">

        <h4 class="mb-3">Books by {{ author.name }}</h4>
        <div v-if="authorBooks.length === 0" class="text-muted">
          No books found for this author.
        </div>
        <div v-else class="list-group">
          <router-link 
            v-for="book in authorBooks" 
            :key="book.id" 
            :to="`/books/${book.id}`" 
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <span>{{ book.title }} ({{ book.year }})</span>
            <span class="badge bg-primary rounded-pill">View</span>
          </router-link>
        </div>

        <div class="mt-4">
          <router-link to="/authors" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Back to Authors
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthorsStore } from '../stores/authorsStore'
import { useBooksStore } from '../stores/booksStore'

const route = useRoute()
const authorsStore = useAuthorsStore()
const booksStore = useBooksStore()

const author = ref(null)

onMounted(async () => {
  const authorId = route.params.id
  author.value = await authorsStore.fetchById(authorId)
  if (booksStore.books.length === 0) {
    await booksStore.fetchList()
  }
})

const authorBooks = computed(() => {
  if (!author.value) return []
  return booksStore.books.filter(b => b.authorId == author.value.id)
})
</script>