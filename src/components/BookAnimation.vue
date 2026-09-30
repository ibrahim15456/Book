<template>
  <Transition name="fade">
    <div v-if="isVisible" class="book-loader-overlay">
      <div class="loader-content text-center">
        <!-- كتاب الأنيماشن الاحترافي -->
        <div class="book">
          <div class="inner">
            <div class="left"></div>
            <div class="middle"></div>
            <div class="right"></div>
          </div>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <h4 class="loading-text mt-4 fw-bold">Loading Your Library...</h4>
        <p class="text-secondary small">Preparing books, authors, and immersive views</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['finished'])
const isVisible = ref(true)

onMounted(() => {
  // مدة عرض الأنيماشن الاحترافي (مثلاً 1.8 ثانية ليظهر بكامل جماله)
  setTimeout(() => {
    isVisible.value = false
    emit('finished')
  }, 1800)
})
</script>

<style scoped>
.book-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 17, 23, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-text {
  color: #fff;
  letter-spacing: 1px;
  background: linear-gradient(45deg, #0d6efd, #6610f2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* تصميم الكتاب ثلاثي الأبعاد الاحترافي */
.book {
  perspective: 600px;
  width: 90px;
  height: 60px;
  position: relative;
  margin: auto;
  transform-style: preserve-3d;
}

.inner {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  transform: rotateX(15deg) rotateY(15deg);
}

.left, .middle, .right {
  position: absolute;
  top: 0;
  bottom: 0;
}

.left {
  left: 0;
  width: 12px;
  background-color: #0d6efd;
  border-radius: 3px 0 0 3px;
  transform: rotateY(-30deg);
  transform-origin: right;
}

.middle {
  left: 12px;
  width: 66px;
  background-color: #f8f9fa;
  border-radius: 0 3px 3px 0;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
}

.right {
  right: 0;
  width: 12px;
  background-color: #0d6efd;
  border-radius: 0 3px 3px 0;
  transform: rotateY(30deg);
  transform-origin: left;
}

/* الصفحات المتحركة داخل الكتاب */
.book ul {
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  left: 14px;
  top: 3px;
  width: 62px;
  height: 54px;
  transform-style: preserve-3d;
  transform: rotateX(15deg) rotateY(15deg);
}

.book li {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0 2px 2px 0;
  transform-origin: left;
  animation: pageFlip 1.8s infinite ease-in-out;
}

/* توزيع سرعة وحركة الصفحات تنازلياً */
.book li:nth-child(1) { animation-delay: 0.1s; }
.book li:nth-child(2) { animation-delay: 0.2s; }
.book li:nth-child(3) { animation-delay: 0.3s; }
.book li:nth-child(4) { animation-delay: 0.4s; }
.book li:nth-child(5) { animation-delay: 0.5s; }
.book li:nth-child(6) { animation-delay: 0.6s; }
.book li:nth-child(7) { animation-delay: 0.7s; }
.book li:nth-child(8) { animation-delay: 0.8s; }
.book li:nth-child(9) { animation-delay: 0.9s; }
.book li:nth-child(10) { animation-delay: 1.0s; }

@keyframes pageFlip {
  0% {
    transform: rotateY(0deg);
    opacity: 1;
  }
  50% {
    transform: rotateY(-180deg);
    opacity: 0.8;
  }
  100% {
    transform: rotateY(-180deg);
    opacity: 0;
  }
}

/* تأثير الخروج السلس للـ Overlay */
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>