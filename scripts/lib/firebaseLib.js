import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, set,child, onValue,  push, update, get, remove} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
//import firebase auth
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCGoJ3FfW1OuggPsJT4u8TCXW3IE2hwpUc",
    authDomain: "psiphilabo.firebaseapp.com",
    projectId: "psiphilabo",
    storageBucket: "psiphilabo.appspot.com",
    messagingSenderId: "607738499390",
    appId: "1:607738499390:web:564d4acb561fc7d7ad1c6f",
    measurementId: "G-4WY7LTWSKM"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth();

export {app, database, set, ref, onValue, child, push, update, get, remove, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider,signInWithPopup};