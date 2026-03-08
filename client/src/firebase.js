import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-5671a.firebaseapp.com",
  projectId: "genwebai-5671a",
  storageBucket: "genwebai-5671a.firebasestorage.app",
  messagingSenderId: "596259459313",
  appId: "1:596259459313:web:a0e0865bd7ee64a80c1950"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();