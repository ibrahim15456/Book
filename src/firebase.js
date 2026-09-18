import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
};