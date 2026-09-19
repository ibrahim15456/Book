import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const currentBook = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastFetchedAt = ref(null)

  // قائمة الكتب المقروءة (نجلبها من الـ localStorage إذا وجدت لضمان عدم فقدانها عند تحديث الصفحة)
  const alreadyReadBooks = ref(JSON.parse(localStorage.getItem('alreadyReadBooks')) || [])

  // دالة إضافة كتاب لقائمة المقروءة
  const markAsRead = (book) => {
    const exists = alreadyReadBooks.value.some(b => b.id === book.id)
    if (!exists) {
      alreadyReadBooks.value.push(book)
      localStorage.setItem('alreadyReadBooks', JSON.stringify(alreadyReadBooks.value))
    }
  }

  // دالة إزالة كتاب من قائمة المقروءة
  const removeFromAlreadyRead = (bookId) => {
    alreadyReadBooks.value = alreadyReadBooks.value.filter(b => b.id != bookId)
    localStorage.setItem('alreadyReadBooks', JSON.stringify(alreadyReadBooks.value))
  }

  const fetchList = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/books')
      books.value = response.data
      lastFetchedAt.value = Date.now()
    } catch (err) {
      error.value = err.message || 'Failed to fetch books'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/books/${id}`)
      currentBook.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch book details'
    } finally {
      loading.value = false
    }
  }

  const createBook = async (bookData) => {
    loading.value = true
    try {
      // Validation check for author existence as requested in project specs
      await api.get(`/authors/${bookData.authorId}`)

      const payload = {
        ...bookData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const response = await api.post('/books', payload)
      books.value.push(response.data)
      return response.data
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new Error('Author does not exist!')
      }
      error.value = err.message || 'Failed to create book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBook = async (id, bookData) => {
    loading.value = true
    try {
      await api.get(`/authors/${bookData.authorId}`)

      const payload = {
        ...bookData,
        updatedAt: new Date().toISOString()
      }
      const response = await api.put(`/books/${id}`, payload)
      const index = books.value.findIndex(b => b.id == id)
      if (index !== -1) books.value[index] = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeBook = async (id) => {
    loading.value = true
    try {
      await api.delete(`/books/${id}`)
      books.value = books.value.filter(b => b.id != id)
    } catch (err) {
      error.value = err.message || 'Failed to delete book'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    books,
    currentBook,
    loading,
    error,
    lastFetchedAt,
    alreadyReadBooks, // تم إضافتها هنا لتصبح متاحة في التطبيق
    fetchList,
    fetchById,
    createBook,
    updateBook,
    removeBook,
    markAsRead,          // تم إضافتها هنا
    removeFromAlreadyRead // تم إضافتها هنا
  }
})