// src/firebase.js

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,  
  confirmPasswordReset,    
  verifyPasswordResetCode  
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export all services
export { 
  auth, 
  db,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  googleProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,     
  confirmPasswordReset,       
  verifyPasswordResetCode,   
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp
};