<template>
  <div class="container py-3">
    
    <!-- قسم الهيدر -->
    <div class="row mb-4">
      <div class="col-md-9 col-lg-7 mx-auto">
        <div class="card border-0 shadow-sm text-center py-4 px-5 explore-card rounded-4">
          <div class="d-flex flex-column align-items-center">
            <!-- الصورة بحجم مناسب ومتناسق -->
            <img 
              src="/images/explore.jpg" 
              alt="Explore Books Banner" 
              class="mb-3"
              style="width: 100px; height: 100px; object-fit: contain;"
            >
            <!-- العنوان الرئيسي -->
            <h3 class="fw-bold mb-2 explore-title">Explore Books</h3>
            <!-- الوصف -->
            <p class="mb-0 explore-desc">
              Browse through a wide variety of books complete with tags, publication years, and detailed descriptions.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- فلاتر البحث -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Search books by title..." 
          v-model="searchQuery"
        >
      </div>
      <div class="col-md-3">
        <select class="form-select" v-model="selectedAuthorId">
          <option value="">Filter by Author (All)</option>
          <option v-for="author in authorsStore.authors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <select class="form-select" v-model="selectedType">
          <option value="">Filter by Type (All)</option>
          <option v-for="tag in availableTypes" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
      </div>
      <!-- فلتر السعر الجديد -->
      <div class="col-md-3">
        <select class="form-select" v-model="selectedPriceFilter">
          <option value="">Filter by Price (All)</option>
          <option value="free">Free Only</option>
          <option value="paid">Paid Only</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="booksStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State with Retry -->
    <div v-else-if="booksStore.error" class="alert alert-danger text-center" role="alert">
      <p>{{ booksStore.error }}</p>
      <button class="btn btn-outline-danger btn-sm" @click="loadData">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredBooks.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-journal-x fs-1"></i>
      <p class="mt-2">No books found matching your criteria.</p>
    </div>

    <!-- Books Grid (Flip Cards) -->
    <div v-else class="row g-4">
      <div class="col-md-4 col-lg-3" v-for="book in filteredBooks" :key="book.id">
        <div class="flip-card">
          <div class="flip-card-inner">
            
            <!-- الوجه الأمامي للكارت (Front) -->
            <div class="flip-card-front card h-100 shadow-sm border-0">
              <div class="position-relative">
                <img 
                  :src="book.coverUrl || 'https://picsum.photos/120?placeholder'" 
                  class="card-img-top" 
                  alt="Book cover"
                  style="height: 200px; object-fit: cover;"
                >
                <span 
                  v-if="book.price === 0 || book.badge" 
                  class="position-absolute top-0 end-0 m-2 badge bg-success shadow fs-6 px-3 py-2"
                >
                  {{ book.badge || 'Free' }}
                </span>
              </div>

              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate">{{ book.title }}</h5>
                <p class="card-text text-muted small mb-3">By: {{ getAuthorName(book.authorId) }}</p>
                
                <div class="mb-3">
                  <span v-for="tag in book.tags" :key="tag" class="badge bg-secondary me-1">{{ tag }}</span>
                </div>

                <div class="btn btn-outline-primary btn-sm mt-auto">
                  View Book
                </div>
              </div>
            </div>

            <!-- الوجه الخلفي للكارت (Back) - عرض الوصف بالكامل بدون Scroll -->
            <div class="flip-card-back card h-100 shadow-sm border-0 p-3 d-flex flex-column justify-content-between text-start">
              <div>
                <h5 class="card-title text-truncate mb-2">{{ book.title }}</h5>
                <hr class="my-1">
                
                <p class="card-text small text-secondary mb-0">
                  {{ book.description || 'No description available for this book.' }}
                </p>
              </div>

              <div class="mt-auto pt-2">
                <div class="mb-2">
                  <span v-for="tag in book.tags" :key="tag" class="badge bg-secondary me-1">{{ tag }}</span>
                </div>
                <router-link :to="`/books/${book.id}`" class="btn btn-primary btn-sm w-100">
                  View Details
                </router-link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBooksStore } from '../stores/booksStore'
import { useAuthorsStore } from '../stores/authorsStore'

const booksStore = useBooksStore()
const authorsStore = useAuthorsStore()

const searchQuery = ref('')
const selectedAuthorId = ref('')
const selectedType = ref('')
const selectedPriceFilter = ref('')

const loadData = async () => {
  await Promise.all([
    booksStore.fetchList(),
    authorsStore.fetchList()
  ])
}

onMounted(() => {
  loadData()
})

const getAuthorName = (authorId) => {
  const author = authorsStore.authors.find(a => a.id == authorId)
  return author ? author.name : 'Unknown Author'
}

const availableTypes = computed(() => {
  const typesSet = new Set()
  booksStore.books.forEach(book => {
    if (book.tags && Array.isArray(book.tags)) {
      book.tags.forEach(tag => typesSet.add(tag))
    }
  })
  return Array.from(typesSet)
})

const filteredBooks = computed(() => {
  return booksStore.books.filter(book => {
    const matchesTitle = book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesAuthor = selectedAuthorId.value === '' || book.authorId == selectedAuthorId.value
    const matchesType = selectedType.value === '' || (book.tags && book.tags.includes(selectedType.value))
    
    let matchesPrice = true
    if (selectedPriceFilter.value === 'free') {
      matchesPrice = book.price === 0
    } else if (selectedPriceFilter.value === 'paid') {
      matchesPrice = book.price > 0
    }

    return matchesTitle && matchesAuthor && matchesType && matchesPrice
  })
})
</script>

<style scoped>
/* إعدادات حاوية الـ Flip Card */
.flip-card {
  background-color: transparent;
  perspective: 1000px;
  height: 410px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

/* عند مرور الماوس يتم دوران الكارت 180 درجة */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* إخفاء الوجه الخلفي أثناء الدوران وضبط الخصائص */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* الوجه الأمامي */
.flip-card-front {
  background-color: #fff;
  color: black;
}

/* الوجه الخلفي بدون Scroll */
.flip-card-back {
  background-color: #f8f9fa;
  color: black;
  transform: rotateY(180deg);
}

/* الوضع الافتراضي للعنصر */
.explore-card {
  background-color: #ffffff;
}
.explore-title {
  color: #111827;
}
.explore-desc {
  color: #6b7280;
}

/* الوضع الداكن (Dark Mode) */
:global(body.dark) .explore-card {
  background-color: #121318 !important;
  border: 1px solid #1f2229 !important;
}

:global(body.dark) .explore-title {
  color: #ffffff !important;
}

:global(body.dark) .explore-desc {
  color: #9ca3af !important;
}

:global(body.dark) .flip-card-front {
  background-color: #1b1d24 !important;
  color: #fff !important;
}

:global(body.dark) .flip-card-back {
  background-color: #16181f !important;
  color: #fff !important;
  border: 1px solid #2d3139 !important;
}
</style>