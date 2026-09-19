import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import BooksView from '../views/BooksView.vue'
import BookDetailsView from '../views/BookDetailsView.vue'
import BookReaderView from '../views/BookReaderView.vue' 
import AuthorsView from '../views/AuthorsView.vue'
import AuthorDetailsView from '../views/AuthorDetailsView.vue'
import Cart from '../views/Cart.vue'
import AlreadyReadView from '../views/AlreadyReadView.vue' // تم إضافته هنا

import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminBooks from '../views/admin/AdminBooks.vue'
import BookForm from '../views/admin/BookForm.vue'
import AdminAuthors from '../views/admin/AdminAuthors.vue'
import AuthorForm from '../views/admin/AuthorForm.vue'

const routes = [
  { path: '/auth', name: 'auth', component: AuthView },
  { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/about', name: 'about', component: AboutView, meta: { requiresAuth: true } },
  { path: '/books', name: 'books', component: BooksView, meta: { requiresAuth: true } },
  { path: '/already-read', name: 'already-read', component: AlreadyReadView, meta: { requiresAuth: true } }, // تم إضافته هنا
  { path: '/books/:id', name: 'book-details', component: BookDetailsView, props: true, meta: { requiresAuth: true } },
  { path: '/books/:id/read', name: 'book-reader', component: BookReaderView, props: true, meta: { requiresAuth: true } },
  { path: '/authors', name: 'authors', component: AuthorsView, meta: { requiresAuth: true } },
  { path: '/authors/:id', name: 'author-details', component: AuthorDetailsView, props: true, meta: { requiresAuth: true } },
  { path: '/cart', name: 'cart', component: Cart, meta: { requiresAuth: true } },

  { path: '/admin', name: 'admin-dashboard', component: AdminDashboard, meta: { requiresAuth: true } },
  { path: '/admin/books', name: 'admin-books', component: AdminBooks, meta: { requiresAuth: true } },
  { path: '/admin/books/new', name: 'admin-book-new', component: BookForm, meta: { requiresAuth: true } },
  { path: '/admin/books/:id/edit', name: 'admin-book-edit', component: BookForm, props: true, meta: { requiresAuth: true } },
  { path: '/admin/authors', name: 'admin-authors', component: AdminAuthors, meta: { requiresAuth: true } },
  { path: '/admin/authors/new', name: 'admin-author-new', component: AuthorForm, meta: { requiresAuth: true } },
  { path: '/admin/authors/:id/edit', name: 'admin-author-edit', component: AuthorForm, props: true, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// حراسة التنقل (Navigation Guard) للتحقق من تسجيل الدخول
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  } else if (to.path === '/auth' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router