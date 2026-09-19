<template>
  <div class="container py-4">
    <!-- قسم الهيدر -->
    <div class="text-center mb-5">
      <h2 class="fw-bold explore-title">Explore Authors</h2>
      <p class="text-muted">Discover the brilliant minds behind your favorite books.</p>
    </div>

    <!-- شريط البحث -->
    <div class="row mb-4">
      <div class="col-md-6 mx-auto">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Search authors by name or bio..." 
          v-model="searchQuery"
        >
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="authorsStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="authorsStore.error" class="alert alert-danger text-center" role="alert">
      <p>{{ authorsStore.error }}</p>
      <button class="btn btn-outline-danger btn-sm" @click="authorsStore.fetchList()">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredAuthors.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-person-x fs-1"></i>
      <p class="mt-2">No authors found matching your criteria.</p>
    </div>

    <!-- Authors Grid (Flip Cards) -->
    <div v-else class="row g-4">
      <div class="col-md-4 col-lg-4" v-for="author in filteredAuthors" :key="author.id">
        <div class="flip-card">
          <div class="flip-card-inner">
            
            <!-- الوجه الأمامي للكارت -->
            <div class="flip-card-front card h-100 shadow-sm border-0 p-4 text-center d-flex flex-column align-items-center justify-content-between">
              <div>
                <img 
                  :src="author.avatarUrl || 'https://picsum.photos/120?placeholder'" 
                  class="rounded-circle mb-3 shadow-sm" 
                  alt="Author avatar"
                  style="width: 100px; height: 100px; object-fit: cover;"
                >
                <h5 class="card-title fw-bold text-truncate w-100">{{ author.name }}</h5>
                <p class="card-text text-muted small text-secondary mt-2">
                  {{ truncateBio(author.bio) || 'No biography available.' }}
                </p>
              </div>

              <div class="btn btn-outline-primary btn-sm w-100 mt-3">
                View Profile
              </div>
            </div>

            <!-- الوجه الخلفي للكارت (رابط ويكيبيديا) -->
            <div class="flip-card-back card h-100 shadow-sm border-0 p-4 text-center d-flex flex-column align-items-center justify-content-center">
              <div class="mb-3">
                <h5 class="fw-bold mb-2">{{ author.name }}</h5>
                <p class="small text-muted mb-4">Read more about this author on Wikipedia and explore their literary history.</p>
              </div>

              <a 
                :href="getWikipediaUrl(author.name)" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-primary btn-sm w-100 mb-2"
              >
                View on Wikipedia
              </a>
              <router-link :to="`/authors/${author.id}`" class="btn btn-outline-secondary btn-sm w-100">
                Author Details in App
              </router-link>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthorsStore } from '../stores/authorsStore'

const authorsStore = useAuthorsStore()
const searchQuery = ref('')

onMounted(() => {
  authorsStore.fetchList()
})

const truncateBio = (bio) => {
  if (!bio) return ''
  return bio.length > 90 ? bio.substring(0, 90) + '...' : bio
}

const getWikipediaUrl = (name) => {
  return `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}`
}

const filteredAuthors = computed(() => {
  return authorsStore.authors.filter(author => {
    const query = searchQuery.value.toLowerCase()
    const matchesName = author.name.toLowerCase().includes(query)
    const matchesBio = author.bio && author.bio.toLowerCase().includes(query)
    return matchesName || matchesBio
  })
})
</script>

<style scoped>
/* إعدادات حاوية الـ Flip Card بنفس طريقة الكتب بالضبط */
.flip-card {
  background-color: transparent;
  perspective: 1000px;
  height: 380px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-front {
  background-color: #fff;
  color: black;
}

.flip-card-back {
  background-color: #f8f9fa;
  color: black;
  transform: rotateY(180deg);
}

/* الوضع الداكن (Dark Mode) */
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