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

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const allBooks = ref([]) 
  const currentBook = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastFetchedAt = ref(null)

  const alreadyReadBooks = ref(JSON.parse(localStorage.getItem('alreadyReadBooks')) || [])

  const markAsRead = (book) => {
    const exists = alreadyReadBooks.value.some(b => b.id === book.id)
    if (!exists) {
      alreadyReadBooks.value.push(book)
      localStorage.setItem('alreadyReadBooks', JSON.stringify(alreadyReadBooks.value))
    }
  }

  const removeFromAlreadyRead = (bookId) => {
    alreadyReadBooks.value = alreadyReadBooks.value.filter(b => b.id != bookId)
    localStorage.setItem('alreadyReadBooks', JSON.stringify(alreadyReadBooks.value))
  }

  const fetchList = async () => {
    if (allBooks.value.length > 0) return
    loading.value = true
    error.value = null
    try {
      const querySnapshot = await getDocs(collection(db, "BOOKS"))
      const data = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
      }))
      allBooks.value = data
      books.value = data
      lastFetchedAt.value = Date.now()
    } catch (err) {
      error.value = err.message || 'Failed to fetch books'
    } finally {
      loading.value = false
    }
  }

  const filterBooks = (query) => {
    if (!query) {
      books.value = allBooks.value
      return
    }
    const q = query.toLowerCase().trim()
    books.value = allBooks.value.filter(book => 
      (book.title && book.title.toLowerCase().includes(q)) || 
      (book.description && book.description.toLowerCase().includes(q))
    )
  }

  const fetchById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, "BOOKS", String(id))
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const bookData = { id: docSnap.id, ...docSnap.data() }
        currentBook.value = bookData
        return bookData
      } else {
        throw new Error('Book not found')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch book details'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBook = async (bookData) => {
    loading.value = true
    try {
      // التحقق من وجود المؤلف في كอลيكشن AUTHORS أولاً كما كان مطلوباً
      if (bookData.authorId) {
        const authorDocRef = doc(db, "AUTHORS", String(bookData.authorId))
        const authorSnap = await getDoc(authorDocRef)
        if (!authorSnap.exists()) {
          throw new Error('Author does not exist!')
        }
      }

      const bookId = bookData.id ? String(bookData.id) : doc(collection(db, "BOOKS")).id
      const payload = {
        ...bookData,
        id: bookId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await setDoc(doc(db, "BOOKS", bookId), payload)
      allBooks.value.push(payload)
      books.value = allBooks.value
      return payload
    } catch (err) {
      error.value = err.message || 'Failed to create book'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBook = async (id, bookData) => {
    loading.value = true
    try {
      if (bookData.authorId) {
        const authorDocRef = doc(db, "AUTHORS", String(bookData.authorId))
        const authorSnap = await getDoc(authorDocRef)
        if (!authorSnap.exists()) {
          throw new Error('Author does not exist!')
        }
      }

      const docRef = doc(db, "BOOKS", String(id))
      const payload = {
        ...bookData,
        updatedAt: new Date().toISOString()
      }

      await updateDoc(docRef, payload)

      const index = allBooks.value.findIndex(b => b.id == id)
      if (index !== -1) {
        allBooks.value[index] = { ...allBooks.value[index], ...payload }
      }
      books.value = allBooks.value
      return allBooks.value[index]
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
      const docRef = doc(db, "BOOKS", String(id))
      await deleteDoc(docRef)

      allBooks.value = allBooks.value.filter(b => b.id != id)
      books.value = allBooks.value
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
    alreadyReadBooks,
    fetchList,
    filterBooks,
    fetchById,
    createBook,
    updateBook,
    removeBook,
    markAsRead,                  
    removeFromAlreadyRead 
  }
})