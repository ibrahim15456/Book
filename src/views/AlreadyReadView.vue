<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-4">Books You've Already Read</h2>
    
    <div v-if="booksStore.alreadyReadBooks.length === 0" class="text-center py-5">
      <p class="text-muted fs-5">You haven't marked any books as read yet.</p>
      <router-link to="/books" class="btn btn-primary mt-2">Explore Books</router-link>
    </div>

    <div v-else class="row g-4">
      <div v-for="book in booksStore.alreadyReadBooks" :key="book.id" class="col-md-4">
        <div class="card h-100 shadow-sm p-3 d-flex flex-column">
          <h5 class="fw-bold">{{ book.title || book.name }}</h5>
          <p class="text-muted small mb-2">Author: {{ book.author }}</p>
          <p class="small text-secondary flex-grow-1">{{ book.description ? book.description.substring(0, 80) + '...' : '' }}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <router-link :to="`/books/${book.id}`" class="btn btn-sm btn-outline-primary">View Details</router-link>
            <button @click="booksStore.removeFromAlreadyRead(book.id)" class="btn btn-sm btn-outline-danger">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBooksStore } from '../stores/booksStore'

const booksStore = useBooksStore()
</script>