<template>
  <div class="home-container py-5 px-5">
    <!-- Hero Section -->
    <div class="p-5 mb-5 rounded-4 shadow-sm text-center hero-section position-relative overflow-hidden">
      <div class="container py-4  position-relative z-1">
        <h1 class="display-4 fw-bold mb-3">Books & Authors SPA</h1>
        <p class="col-lg-8 fs-5 mx-auto mb-0 description-text">
          Explore your favorite books, discover talented authors, and manage your literary collection with ease using our modern application.
        </p>
      </div>
    </div>

    <!-- Features Section -->
    <div class="row g-4 text-center">
      <!-- البطاقة الأولى -->
      <div class="col-md-4">
        <div class="feature-card p-4 rounded-4 shadow-sm h-100 border-0 transition-hover d-flex flex-column">
          <div class="mb-3 d-flex align-items-center justify-content-center">
            <img src="/images/blue.jpg" alt="Book Catalog" class="custom-feature-img" />
          </div>
          <h4 class="fw-bold mb-2 title-text">Rich Book Catalog</h4>
          <p class="description-text mb-4">Browse through a wide variety of books complete with tags, publication years, and detailed descriptions.</p>
          <div class="mt-auto">
            <router-link to="/books" class="btn btn-primary w-100 py-2 shadow-sm">Browse Books</router-link>
          </div>
        </div>
      </div>

      <!-- البطاقة الثانية -->
      <div class="col-md-4">
        <div class="feature-card p-4 rounded-4 shadow-sm h-100 border-0 transition-hover d-flex flex-column">
          <div class="mb-3 d-flex align-items-center justify-content-center">
           <img src="/images/green.jpg" alt="Talented Authors" class="custom-feature-img" />
          </div>
          <h4 class="fw-bold mb-2 title-text">Talented Authors</h4>
          <p class="description-text mb-4">Learn more about your favorite writers, their biographies, and background information.</p>
          <div class="mt-auto">
            <router-link to="/authors" class="btn btn-outline-dark w-100 py-2 author-btn">View Authors</router-link>
          </div>
        </div>
      </div>

      <!-- البطاقة الثالثة -->
      <div class="col-md-4">
        <div class="feature-card p-4 rounded-4 shadow-sm h-100 border-0 transition-hover d-flex flex-column">
          <div class="mb-3 d-flex align-items-center justify-content-center">
            <img src="/images/red.jpg" alt="Admin Control" class="custom-feature-img" />
          </div>
          <h4 class="fw-bold mb-2 title-text">Admin Control</h4>
          <p class="description-text mb-4">Securely manage, add, edit, and delete books and authors via a clean protected dashboard.</p>
          <div class="mt-auto">
            <router-link to="/admin" class="btn btn-dark w-100 py-2 shadow-sm">Admin Dashboard</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* الوضع الافتراضي (Light Mode) */
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
}

.feature-card {
  background-color: #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* الوضع الداكن (Dark Mode) - توحيد اللون بشكل كامل وتجاوز التدرج */
:global(body.dark) .hero-section {
  background-color: #121318 !important;
  background-image: none !important;
  border: 1px solid #1f2229 !important;
}

:global(body.dark) .hero-section h1,
:global(body.dark) .title-text {
  color: #ffffff !important;
}

:global(body.dark) .description-text {
  color: #d1d5db !important;
}

:global(body.dark) .feature-card {
  background-color: #121318 !important;
  border: 1px solid #1f2229 !important;
}

:global(body.dark) .author-btn {
  color: #f3f4f6 !important;
  border-color: #4b5563 !important;
}

:global(body.dark) .author-btn:hover {
  background-color: #374151 !important;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.3) !important;
}

.custom-feature-img {
  width: 180px;
  height: 180px;
  object-fit: contain;
}
</style>