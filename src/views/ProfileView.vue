<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <!-- بطاقة معلومات الحساب -->
        <div class="card shadow-sm border-0 mb-4" :class="isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-white text-dark'">
          <div class="card-body p-4 text-center">
            
            <!-- صورة البروفايل أو الحرف الأول -->
            <div class="mb-3 position-relative d-inline-block">
              <div v-if="userAvatar" class="rounded-circle shadow overflow-hidden d-inline-flex align-items-center justify-content-center bg-secondary" style="width: 90px; height: 90px;">
                <img :src="userAvatar" alt="Profile Picture" class="w-100 h-100" style="object-fit: cover;" />
              </div>
              <div v-else class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold shadow" style="width: 90px; height: 90px; font-size: 2rem;">
                {{ userInitial }}
              </div>

              <!-- زر تعديل الصورة (أيقونة كاميرا أو رفع) -->
              <label for="avatarInput" class="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1 shadow cursor-pointer" style="width: 32px; height: 32px; display: flex; align-items: center;
               cursor: pointer;" title="Change Profile Picture">
                <i class="bi bi-camera-fill" style="font-size: 0.9rem;"></i>
              </label>
              <input type="file" id="avatarInput" class="d-none" accept="image/*" @change="handleImageUpload" />
            </div>
            
            <h3 class="fw-bold mb-1">{{ userName }}</h3>
            <p class="text-muted mb-4">{{ userEmail }}</p>
            
            <hr class="my-4" :class="isDarkMode ? 'border-secondary' : ''">

            <div class="text-start">
              <h5 class="fw-bold mb-3">Account Details</h5>
              <ul class="list-group list-group-flush" :class="isDarkMode ? 'bg-dark' : ''">
                <!-- Full Name مع زر التعديل -->
                <li class="list-group-item d-flex justify-content-between align-items-center py-3" :class="isDarkMode ? 'bg-dark text-light border-secondary' : ''">
                  <span class="text-muted">Full Name</span>
                  <div class="d-flex align-items-center gap-2">
                    <template v-if="!isEditing">
                      <span class="fw-semibold">{{ userName }}</span>
                      <button @click="startEditing" class="btn btn-sm btn-outline-primary ms-2">Edit</button>
                    </template>
                    <template v-else>
                      <input type="text" v-model="tempName" class="form-control form-control-sm" :class="isDarkMode ? 'bg-dark text-light border-secondary' : ''" />
                      <button @click="saveName" class="btn btn-sm btn-success">Save</button>
                      <button @click="cancelEditing" class="btn btn-sm btn-secondary">Cancel</button>
                    </template>
                  </div>
                </li>
                <!-- Email Address -->
                <li class="list-group-item d-flex justify-content-between py-3" :class="isDarkMode ? 'bg-dark text-light border-secondary' : ''">
                  <span class="text-muted">Email Address</span>
                  <span class="fw-semibold">{{ userEmail }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- سجل الكتب المقروءة (Already Read Books) -->
        <div class="card shadow-sm border-0" :class="isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-white text-dark'">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold m-0">Already Read Books</h4>
              <span class="badge bg-primary fs-6">{{ readBooks.length }} Books</span>
            </div>

            <div v-if="readBooks.length === 0" class="text-center py-4 text-muted">
              <p class="mb-0">You haven't marked any books as read yet.</p>
              <router-link to="/books" class="btn btn-sm btn-outline-primary mt-3">Browse Books</router-link>
            </div>

            <div v-else class="row g-3">
              <div v-for="book in readBooks" :key="book.id" class="col-md-6">
                <div class="d-flex align-items-center p-3 border rounded" :class="isDarkMode ? 'border-secondary bg-black bg-opacity-25' : 'bg-light'">
                  <img 
                    :src="book.coverUrl || 'https://picsum.photos/120?placeholder'" 
                    alt="Book cover" 
                    class="rounded me-3" 
                    style="width: 50px; height: 70px; object-fit: cover;"
                  >
                  <div class="flex-grow-1">
                    <h6 class="fw-bold mb-1 text-truncate" style="max-width: 250px;">{{ book.title }}</h6>
                    <p class="text-muted small mb-0">{{ book.author || 'Unknown Author' }}</p>
                  </div>
                  <router-link :to="'/books/' + book.id" class="btn btn-sm btn-outline-primary">View</router-link>
                </div>
              </div>
            </div>

            <div class="mt-4 text-end">
              <router-link to="/" class="btn btn-outline-secondary px-4">Back to Home</router-link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileView",
  data() {
    return {
      userName: "Ibrahim Mohamed",
      userEmail: "ibrahimmo12344@gmail.com",
      userAvatar: "", // لتخزين مسار الصورة
      tempName: "",
      isEditing: false,
      readBooks: [],
      isDarkMode: false,
      observer: null
    };
  },
  computed: {
    userInitial() {
      return this.userName ? this.userName.charAt(0).toUpperCase() : "U";
    }
  },
  mounted() {
    this.loadUserData();
    this.loadReadBooks();
    this.checkDarkMode();

    this.observer = new MutationObserver(() => {
      this.checkDarkMode();
    });
    this.observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-bs-theme'] });
    document.documentElement.addEventListener('click', this.checkDarkMode);
  },
  unmounted() {
    if (this.observer) this.observer.disconnect();
    document.documentElement.removeEventListener('click', this.checkDarkMode);
  },
  methods: {
    loadUserData() {
      const storedUser = localStorage.getItem('user') || localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      const storedAvatar = localStorage.getItem('userAvatar');

      if (storedUser) this.userName = storedUser;
      if (storedEmail) this.userEmail = storedEmail;
      if (storedAvatar) this.userAvatar = storedAvatar;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.userAvatar = e.target.result;
          localStorage.setItem('userAvatar', this.userAvatar);
          
          // إرسال حدث لتحديث الصورة في الـ Navbar لو متواجدة هناك أيضاً
          window.dispatchEvent(new Event('avatar-updated'));
          window.dispatchEvent(new Event('storage'));
        };
        reader.readAsDataURL(file);
      }
    },
    startEditing() {
      this.tempName = this.userName;
      this.isEditing = true;
    },
    cancelEditing() {
      this.isEditing = false;
    },
    saveName() {
      if (this.tempName.trim()) {
        this.userName = this.tempName.trim();
        localStorage.setItem('user', this.userName);
        localStorage.getItem('userName', this.userName);
        localStorage.setItem('userName', this.userName);
        this.isEditing = false;
        
        window.dispatchEvent(new Event('username-updated'));
        window.dispatchEvent(new Event('storage'));
      }
    },
    loadReadBooks() {
      try {
        const books = JSON.parse(localStorage.getItem('alreadyReadBooks')) || [];
        this.readBooks = books;
      } catch (e) {
        this.readBooks = [];
      }
    },
    checkDarkMode() {
      this.isDarkMode = 
        document.body.classList.contains('dark-mode') || 
        document.body.classList.contains('bg-dark') || 
        document.documentElement.getAttribute('data-bs-theme') === 'dark' ||
        localStorage.getItem('theme') === 'dark';
    }
  }
};
</script>