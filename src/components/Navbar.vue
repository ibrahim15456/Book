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

          <div v-if="userName || userEmail" class="d-flex align-items-center gap-2 user-profile-badge" :class="isDarkMode ? 'dark-mode-badge' : ''">
            <router-link to="/profile" class="btn border d-flex align-items-center gap-2 text-decoration-none" :class="isDarkMode ? 'btn-dark text-light border-secondary' : 'btn-light text-dark'">
              <span class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold"
                style="width: 28px; height: 28px; font-size: 0.85rem;">
                {{ userInitial }}
              </span>
              <span class="fw-semibold" :class="isDarkMode ? 'text-light' : 'text-dark'">{{ userName || 'Ibrahim Mohamed' }}</span>
            </router-link>

            <button @click="handleSignOut" class="btn btn-sm btn-outline-danger ms-1" :disabled="isLoggingOut">
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

  <!-- شاشة وداع وتحميل أثناء تسجيل الخروج -->
  <div v-if="isLoggingOut" class="logout-overlay">
    <div class="logout-card text-center p-5 shadow-lg">
      <div class="goodbye-icon mb-3">👋</div>
      <h3 class="fw-bold mb-2 text-gradient">Goodbye, {{ userName || 'Friend' }}!</h3>
      <p class="text-muted mb-4">We hope to see you again soon...</p>
      
      <div class="progress-bar-container">
        <div class="progress-fill"></div>
      </div>
      <span class="small text-secondary mt-2 d-block">Signing out securely...</span>
    </div>
  </div>
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
const isLoggingOut = ref(false);

const updateUserData = () => {
  userName.value = localStorage.getItem('userName') || localStorage.getItem('user') || '';
  userEmail.value = localStorage.getItem('userEmail') || '';
};

const userInitial = computed(() => {
  const name = userName.value || userEmail.value;
  return name ? name.charAt(0).toUpperCase() : 'U';
});

const handleMagicClick = () => {
  isMagical.value = true;
  
  const audio = new Audio('/Magic.m4a');
  audio.volume = 0.6;
  audio.play().catch((error) => {
    console.log("Magic audio play failed:", error);
  });
  
  window.dispatchEvent(new CustomEvent('trigger-fireworks'));
  
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
  window.addEventListener('username-updated', updateUserData);
});

onUnmounted(() => {
  window.removeEventListener('storage', updateUserData);
  window.removeEventListener('user-logged-in', updateUserData);
  window.removeEventListener('username-updated', updateUserData);
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
  isLoggingOut.value = true;

  const goodbyeAudio = new Audio('/GoodBye.m4a');
  goodbyeAudio.volume = 0.8;
  goodbyeAudio.play().catch(err => console.log("GoodBye audio error:", err));

  setTimeout(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhoto');
    localStorage.removeItem('userGender');
    localStorage.removeItem('userInterests');
    sessionStorage.removeItem('isAdminAuth');
    
    updateUserData();
    isLoggingOut.value = false;
    router.push('/auth');
  }, 9000);
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

.logo-wrapper.magic-burst {
  animation: logoExplosion 1s ease-in-out;
}

@keyframes logoExplosion {
  0% { transform: scale(1) rotate(0deg); }
  30% { transform: scale(1.35) rotate(-10deg); box-shadow: 0 0 20px rgba(255, 215, 0, 0.9), 0 0 40px rgba(138, 43, 226, 0.6); }
  60% { transform: scale(1.2) rotate(10deg); box-shadow: 0 0 30px rgba(255, 0, 128, 0.8), 0 0 50px rgba(0, 255, 255, 0.7); }
  100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0px transparent; }
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

.magic-wand {
  display: inline-block;
  transform-origin: bottom center;
  transition: transform 0.3s ease;
}

.magic-wand.animate-magic {
  animation: giantMagicSpell 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes giantMagicSpell {
  0% { transform: scale(1) rotate(0deg) translateY(0); }
  20% { transform: scale(2.2) rotate(-35deg) translateY(-8px); filter: drop-shadow(0 0 15px #ffd700); }
  40% { transform: scale(2.5) rotate(45deg) translateY(-12px); filter: drop-shadow(0 0 25px #ff007f); }
  60% { transform: scale(1.8) rotate(-20deg) translateY(-5px); filter: drop-shadow(0 0 15px #00ffff); }
  80% { transform: scale(1.3) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg) translateY(0); filter: drop-shadow(0 0 0px transparent); }
}

.user-profile-badge {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px 10px 4px 4px;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.dark-mode-badge {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeInOverlay 0.5s ease;
}

.logout-card {
  background: white;
  border-radius: 16px;
  width: 350px;
  max-width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: scaleUpCard 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

:global(body.dark) .logout-card {
  background: #1e1e1e;
  color: #f8f9fa;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.goodbye-icon {
  font-size: 3.5rem;
  animation: waveHand 1.5s infinite ease-in-out;
}

@keyframes waveHand {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-20deg); }
}

.text-gradient {
  background: linear-gradient(45deg, #ff416c, #ff4b2b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

:global(body.dark) .progress-bar-container {
  background-color: #2d2d2d;
}

.progress-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #ff416c, #ff4b2b);
  border-radius: 4px;
  animation: fillProgress 9s linear forwards;
}

@keyframes fillProgress {
  0% { width: 0%; }
  100% { width: 100%; }
}

@keyframes fadeInOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUpCard {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
<!-- 
cd books-authors-spa
npx json-server db.json --port 3000
cd books-authors-spa
npm run dev
 -->