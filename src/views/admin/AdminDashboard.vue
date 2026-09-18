<template>
  <div class="container py-4">
    <!-- شاشة إدخال الباسورد للمشرف -->
    <div v-if="!isAuthenticated" class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm p-4 border">
          <div class="d-flex align-items-center justify-content-center gap-3 mb-3">
            <img :src="adminIcon" alt="Admin Icon" style="width: 100px;; height: 100px; object-fit: contain;" />
            <h3 class="fw-bold mb-0">Admin Authentication</h3>
          </div>
          
          <p class="text-muted text-center mb-4">Please enter the administrator password to access dashboard controls.</p>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Password *</label>
              <input 
                type="password" 
                class="form-control" 
                v-model="passwordInput" 
                placeholder="Enter admin password..."
                required
              >
            </div>
            <div v-if="authError" class="alert alert-danger py-2" role="alert">
              {{ authError }}
            </div>
            <button type="submit" class="btn btn-primary w-100">Login as Admin</button>
          </form>
          <div class="text-center mt-3">
            <router-link to="/" class="text-decoration-none text-muted">← Back to Home</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- لوحة التحكم الرئيسية (تظهر فقط بعد إدخال الباسورد الصحيح) -->
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold mb-0">Admin Dashboard</h2>
        <button @click="handleLogout" class="btn btn-outline-danger btn-sm">
          <i class="bi bi-box-arrow-right"></i> Logout Admin
        </button>
      </div>
      
      <div class="row g-4 mb-5">
        <div class="col-md-6">
          <div class="card bg-primary text-white shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Total Books</h5>
              <p class="display-4 fw-bold">{{ booksStore.books.length }}</p>
              <router-link to="/admin/books" class="btn btn-light btn-sm">Manage Books</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card bg-success text-white shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Total Authors</h5>
              <p class="display-4 fw-bold">{{ authorsStore.authors.length }}</p>
              <router-link to="/admin/authors" class="btn btn-light btn-sm">Manage Authors</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm p-4">
        <h4 class="mb-3">Quick Actions</h4>
        <div class="d-flex gap-3">
          <router-link to="/admin/books/new" class="btn btn-outline-primary">
            <i class="bi bi-plus-circle"></i> Add New Book
          </router-link>
          <router-link to="/admin/authors/new" class="btn btn-outline-success">
            <i class="bi bi-person-plus"></i> Add New Author
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBooksStore } from '../../stores/booksStore'
import { useAuthorsStore } from '../../stores/authorsStore'
// استيراد الصورة (تأكد أن مسارها صحيح بالنسبة لمكان هذا الملف)
import adminIcon from '../../assets/admin_auth.jpg'

const booksStore = useBooksStore()
const authorsStore = useAuthorsStore()

const isAuthenticated = ref(false)
const passwordInput = ref('')
const authError = ref('')

// كلمة السر الخاصة بك
const ADMIN_PASSWORD = 'hema777'

onMounted(async () => {
  if (sessionStorage.getItem('isAdminAuth') === 'true') {
    isAuthenticated.value = true
  }

  await Promise.all([
    booksStore.fetchList(),
    authorsStore.fetchList()
  ])
})

const handleLogin = () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    authError.value = ''
    sessionStorage.setItem('isAdminAuth', 'true')
  } else {
    authError.value = 'Incorrect password. Access denied.'
    passwordInput.value = ''
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  sessionStorage.removeItem('isAdminAuth')
}
</script>