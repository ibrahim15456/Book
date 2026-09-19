<template>
  <div class="container py-4">
    <div v-if="booksStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="book" class="row">
      <div class="col-md-4 text-center">
        <img 
          :src="book.coverUrl" 
          class="img-fluid rounded shadow" 
          alt="Book Cover"
          style="max-height: 400px; object-fit: cover;"
        >
      </div>
      <div class="col-md-8">
        <h1 class="fw-bold mb-3">{{ book.title }}</h1>
        <h4 class="text-muted mb-3">Author: 
          <router-link v-if="author" :to="`/authors/${author.id}`" class="text-decoration-none">
            {{ author.name }}
          </router-link>
          <span v-else>Loading...</span>
        </h4>
        <p class="text-secondary"><strong>Publication Year:</strong> {{ book.year }}</p>
        
        <h3 class="fw-bold mb-3" :class="book.price === 0 || !book.price ? 'text-info' : 'text-success'">
          {{ book.price === 0 || !book.price ? 'Free Book' : `$${book.price.toFixed(2)}` }}
        </h3>
        
        <div class="mb-3">
          <span v-for="tag in book.tags" :key="tag" class="badge bg-primary me-1">{{ tag }}</span>
        </div>

        <hr>
        <h5>Description</h5>
        <p class="lead fs-6 text-muted">{{ book.description }}</p>

        <!-- الأزرار (رجوع + قراءة مجانية أو شراء) - تم إزالة Mark as Read من هنا -->
        <div class="mt-4 d-flex gap-3 align-items-center flex-wrap">
          <router-link to="/books" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Back to Books
          </router-link>

          <router-link 
            v-if="book.readUrl" 
            :to="`/books/${book.id}/read`" 
            class="btn btn-info text-white btn-lg"
          >
             Read for Free
          </router-link>

          <template v-else>
            <button @click="handleAddToCart" class="btn btn-primary btn-lg">
              🛒 Add to Cart
            </button>

            <button @click="handleBuyNow" class="btn btn-success btn-lg">
              Buy Now
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '../stores/booksStore'
import { useAuthorsStore } from '../stores/authorsStore'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const authorsStore = useAuthorsStore()

const book = ref(null)
const author = ref(null)

const emit = defineEmits(['add-to-cart'])

onMounted(async () => {
  const bookId = route.params.id
  book.value = await booksStore.fetchById(bookId)
  if (book.value && book.value.authorId) {
    author.value = await authorsStore.fetchById(book.value.authorId)
  }
})

const handleAddToCart = () => {
  if (book.value) {
    emit('add-to-cart', book.value)
    alert(`Added "${book.value.title}" to cart!`)
  }
}

const handleBuyNow = () => {
  if (book.value) {
    emit('add-to-cart', book.value)
    router.push('/cart')
  }
}
</script>