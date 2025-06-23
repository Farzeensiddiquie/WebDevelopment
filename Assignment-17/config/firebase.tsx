import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqtBDGCQqcd9tPLHxC6Cyr6z2EEKOZXqE",
  authDomain: "facebook-apk-357ad.firebaseapp.com",
  projectId: "facebook-apk-357ad",
  storageBucket: "facebook-apk-357ad.firebasestorage.app",
  messagingSenderId: "289308535622",
  appId: "1:289308535622:web:9a1b2227890a0e51d9d347",
  measurementId: "G-SXDQSV5Z81"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);