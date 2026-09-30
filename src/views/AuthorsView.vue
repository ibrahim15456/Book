<template>
  <div>
  
    <Transition name="fade">
      <div v-if="isLoadingAnimation" class="author-loader-overlay">
        <div class="loader-content text-center">
          
         
          <div class="writer-container">
            <div class="desk-surface"></div>
            <div class="book-open">
              <div class="page-left"></div>
              <div class="page-right"></div>
            </div>
            <div class="writing-pen">
              <div class="pen-tip"></div>
            </div>
            <div class="ink-sparkle"></div>
          </div>

          <h4 class="loading-text mt-4 fw-bold">Loading Authors & Writers...</h4>
          <p class="small text-secondary">Discovering brilliant minds and their masterpieces</p>
          
         
          <div class="loader-progress-bar mt-3">
            <div class="loader-progress-fill"></div>
          </div>
        </div>
      </div>
    </Transition>

  
    <div class="container py-4">
      <div class="text-center mb-5">
        <h2 class="fw-bold explore-title">Explore Authors</h2>
        <p class="text-muted">Discover the brilliant minds behind your favorite books.</p>
      </div>

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

      <div v-if="authorsStore.loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

     
      <div v-else-if="authorsStore.error" class="alert alert-danger text-center" role="alert">
        <p>{{ authorsStore.error }}</p>
        <button class="btn btn-outline-danger btn-sm" @click="authorsStore.fetchList()">Retry</button>
      </div>

      <div v-else-if="filteredAuthors.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-person-x fs-1"></i>
        <p class="mt-2">No authors found matching your criteria.</p>
      </div>

     
      <div v-else class="row g-4">
        <div class="col-md-4 col-lg-4" v-for="author in filteredAuthors" :key="author.id">
          <div class="flip-card">
            <div class="flip-card-inner">
              
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthorsStore } from '../stores/authorsStore'

const authorsStore = useAuthorsStore()
const searchQuery = ref('')
const isLoadingAnimation = ref(true)

onMounted(async () => {

  setTimeout(() => {
    isLoadingAnimation.value = false
  }, 1800)
  
  await authorsStore.fetchList()
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

.author-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(11, 13, 18, 0.94);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-text {
  color: #fff;
  letter-spacing: 1px;
  background: linear-gradient(45deg, #20c997, #0d6efd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}


.writer-container {
  position: relative;
  width: 100px;
  height: 70px;
  margin: 0 auto 5px auto;
}

.desk-surface {
  position: absolute;
  bottom: 0;
  left: 10px;
  width: 80px;
  height: 6px;
  background: linear-gradient(90deg, #11998e, #38ef7d);
  border-radius: 3px;
  box-shadow: 0 5px 15px rgba(56, 239, 125, 0.3);
}

.book-open {
  position: absolute;
  bottom: 10px;
  left: 20px;
  width: 60px;
  height: 35px;
  display: flex;
}

.page-left, .page-right {
  width: 30px;
  height: 35px;
  background: #ffffff;
  border-top: 2px solid #38ef7d;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.page-left {
  border-radius: 3px 0 0 3px;
  transform-origin: right;
  transform: rotateX(10deg);
}

.page-right {
  border-radius: 0 3px 3px 0;
  transform-origin: left;
  transform: rotateX(10deg);
}

.writing-pen {
  position: absolute;
  bottom: 15px;
  left: 35px;
  width: 4px;
  height: 35px;
  background: linear-gradient(to top, #ffc107, #ff5722);
  border-radius: 2px;
  transform-origin: bottom center;
  transform: rotate(-25deg);
  animation: penWriting 1.5s infinite ease-in-out;
  box-shadow: 0 0 8px rgba(255, 193, 7, 0.6);
}

.pen-tip {
  position: absolute;
  bottom: 0;
  left: -1px;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
}

.ink-sparkle {
  position: absolute;
  bottom: 20px;
  left: 45px;
  width: 8px;
  height: 8px;
  background: #38ef7d;
  border-radius: 50%;
  box-shadow: 0 0 10px #38ef7d, 0 0 20px #38ef7d;
  animation: sparkleMove 1.5s infinite ease-in-out;
}

@keyframes penWriting {
  0%, 100% {
    transform: translate(0, 0) rotate(-20deg);
  }
  25% {
    transform: translate(12px, -6px) rotate(-35deg);
  }
  50% {
    transform: translate(22px, 0) rotate(-10deg);
  }
  75% {
    transform: translate(8px, -4px) rotate(-30deg);
  }
}

@keyframes sparkleMove {
  0%, 100% { transform: scale(0.6); opacity: 0.3; }
  50% { transform: scale(1.4); opacity: 1; }
}


.loader-progress-bar {
  width: 180px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 0 auto;
  overflow: hidden;
}

.loader-progress-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #11998e, #38ef7d);
  animation: progressAnimation 1.8s ease-in-out infinite;
  transform-origin: left;
}

@keyframes progressAnimation {
  0% { transform: scaleX(0); }
  50% { transform: scaleX(0.75); }
  100% { transform: scaleX(1); }
}


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


:global(body.dark) .flip-card-front {
  background-color: #1b1d24 !important;
  color: #fff !important;
}

:global(body.dark) .flip-card-back {
  background-color: #16181f !important;
  color: #fff !important;
  border: 1px solid #2d3139 !important;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>