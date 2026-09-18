<template>
  <div class="container py-4">
    <!-- Hero Header Card -->
    <div class="p-5 mb-5 rounded-4 shadow-sm text-center about-hero-section">
      <h1 class="fw-bold mb-3 text-primary" style="letter-spacing: -0.5px;">About Books & Authors SPA</h1>
      <p class="about-description lead mx-auto" style="max-width: 700px;">
        Discover the core philosophy and features behind our literary platform. Explore how we connect readers with a rich catalog of books and talented creators seamlessly.
      </p>
    </div>

    <!-- FAQ / Features Section -->
    <div class="mb-5">
      <h3 class="fw-bold mb-4 text-center text-primary">Platform Insights & FAQ</h3>
      
      <div class="accordion shadow-sm rounded-4 overflow-hidden border-0" id="faqAccordion">
        <!-- Item 1 -->
        <div class="accordion-item border-0 border-bottom about-accordion-item">
          <h2 class="accordion-header" id="headingOne">
            <button class="accordion-button fw-semibold py-3 shadow-none text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              What can I find in the Book Catalog?
            </button>
          </h2>
          <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
            <div class="accordion-body about-accordion-body py-3">
              The catalog provides a wide variety of books complete with tags, publication years, detailed descriptions, and instant search and filter options by author and type.
            </div>
          </div>
        </div>

        <!-- Item 2 -->
        <div class="accordion-item border-0 border-bottom about-accordion-item">
          <h2 class="accordion-header" id="headingTwo">
            <button class="accordion-button collapsed fw-semibold py-3 shadow-none text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              How does the Authors section work?
            </button>
          </h2>
          <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
            <div class="accordion-body about-accordion-body py-3">
              It allows readers to learn more about their favorite writers, exploring their biographies, backgrounds, and connected literary works in one clean view.
            </div>
          </div>
        </div>

        <!-- Item 3 -->
        <div class="accordion-item border-0 about-accordion-item">
          <h2 class="accordion-header" id="headingThree">
            <button class="accordion-button collapsed fw-semibold py-3 shadow-none text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              What features are available in the Admin Dashboard?
            </button>
          </h2>
          <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
            <div class="accordion-body about-accordion-body py-3">
              Admins can securely manage content through an intuitive dashboard, giving them full control to add, edit, and delete books and authors dynamically.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Designer Signature Section -->
    <div class="text-center py-3 mb-3">
      <p class="about-description mb-0 fw-medium">
        Designed by <h5 class="fw-bold d-inline text-primary">Ibrahim Mohamed Mousa</h5>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ألوان ثابتة وواضحة جداً لا تتأثر بتبديل الثيم لضمان القراءة المثالية */
.about-hero-section {
  background-color: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

.about-description {
  color: #374151 !important; /* لون رمادي غامق ممتاز وواضح للقراءة */
}

.about-accordion-item {
  background-color: #ffffff !important;
}

.accordion-button {
  background-color: #ffffff !important;
}

.accordion-button:not(.collapsed) {
  background-color: #f3f4f6 !important;
  box-shadow: none !important;
}

.about-accordion-body {
  background-color: #ffffff !important;
  color: #374151 !important; /* لون نص ثابت وواضح جداً داخل الأكورديون */
}
</style>