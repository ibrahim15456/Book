import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useAuthorsStore = defineStore('authors', () => {
  const authors = ref([])
  const allAuthors = ref([]) // هنحفظ النسخة الأصلية هنا
  const currentAuthor = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastFetchedAt = ref(null)

  const fetchList = async () => {
    // لو البيانات متجلوبتش قبل كده أو حابين نعملها تحميل
    if (allAuthors.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/authors')
      allAuthors.value = response.data
      authors.value = response.data
      lastFetchedAt.value = Date.now()
    } catch (err) {
      error.value = err.message || 'Failed to fetch authors'
    } finally {
      loading.value = false
    }
  }

const filterAuthors = (query) => {
    if (!query) {
      authors.value = allAuthors.value
      return
    }
    const q = query.toLowerCase().trim()
    authors.value = allAuthors.value.filter(author => 
      (author.name && author.name.toLowerCase().includes(q)) || 
      (author.bio && author.bio.toLowerCase().includes(q))
    )
  }

  const fetchById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/authors/${id}`)
      currentAuthor.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch author details'
    } finally {
      loading.value = false
    }
  }

  const createAuthor = async (authorData) => {
    loading.value = true
    try {
      const payload = {
        ...authorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const response = await api.post('/authors', payload)
      allAuthors.value.push(response.data)
      authors.value = allAuthors.value
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to create author'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAuthor = async (id, authorData) => {
    loading.value = true
    try {
      const payload = {
        ...authorData,
        updatedAt: new Date().toISOString()
      }
      const response = await api.put(`/authors/${id}`, payload)
      const index = allAuthors.value.findIndex(a => a.id == id)
      if (index !== -1) allAuthors.value[index] = response.data
      authors.value = allAuthors.value
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update author'
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeAuthor = async (id) => {
    loading.value = true
    try {
      await api.delete(`/authors/${id}`)
      allAuthors.value = allAuthors.value.filter(a => a.id != id)
      authors.value = allAuthors.value
    } catch (err) {
      error.value = err.message || 'Failed to delete author'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    authors,
    currentAuthor,
    loading,
    error,
    lastFetchedAt,
    fetchList,
    filterAuthors,
    fetchById,
    createAuthor,
    updateAuthor,
    removeAuthor
  }
})