<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">BookStore</h2>
      <p class="auth-subtitle">
        {{ isLogin ? 'Welcome back! Please sign in to continue.' : 'Create an account to explore our library.' }}
      </p>

      <!-- Google Sign-In Button -->
      <div class="google-auth-section mb-3">
        <button @click="signInWithGoogle" class="google-btn">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="google-icon" />
          <span>Continue with Google</span>
        </button>
      </div>

      <div class="divider">
        <span>OR</span>
      </div>

      <!-- Toggle Tabs -->
      <div class="auth-tabs">
        <button 
          :class="['tab-btn', { active: isLogin }]" 
          @click="isLogin = true; errorMessage = ''"
        >
          Sign In
        </button>
        <button 
          :class="['tab-btn', { active: !isLogin }]" 
          @click="isLogin = false; errorMessage = ''"
        >
          Sign Up
        </button>
      </div>

      <!-- Error Message Box -->
      <div v-if="errorMessage" class="alert-error">
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Full Name (Sign Up only) -->
        <div v-if="!isLogin" class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="name" placeholder="Enter your name" required />
        </div>

        <!-- Gender Selection (Sign Up only) -->
        <div v-if="!isLogin" class="form-group">
          <label>Gender</label>
          <div class="gender-options">
            <label :class="['gender-card', { active: gender === 'male' }]">
              <input type="radio" value="male" v-model="gender" hidden />
              <img src="/images/male.jpg" alt="Male" class="gender-icon-img" />
              <span>Male</span>
            </label>
            <label :class="['gender-card', { active: gender === 'female' }]">
              <input type="radio" value="female" v-model="gender" hidden />
              <img src="/images/female.jpg" alt="Female" class="gender-icon-img" />
              <span>Female</span>
            </label>
          </div>
        </div>

        <!-- Book Interests Checkboxes (Sign Up only) -->
        <div v-if="!isLogin" class="form-group">
          <label>Favorite Book Genres / Interests</label>
          <div class="checkbox-grid">
            <label v-for="genre in availableGenres" :key="genre" class="checkbox-label">
              <input type="checkbox" :value="genre" v-model="interests" />
              <span>{{ genre }}</span>
            </label>
          </div>
        </div>

        <!-- Email Address -->
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="email" placeholder="Enter your email" required />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="Enter your password" required />
        </div>

        <button type="submit" class="submit-btn">
          {{ isLogin ? 'Sign In' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from '../firebase'

export default {
  name: 'AuthView',
  data() {
    return {
      isLogin: true,
      name: '',
      email: '',
      password: '',
      gender: 'male',
      interests: [],
      errorMessage: '',
      availableGenres: [
        'Self-Help',
        'Classic',
        'Sci-Fi',
        'Business',
        'History',
        'Psychology',
        'Fiction',
        'Technology'
      ]
    }
  },
  methods: {
    async signInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        const user = result.user

        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userName', user.displayName || 'Google User')
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('userPhoto', user.photoURL)
        sessionStorage.setItem('isAdminAuth', 'true')

        // التحديث الفوري للـ Navbar
        window.dispatchEvent(new Event('user-logged-in'))

        this.$router.push('/')
      } catch (error) {
        console.error("Google Sign-In Error:", error.message)
        this.errorMessage = "Failed to sign in with Google. Please try again."
      }
    },
    async handleSubmit() {
      this.errorMessage = ''
      try {
        if (this.isLogin) {
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password)
          const user = userCredential.user

          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('userName', user.email.split('@')[0])
          localStorage.setItem('userEmail', user.email)
          sessionStorage.setItem('isAdminAuth', 'true')
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)
          const user = userCredential.user

          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('userName', this.name)
          localStorage.setItem('userEmail', user.email)
          localStorage.setItem('userGender', this.gender)
          localStorage.setItem('userInterests', JSON.stringify(this.interests))
          sessionStorage.setItem('isAdminAuth', 'true')
        }

        // التحديث الفوري للـ Navbar
        window.dispatchEvent(new Event('user-logged-in'))

        // التوجيه للصفحة الرئيسية بعد النجاح
        this.$router.push('/')
      } catch (error) {
        console.error("Auth Error:", error.code, error.message)
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          this.errorMessage = 'Invalid email or password. Please check your credentials.'
        } else if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'This email is already registered. Please sign in instead.'
        } else if (error.code === 'auth/weak-password') {
          this.errorMessage = 'Password should be at least 6 characters.'
        } else {
          this.errorMessage = error.message
        }
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-color, #f9fafb);
  padding: 20px;
}

.auth-card {
  background: var(--card-bg, #ffffff);
  padding: 30px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 460px;
  border: 1px solid var(--border-color, #e5e7eb);
  max-height: 90vh;
  overflow-y: auto;
}

.auth-title {
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  color: var(--text-color, #111827);
}

.auth-subtitle {
  font-size: 14px;
  text-align: center;
  color: #6b7280;
  margin-bottom: 20px;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 16px;
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.google-btn:hover {
  background-color: #f3f4f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.google-icon {
  width: 20px;
  height: 20px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 16px 0;
  color: #9ca3af;
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider::before {
  margin-right: 10px;
}

.divider::after {
  margin-left: 10px;
}

.alert-error {
  background-color: #ffeeec;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
  border: 1px solid #fecaca;
  text-align: center;
}

.auth-tabs {
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  color: #4b5563;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
  padding: 11px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #2563eb;
}

.gender-options {
  display: flex;
  gap: 12px;
}

.gender-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}

.gender-card.active {
  border-color: #2563eb;
  background-color: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}

.gender-icon-img {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  background: #f9fafb;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  accent-color: #2563eb;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.submit-btn {
  margin-top: 6px;
  padding: 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #1d4ed8;
}
</style>