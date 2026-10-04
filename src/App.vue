<template>
  <div id="app" class="d-flex flex-column min-vh-100" :style="appBackgroundStyle">
    <Navbar :cartCount="cartCount" />
    <main class="flex-fill container my-4">
      <router-view 
        :cart="cart" 
        @add-to-cart="addToCart" 
        @remove="removeFromCart" 
        @clear="cart = []" 
      />
    </main>

    <ChatWidget />

    <footer class="text-center py-3 border-top mt-auto" :class="isDarkTheme ? 'bg-dark text-light border-secondary' : 'bg-light text-dark'">
      <p class="mb-0">&copy; 2026 - Ibra Book</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Navbar from './components/Navbar.vue';
import ChatWidget from './components/ChatWidget.vue';
import bgImage from './assets/bg.png';
import confetti from 'canvas-confetti';

const cart = ref([]);
const isDarkTheme = ref(false);

// دالة إطلاق الألعاب النارية المذهلة لمدة 5 ثوانٍ
const startFireworks = () => {
  const duration = 5 * 1000; // 5 ثوانٍ
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkTheme.value = true;
    document.body.classList.add('dark');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    isDarkTheme.value = false;
    document.body.classList.remove('dark');
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }

  const observer = new MutationObserver(() => {
    isDarkTheme.value = document.body.classList.contains('dark');
  });
  
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // الاستماع لحدث تفعيل الألعاب النارية القادم من الناف بار
  window.addEventListener('trigger-fireworks', startFireworks);
});

onUnmounted(() => {
  window.removeEventListener('trigger-fireworks', startFireworks);
});

const appBackgroundStyle = computed(() => {
  const gradient = isDarkTheme.value
    ? 'linear-gradient(rgba(11, 12, 16, 0.92), rgba(11, 12, 16, 0.92))' 
    : 'linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4))';

  return {
    backgroundImage: `${gradient}, url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  };
});

const addToCart = (book) => {
  const existingItem = cart.value.find(item => item.id === book.id);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.value.push({ ...book, quantity: 1 });
  }
};

const removeFromCart = (bookId) => {
  cart.value = cart.value.filter(item => item.id !== bookId);
};

const cartCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.quantity || 1), 0);
});
</script>

<style>
#app {
  
}
</style>