// firebase-config.js

// 1. Firebase ke tools import kar rahe hain
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Tumhari Secret Keys (Jo tumne abhi di hain)
const firebaseConfig = {
    apiKey: "AIzaSyAKZCEGSEonIb8QBZPiWXXzuWOYh7yFISc",
    authDomain: "alphaclothing-9c066.firebaseapp.com",
    projectId: "alphaclothing-9c066",
    storageBucket: "alphaclothing-9c066.firebasestorage.app",
    messagingSenderId: "284040010346",
    appId: "1:284040010346:web:97fffe083e0422f744c813",
    measurementId: "G-MG893X4YH4"
};

// 3. Firebase Start kar rahe hain
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. In functions ko bahar bhej rahe hain taaki dusri files use kar sakein
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc, updateDoc, arrayUnion };