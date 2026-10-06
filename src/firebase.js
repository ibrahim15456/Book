import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore"; // أضفنا استيراد الأدوات الخاصة بالاستعلام والترتيب
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA81H_yJ1Ol4fuQOZOVubUr7pnoQTFhqNA",
  authDomain: "bookstoreproject-a0eb7.firebaseapp.com",
  projectId: "bookstoreproject-a0eb7",
  storageBucket: "bookstoreproject-a0eb7.firebasestorage.app",
  messagingSenderId: "1092198103163",
  appId: "1:1092198103163:web:08fb588bcb11d726984ade",
  measurementId: "G-4WVZHZPW8S"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); 
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * دالة لجلب الكتب من مجموعة BOOKS مرتبة تصاعدياً حسب الـ id الرقمي
 */
export async function fetchBooks() {
  try {
    // إنشاء استعلام للترتيب حسب حقل id تصاعدياً (asc)
    const q = query(collection(db, "BOOKS"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    
    const booksList = [];
    querySnapshot.forEach((doc) => {
      booksList.push({
        firebaseDocId: doc.id, // الـ ID العشوائي للوثيقة في الفايربيس (للحذف أو التعديل)
        ...doc.data()          // بيانات الكتاب (والتي تحتوي على حقل id الرقمي للترتيب)
      });
    });
    
    return booksList;
  } catch (error) {
    console.error("Error fetching books: ", error);
    return [];
  }
}

export { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
};