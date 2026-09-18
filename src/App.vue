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
      <p class="mb-0">&copy; 2026 - Books & Authors SPA (ITI Vue Project)</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import ChatWidget from './components/ChatWidget.vue';
import bgImage from './assets/bg.png';

const cart = ref([]);
const isDarkTheme = ref(false);

onMounted(() => {
  // فحص الثيم المحفوظ أو حالة كلاس الـ body عند التحميل الأول
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

  // مراقبة تغييرات كلاس الـ body فور الضغط على زرار التبديل
  const observer = new MutationObserver(() => {
    isDarkTheme.value = document.body.classList.contains('dark');
  });
  
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});

// تعديل شفافية الخلفية لتكون أداكن بكثير في الوضع الليلي لتخفي أي بقايا بيضاء
const appBackgroundStyle = computed(() => {
  const gradient = isDarkTheme.value
    ? 'linear-gradient(rgba(11, 12, 16, 0.92), rgba(11, 12, 16, 0.92))' // خلفية داكنة صريحة وقوية
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
  /* التنسيقات الأساسية تدار ديناميكياً عبر المتغيرات والخصائص المحسوبة */
}
</style>