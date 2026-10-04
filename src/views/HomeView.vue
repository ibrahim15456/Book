<template>
  <div class="home-container py-5 px-5">
  
    <div class="p-5 mb-5 rounded-4 shadow-sm text-center hero-section position-relative overflow-hidden">
      <div class="container py-4 position-relative z-1">
        <h1 class="display-4 fw-bold mb-3">Books & Authors</h1>
        <p class="col-lg-8 fs-5 mx-auto mb-0 description-text">
          Explore your favorite books, discover talented authors, and manage your literary collection with ease using our modern application.
        </p>
      </div>
    </div>

  
    <div class="cards-wrapper row g-4 text-center justify-content-center">
      
    
      <div 
        class="card-col transition-all"
        :class="{
          'col-md-4': activeCard === null,
          'col-12 active-expand': activeCard === 1,
          'card-hidden': activeCard !== null && activeCard !== 1
        }"
        @mouseenter="playCardSound('Book.m4a'); activeCard = 1"
        @mouseleave="activeCard = null"
      >
        <div class="feature-card p-4 rounded-4 shadow-sm border-0 d-flex flex-column justify-content-center align-items-center">
          <div class="mb-3 d-flex align-items-center justify-content-center img-container">
            <img src="/images/blue.jpg" alt="Book Catalog" class="custom-feature-img" />
          </div>
          <h4 class="fw-bold title-text mb-0">Rich Book Catalog</h4>
          
         
          <div class="desc-wrapper">
            <p class="description-text card-desc mt-3 mb-0">
              Browse through a wide variety of books complete with tags, publication years, and detailed descriptions.
            </p>
          </div>

          <div class="action-btn-wrapper mt-4">
            <router-link to="/books" class="btn btn-primary px-5 py-2 shadow-sm fw-semibold">Browse Books</router-link>
          </div>
        </div>
      </div>

    
      <div 
        class="card-col transition-all"
        :class="{
          'col-md-4': activeCard === null,
          'col-12 active-expand': activeCard === 2,
          'card-hidden': activeCard !== null && activeCard !== 2
        }"
        @mouseenter="playCardSound('Write.m4a'); activeCard = 2"
        @mouseleave="activeCard = null"
      >
        <div class="feature-card p-4 rounded-4 shadow-sm border-0 d-flex flex-column justify-content-center align-items-center">
          <div class="mb-3 d-flex align-items-center justify-content-center img-container">
            <img src="/images/green.jpg" alt="Talented Authors" class="custom-feature-img" />
          </div>
          <h4 class="fw-bold title-text mb-0">Talented Authors</h4>
          
        
          <div class="desc-wrapper">
            <p class="description-text card-desc mt-3 mb-0">
              Learn more about your favorite writers, their biographies, and background information.
            </p>
          </div>

          <div class="action-btn-wrapper mt-4">
            <router-link to="/authors" class="btn btn-outline-dark px-5 py-2 author-btn fw-semibold">View Authors</router-link>
          </div>
        </div>
      </div>

      
      <div 
        class="card-col transition-all"
        :class="{
          'col-md-4': activeCard === null,
          'col-12 active-expand': activeCard === 3,
          'card-hidden': activeCard !== null && activeCard !== 3
        }"
        @mouseenter="playCardSound('Duck.m4a'); activeCard = 3"
        @mouseleave="activeCard = null"
      >
        <div class="feature-card p-4 rounded-4 shadow-sm border-0 d-flex flex-column justify-content-center align-items-center">
          <div class="mb-3 d-flex align-items-center justify-content-center img-container">
            <img src="/images/red.jpg" alt="Admin Control" class="custom-feature-img" />
          </div>
          <h4 class="fw-bold title-text mb-0">Admin Control</h4>
          
          
          <div class="desc-wrapper">
            <p class="description-text card-desc mt-3 mb-0">
              Securely manage, add, edit, and delete books and authors via a clean protected dashboard.
            </p>
          </div>

          <div class="action-btn-wrapper mt-4">
            <router-link to="/admin" class="btn btn-dark px-5 py-2 shadow-sm fw-semibold admin-btn">Admin Dashboard</router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeCard = ref(null)

const playCardSound = (soundFileName) => {
  const audio = new Audio(`/${soundFileName}`)
  audio.volume = 0.5
  audio.play().catch((error) => {
    console.log("Audio play failed:", error)
  })
}
</script>

<style scoped>

.hero-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.hero-section h1,
.title-text {
  color: #111827;
}

.description-text {
  color: #6b7280;
  background: transparent !important;
}

.feature-card {
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.4s ease;
}


.cards-wrapper {
  perspective: 1000px;
}

.card-col {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity, width;
}


.desc-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  opacity: 0;
}

.card-desc {
  overflow: hidden;
  max-width: 550px;
}


.active-expand {
  transform: scale(1.01);
  z-index: 10;
}

.active-expand .feature-card {
  box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.12);
  padding-top: 2rem !important;
  padding-bottom: 2rem !important;
}

.active-expand .desc-wrapper {
  grid-template-rows: 1fr;
  opacity: 1;
}

.active-expand .custom-feature-img {
  transform: scale(1.1);
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.15));
}


.card-hidden {
  opacity: 0;
  transform: scale(0.6);
  pointer-events: none;
  width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
}


.img-container {
  width: 100%;
  height: 160px;
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: transparent !important;
}

.custom-feature-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease;
}

.action-btn-wrapper .btn {
  transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}


:global(body.dark) .hero-section {
  background-color: #121318 !important;
  background-image: none !important;
  border: 1px solid #1f2229 !important;
}

:global(body.dark) .hero-section h1,
:global(body.dark) .title-text {
  color: #ffffff !important;
  background: transparent !important;
}

:global(body.dark) .description-text {
  color: #d1d5db !important;
  background: transparent !important;
}


:global(body.dark) .feature-card {
  background-color: #121318 !important;
  border: 1px solid #1f2229 !important;
}


:global(body.dark) .active-expand .feature-card {
  background-color: #1a1c23 !important;
  border-color: #2e333d !important;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.6) !important;
}


:global(body.dark) .author-btn {
  color: #f3f4f6 !important;
  border-color: #4b5563 !important;
  background-color: transparent !important;
}

:global(body.dark) .author-btn:hover {
  background-color: #374151 !important;
  color: #ffffff !important;
}

:global(body.dark) .admin-btn {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
  color: #ffffff !important;
}

:global(body.dark) .admin-btn:hover {
  background-color: #374151 !important;
}
</style>