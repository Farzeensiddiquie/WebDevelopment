// Import necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkAKhUkIzEDcjJqBj1td6mCF71UQnv8Bo",
  authDomain: "assignment-15-7f4a0.firebaseapp.com",
  projectId: "assignment-15-7f4a0",
  storageBucket: "assignment-15-7f4a0.appspot.com",
  messagingSenderId: "845635149823",
  appId: "1:845635149823:web:19d3e4d88f4e355f88d1ca",
  measurementId: "G-YDEXL6340P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore using the modular SDK
const db = getFirestore(app);
const storage = getStorage(app);
export { db, app ,storage };
