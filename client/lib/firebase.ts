import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - Replace with your actual Firebase project config
// Get these values from your Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBj74EiPWujzQ77iN6fxlw9j7Te-_vDbNY",
  authDomain: "shreelock-blog.firebaseapp.com",
  projectId: "shreelock-blog",
  storageBucket: "shreelock-blog.firebasestorage.app",
  messagingSenderId: "498607467215",
  appId: "1:498607467215:web:a03275cd6bb8f07a9ee5ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Collection name for blog posts
export const BLOGS_COLLECTION = 'blogs';
