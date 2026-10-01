<template>
  <div class="container py-4">
    <div v-if="booksStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="book" class="row align-items-center">
      <div class="col-md-4 text-center mb-4 mb-md-0">
        <div
          class="book-container"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          @click="handleBookClick"
          ref="bookRef"
        >
          <div
            class="book-3d"
            :class="{ 'is-open': isOpen }"
            :style="bookStyle"
          >
            <div class="cover front book-cover-img-target">
              <img
                :src="book.coverUrl"
                alt="Book Cover"
                class="book-main-img"
              />

              <div
                class="glare"
                :style="glareStyle"
              ></div>
            </div>

            <div class="spine">
              <span class="spine-title">
                {{ book.title }}
              </span>
            </div>

            <div class="inside-page">
              <div class="page-content">
                <h6 class="fw-bold mb-1">
                  {{ book.title }}
                </h6>

                <p class="small text-muted mb-2">
                  By {{ book.author || (author ? author.name : 'Unknown') }}
                </p>

                <div class="page-line"></div>
                <div class="page-line short"></div>
                <div class="page-line"></div>

                <p class="preview-text text-secondary mt-3">
                  {{ book.description?.slice(0, 90) }}...
                </p>

                <span
                  v-if="book.readUrl"
                  class="tap-hint text-success"
                >
                  📖 Opening to read...
                </span>

                <span
                  v-else
                  class="tap-hint text-muted fw-normal"
                >
                  🔒 Preview mode
                </span>
              </div>
            </div>

            <div class="cover back"></div>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <h1 class="fw-bold mb-3">
          {{ book.title }}
        </h1>

        <h4 class="text-muted mb-3">
          Author:

          <!-- عرض اسم المؤلف مباشرة إذا كان نصاً حراً، أو عبر الـ router-link لو مرتبط بـ author ID -->
          <router-link
            v-if="author && !book.author"
            :to="`/authors/${author.id}`"
            class="text-decoration-none"
          >
            {{ author.name }}
          </router-link>

          <span v-else>
            {{ book.author || (author ? author.name : 'Unknown Author') }}
          </span>
        </h4>

        <p class="text-secondary">
          <strong>Publication Year:</strong>
          {{ book.year }}
        </p>

        <h3
          class="fw-bold mb-3"
          :class="
            book.price === 0 || !book.price
              ? 'text-info'
              : 'text-success'
          "
        >
          {{
            book.price === 0 || !book.price
              ? 'Free Book'
              : `$${book.price.toFixed(2)}`
          }}
        </h3>

        <div class="mb-3">
          <span
            v-for="tag in book.tags"
            :key="tag"
            class="badge bg-primary me-1"
          >
            {{ tag }}
          </span>
        </div>

        <hr />

        <h5>Description</h5>

        <p class="lead fs-6 text-muted">
          {{ book.description }}
        </p>

        <div class="mt-4 d-flex gap-3 align-items-center flex-wrap">
          <router-link
            to="/books"
            class="btn btn-outline-secondary"
          >
            <i class="bi bi-arrow-left"></i>
            Back to Books
          </router-link>

          <button
            v-if="book.readUrl"
            @click="handleReadForFree"
            class="btn btn-info text-white btn-lg"
          >
            Read for Free
          </button>

          <template v-else>
            <button
              @click="handleAddToCart"
              class="btn btn-primary btn-lg add-cart-btn"
            >
              Add to Cart
            </button>

            <button
              @click="handleBuyNow"
              class="btn btn-success btn-lg buy-now-btn"
            >
              Buy Now
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
    author.value = await authorsStore.fetchById(
      book.value.authorId
    )
  }
})

const triggerFlyEffect = () => {
  if (!book.value) return

  const imgTarget = document.querySelector(
    '.book-cover-img-target img'
  )

  const cartIcon =
    document.querySelector('#cart-nav-icon') ||
    document.querySelector('[data-cart-icon]') ||
    document.querySelector('.cart-icon') ||
    document.querySelector('.bi-cart') ||
    document.querySelector('.bi-cart3') ||
    document.querySelector('.fa-shopping-cart')

  if (!imgTarget) return

  const startRect = imgTarget.getBoundingClientRect()

  const startX = startRect.left
  const startY = startRect.top

  let endX
  let endY

  if (cartIcon) {
    const cartRect = cartIcon.getBoundingClientRect()

    endX =
      cartRect.left +
      cartRect.width / 2 -
      20

    endY =
      cartRect.top +
      cartRect.height / 2 -
      20
  } else {
    endX = window.innerWidth - 80
    endY = 40
  }

  const flyer = document.createElement('div')

  flyer.className = 'flying-book-item'

  flyer.style.backgroundImage =
    `url("${book.value.coverUrl}")`

  flyer.style.left = `${startX}px`
  flyer.style.top = `${startY}px`

  flyer.style.width = `${startRect.width}px`
  flyer.style.height = `${startRect.height}px`

  document.body.appendChild(flyer)

  const duration = 800

  const startTime = performance.now()

  const animateFlight = (currentTime) => {
    const elapsed = currentTime - startTime

    const progress = Math.min(
      elapsed / duration,
      1
    )

    const easeProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 -
          Math.pow(
            -2 * progress + 2,
            2
          ) / 2

    const currentX =
      startX +
      (endX - startX) *
        easeProgress

    const currentY =
      startY +
      (endY - startY) *
        easeProgress

    const arcHeight = -120

    const arc =
      Math.sin(progress * Math.PI) *
      arcHeight

    const currentScale =
      1 -
      0.7 * progress

    const currentRotate =
      360 * progress

    flyer.style.transform = `
      translate3d(
        ${currentX - startX}px,
        ${currentY - startY + arc}px,
        0
      )
      scale(${currentScale})
      rotate(${currentRotate}deg)
    `

    flyer.style.opacity =
      `${1 - progress * 0.2}`

    if (progress < 1) {
      requestAnimationFrame(
        animateFlight
      )
    } else {
      flyer.remove()

      if (cartIcon) {
        cartIcon.classList.add(
          'cart-bounce-effect'
        )

        setTimeout(() => {
          cartIcon.classList.remove(
            'cart-bounce-effect'
          )
        }, 300)
      }
    }
  }

  requestAnimationFrame(
    animateFlight
  )
}

const handleAddToCart = () => {
  if (!book.value) return

  triggerFlyEffect()

  emit(
    'add-to-cart',
    book.value
  )

  window.dispatchEvent(
    new CustomEvent(
      'trigger-cart-animation'
    )
  )
}

const handleBuyNow = () => {
  if (!book.value) return

  router.push('/cart')
}

const bookRef = ref(null)

const rotateX = ref(0)
const rotateY = ref(-20)

const scale = ref(1)

const glareOpacity = ref(0)

const glarePos = ref({
  x: 50,
  y: 50
})

const isOpen = ref(false)

const handleBookClick = () => {
  if (book.value?.readUrl) {
    handleReadForFree()
  } else {
    isOpen.value = !isOpen.value
  }
}

const handleReadForFree = () => {
  if (!book.value) return

  isOpen.value = true

  setTimeout(() => {
    router.push(
      `/books/${book.value.id}/read`
    )
  }, 700)
}

const handleMouseMove = (e) => {
  if (!bookRef.value) return

  const rect =
    bookRef.value.getBoundingClientRect()

  const width = rect.width
  const height = rect.height

  const mouseX =
    (e.clientX - rect.left) /
      width -
    0.5

  const mouseY =
    (e.clientY - rect.top) /
      height -
    0.5

  const maxRotate =
    isOpen.value
      ? 15
      : 45

  rotateY.value =
    mouseX * maxRotate

  rotateX.value =
    -mouseY * maxRotate

  scale.value = 1.1

  glareOpacity.value = 0.35

  glarePos.value = {
    x:
      ((e.clientX - rect.left) /
        width) *
      100,

    y:
      ((e.clientY - rect.top) /
        height) *
      100
  }
}

const handleMouseLeave = () => {
  rotateX.value = 0

  rotateY.value =
    isOpen.value
      ? 10
      : -20

  scale.value = 1

  glareOpacity.value = 0
}

const bookStyle = computed(() => ({
  transform: `
    scale3d(
      ${scale.value},
      ${scale.value},
      ${scale.value}
    )
    rotateX(${rotateX.value}deg)
    rotateY(${rotateY.value}deg)
  `
}))

const glareStyle = computed(() => ({
  opacity: glareOpacity.value,

  background: `
    radial-gradient(
      circle at
      ${glarePos.value.x}%
      ${glarePos.value.y}%,
      rgba(255,255,255,0.7) 0%,
      rgba(255,255,255,0) 80%
    )
  `
}))
</script>

<style scoped>
:global(.flying-book-item) {
  position: fixed;
  z-index: 999999;
  pointer-events: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 6px;
  box-shadow:
    0 15px 35px
    rgba(0, 0, 0, 0.4);
  transform-origin: center center;
  will-change:
    transform,
    opacity;
  overflow: hidden;
}

@keyframes bounceCart {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.25);
  }
}

:global(.cart-bounce-effect) {
  animation:
    bounceCart
    0.3s
    ease-in-out;
}

.book-container {
  perspective: 1200px;
  width: 230px;
  height: 340px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 auto;
}

.book-3d {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition:
    transform
    0.3s
    cubic-bezier(
      0.25,
      1,
      0.5,
      1
    );
  border-radius: 4px;
  box-shadow:
    0 15px 35px
    rgba(0, 0, 0, 0.25);
}

.cover.front {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  backface-visibility: hidden;
  transform:
    translateZ(10px);
  transform-origin: left;
  transition:
    transform
    0.7s
    cubic-bezier(
      0.4,
      0,
      0.2,
      1
    );
  z-index: 2;
}

.book-3d.is-open
.cover.front {
  transform:
    translateZ(10px)
    rotateY(-155deg);
}

.cover.front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.glare {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition:
    opacity
    0.3s
    ease;
}

.inside-page {
  position: absolute;
  width: 98%;
  height: 98%;
  top: 1%;
  left: 1%;
  background: #fdfbf7;
  border-radius:
    2px
    4px
    4px
    2px;
  box-shadow:
    inset
    3px
    0
    10px
    rgba(
      0,
      0,
      0,
      0.1
    );
  transform:
    translateZ(0px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: border-box;
  text-align: left;
  overflow: hidden;
}

.page-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-line {
  height: 3px;
  background: #e5e0d8;
  border-radius: 2px;
  margin-bottom: 6px;
  width: 100%;
}

.page-line.short {
  width: 60%;
}

.preview-text {
  font-size: 11px;
  line-height: 1.4;
  margin: 0;
}

.tap-hint {
  margin-top: auto;
  font-size: 10px;
  font-weight: bold;
}

.spine {
  position: absolute;
  width: 20px;
  height: 100%;
  left: -10px;
  top: 0;
  background: #2b2b2b;
  color: #fff;
  transform:
    rotateY(-90deg)
    translateZ(0px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius:
    2px
    0
    0
    2px;
  overflow: hidden;
  padding: 8px 0;
}

.spine-title {
  writing-mode:
    vertical-rl;
  text-orientation:
    mixed;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #e0e0e0;
  white-space: nowrap;
  max-height: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cover.back {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #222;
  transform:
    translateZ(-10px)
    rotateY(180deg);
  border-radius: 4px;
}
</style>