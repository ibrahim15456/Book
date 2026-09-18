<template>
  <nav class="navbar navbar-expand-lg px-4 border-bottom" :class="isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/">BookStore</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/books">Books</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/authors">Authors</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin">Dashboard</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3">
          <router-link to="/cart" class="btn btn-outline-secondary position-relative">
            🛒 Cart <span class="badge bg-danger">{{ cartCount }}</span>
          </router-link>

          <!-- زر الثيم -->
          <button 
            @click="toggleTheme" 
            class="btn btn-sm"
            :class="isDarkMode ? 'btn-warning' : 'btn-dark border-secondary text-light'"
          >
            {{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
          </button>

          <!-- شكل حساب المستخدم العصري (دائرة الحرف الأول + الاسم + زر الخروج) -->
          <div v-if="userName || userEmail" class="d-flex align-items-center gap-2 user-profile-badge">
            <div class="user-avatar-circle">
              {{ userInitial }}
            </div>
            <span class="small fw-semibold text-truncate" style="max-width: 120px;" :class="isDarkMode ? 'text-light' : 'text-dark'">
              {{ userName || userEmail }}
            </span>
            <button @click="handleSignOut" class="btn btn-sm btn-outline-danger ms-1">
              Sign Out
            </button>
          </div>

          <div v-else>
            <router-link to="/auth" class="btn btn-sm btn-danger px-3">
              Sign In
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  cartCount: {
    type: Number,
    default: 0
  }
});

const router = useRouter();
const isDarkMode = ref(false);
const userName = ref('');
const userEmail = ref('');

const updateUserData = () => {
  userName.value = localStorage.getItem('userName') || '';
  userEmail.value = localStorage.getItem('userEmail') || '';
};

// استخراج الحرف الأول من اسم المستخدم أو الإيميل لعرضه داخل الدائرة العصرية
const userInitial = computed(() => {
  const name = userName.value || userEmail.value;
  return name ? name.charAt(0).toUpperCase() : 'U';
});

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.body.classList.add('dark');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    isDarkMode.value = false;
    document.body.classList.remove('dark');
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }

  updateUserData();
  window.addEventListener('storage', updateUserData);
  window.addEventListener('user-logged-in', updateUserData);
});

onUnmounted(() => {
  window.removeEventListener('storage', updateUserData);
  window.removeEventListener('user-logged-in', updateUserData);
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.body.classList.add('dark');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    document.documentElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
};

const handleSignOut = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  updateUserData();
  router.push('/auth');
};
</script>

<style scoped>
/* تصميم الدائرة العصرية للمستخدم شبيهة بيوتيوب والمنصات الحديثة */
.user-avatar-circle {
  width: 34px;
  height: 34px;
  background-color: #6b7280; /* لون خلفية عصري متناسق */
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.user-profile-badge {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px 10px 4px 4px;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

:global(body.dark) .user-profile-badge {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
<!-- 
cd books-authors-spa
npx json-server db.json --port 3000
cd books-authors-spa
npm run dev
 -->