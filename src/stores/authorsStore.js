import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../firebase'
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore'

export const useAuthorsStore = defineStore('authors', () => {
  const authors = ref([])
  const allAuthors = ref([]) 
  const currentAuthor = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastFetchedAt = ref(null)

  const fetchList = async () => {
    if (allAuthors.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      const querySnapshot = await getDocs(collection(db, "AUTHORS"))
      const data = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
      }))
      allAuthors.value = data
      authors.value = data
      lastFetchedAt.value = Date.now()
    }
    catch (err) {
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
      const docRef = doc(db, "AUTHORS", String(id))
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const authorData = { id: docSnap.id, ...docSnap.data() }
        currentAuthor.value = authorData
        return authorData
      } else {
        throw new Error('Author not found')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch author details'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createAuthor = async (authorData) => {
    loading.value = true
    try {
      // استخدام الـ ID الموجود أو إنشاء ID جديد في فايربيس
      const authorId = authorData.id ? String(authorData.id) : doc(collection(db, "AUTHORS")).id
      const payload = {
        ...authorData,
        id: authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await setDoc(doc(db, "AUTHORS", authorId), payload)
      allAuthors.value.push(payload)
      authors.value = allAuthors.value
      return payload
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
      const docRef = doc(db, "AUTHORS", String(id))
      const payload = {
        ...authorData,
        updatedAt: new Date().toISOString()
      }
      
      await updateDoc(docRef, payload)
      
      const index = allAuthors.value.findIndex(a => a.id == id)
      if (index !== -1) {
        allAuthors.value[index] = { ...allAuthors.value[index], ...payload }
      }
      authors.value = allAuthors.value
      return allAuthors.value[index]
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
      const docRef = doc(db, "AUTHORS", String(id))
      await deleteDoc(docRef)
      
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