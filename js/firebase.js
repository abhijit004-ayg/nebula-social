// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 🔥 REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBoAXP8gwJ-V5dIpWmP2t6K2UU63aBswcE",
  authDomain: "nebula-blog-ff927.firebaseapp.com",
  projectId: "nebula-blog-ff927",
  storageBucket: "nebula-blog-ff927.firebasestorage.app",
  messagingSenderId: "799015372993",
  appId: "1:799015372993:web:2a91c585153ca906732c40",
  measurementId: "G-H1DG156LPL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
