<template>
  <Transition name="fade">
    <div v-if="isVisible" class="author-loader-overlay">
      <div class="loader-content text-center">
        
        <!-- أيقونة الكاتب والقلم الواضحة والمبتكرة -->
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

        <h3 class="loading-main-title mt-4">Exploring Authors</h3>
        <p class="loading-sub-title mt-1">Unveiling brilliant literary minds...</p>
        
        <!-- شريط تقدم أنيق ومضيء -->
        <div class="loader-progress-bar mt-3">
          <div class="loader-progress-fill"></div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['finished'])
const isVisible = ref(true)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = false
    emit('finished')
  }, 1800)
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

.loading-main-title {
  color: #fff;
  font-weight: 700;
  letter-spacing: 1.5px;
  font-size: 1.4rem;
  background: linear-gradient(135deg, #38ef7d, #11998e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.loading-sub-title {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* تصميم حاوية الكاتب والقلم */
.writer-container {
  position: relative;
  width: 100px;
  height: 70px;
  margin: 0 auto 15px auto;
}

/* سطح المكتب أو القاعدة */
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

/* الكتاب المفتوح على الطاولة */
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

/* حركة القلم وهو يكتب بوضوح */
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

/*وميض الحبر أو الإبداع أثناء الكتابة */
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

/* شريط التحميل المتدرج */
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

.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>