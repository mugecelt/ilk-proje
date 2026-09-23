// Firebase yapılandırması ve başlatma
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBC6WI6_SyokvtY7XSq0x8-YTQWGNedSyQ",
  authDomain: "ilk-proje-56f96.firebaseapp.com",
  projectId: "ilk-proje-56f96",
  storageBucket: "ilk-proje-56f96.firebasestorage.app",
  messagingSenderId: "77234735020",
  appId: "1:77234735020:web:bdfc34e86acae20146dc09"
};

// Firebase uygulamasını başlat ve Firestore'u dışa aktar
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
