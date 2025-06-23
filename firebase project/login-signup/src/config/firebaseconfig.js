import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDahe63_ieVS26yzEYbTaUYdhP9igzTX1Q",
  authDomain: "login-signup-intregation.firebaseapp.com",
  projectId: "login-signup-intregation",
  storageBucket: "login-signup-intregation.firebasestorage.app",
  messagingSenderId: "677401720061",
  appId: "1:677401720061:web:4d524eb314565e592d3a94",
  measurementId: "G-WSFV1WNT2M",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
