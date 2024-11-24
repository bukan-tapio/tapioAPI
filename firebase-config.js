// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbgyre-NDzj2DJ_9VH722wGOnpuHbdb8k",
  authDomain: "hireme-project-bd882.firebaseapp.com",
  projectId: "hireme-project-bd882",
  storageBucket: "hireme-project-bd882.firebasestorage.app",
  messagingSenderId: "91179017048",
  appId: "1:91179017048:web:006835d4fca6d12c473b2d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore_db = getFirestore(app); // inisialisasi firestore
