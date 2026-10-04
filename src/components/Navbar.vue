<template>
  <nav class="navbar navbar-expand-lg px-4 border-bottom"
    :class="isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold d-flex align-items-center gap-2 magic-brand" to="/" @click.prevent="handleMagicClick">
        <div class="logo-wrapper" :class="{ 'magic-burst': isMagical }">
          <img src="/logoo.png" alt="Logo" class="nav-logo" />
        </div>
        <div class="brand-text-container d-flex flex-column lh-1">
          <span class="brand-ibra">Ibra<span class="magic-wand" :class="{ 'animate-magic': isMagical }">🪄</span></span>
          <span class="brand-book">Book</span>
        </div>
      </router-link>

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
          <router-link to="/cart" id="cart-nav-icon" class="btn btn-outline-secondary position-relative">
            🛒 Cart <span class="badge bg-danger">{{ cartCount }}</span>
          </router-link>

          <button @click="toggleTheme" class="btn btn-sm"
            :class="isDarkMode ? 'btn-warning' : 'btn-dark border-secondary text-light'">
            {{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
          </button>

          <div v-if="userName || userEmail" class="d-flex align-items-center gap-2 user-profile-badge">
            <div class="user-avatar-circle">
              {{ userInitial }}
            </div>
            <span class="small fw-semibold text-truncate" style="max-width: 120px;"
              :class="isDarkMode ? 'text-light' : 'text-dark'">
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
const isMagical = ref(false);

const updateUserData = () => {
  userName.value = localStorage.getItem('userName') || '';
  userEmail.value = localStorage.getItem('userEmail') || '';
};

const userInitial = computed(() => {
  const name = userName.value || userEmail.value;
  return name ? name.charAt(0).toUpperCase() : 'U';
});

const handleMagicClick = () => {
  isMagical.value = true;
  
  // تشغيل صوت السحر عند الضغط على الشعار
  const audio = new Audio('/Magic.m4a');
  audio.volume = 0.6;
  audio.play().catch((error) => {
    console.log("Magic audio play failed:", error);
  });
  
  // إطلاق حدث الألعاب النارية لمدة 5 ثوانٍ عبر التطبيق بالكامل
  window.dispatchEvent(new CustomEvent('trigger-fireworks'));
  
  // مدة تأثير الأنيميشن واللوجو
  setTimeout(() => {
    isMagical.value = false;
  }, 1000);

  router.push('/');
};

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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap');

.logo-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.4s ease;
}

/* تأثير الانفجار السحري حول اللوجو */
.logo-wrapper.magic-burst {
  animation: logoExplosion 1s ease-in-out;
}

@keyframes logoExplosion {
  0% {
    transform: scale(1) rotate(0deg);
  }
  30% {
    transform: scale(1.35) rotate(-10deg);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.9), 0 0 40px rgba(138, 43, 226, 0.6);
  }
  60% {
    transform: scale(1.2) rotate(10deg);
    box-shadow: 0 0 30px rgba(255, 0, 128, 0.8), 0 0 50px rgba(0, 255, 255, 0.7);
  }
  100% {
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 0px transparent;
  }
}

.nav-logo {
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: 6px;
  transition: transform 0.3s ease;
}

.magic-brand:hover .nav-logo {
  transform: scale(1.1) rotate(5deg);
}

.brand-text-container {
  font-family: 'Montserrat', sans-serif;
  line-height: 1.1;
}

.brand-ibra {
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: -0.3px;
  display: inline-flex;
  align-items: center;
}

.brand-book {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  opacity: 0.85;
}

/* حركة العصا السحرية المكبرة والساطعة */
.magic-wand {
  display: inline-block;
  transform-origin: bottom center;
  transition: transform 0.3s ease;
}

.magic-wand.animate-magic {
  animation: giantMagicSpell 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes giantMagicSpell {
  0% {
    transform: scale(1) rotate(0deg) translateY(0);
  }
  20% {
    transform: scale(2.2) rotate(-35deg) translateY(-8px);
    filter: drop-shadow(0 0 15px #ffd700);
  }
  40% {
    transform: scale(2.5) rotate(45deg) translateY(-12px);
    filter: drop-shadow(0 0 25px #ff007f);
  }
  60% {
    transform: scale(1.8) rotate(-20deg) translateY(-5px);
    filter: drop-shadow(0 0 15px #00ffff);
  }
  80% {
    transform: scale(1.3) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg) translateY(0);
    filter: drop-shadow(0 0 0px transparent);
  }
}

.user-avatar-circle {
  width: 34px;
  height: 34px;
  background-color: #6b7280;
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