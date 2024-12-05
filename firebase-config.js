// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACllf4lHc1zYVUFFJeYnVT5YLEv3ksegE",
  authDomain: "todo-app-cc24.firebaseapp.com",
  projectId: "todo-app-cc24",
  storageBucket: "todo-app-cc24.firebasestorage.app",
  messagingSenderId: "649107413991",
  appId: "1:649107413991:web:7cb94fc0d4ed624968fb42",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
