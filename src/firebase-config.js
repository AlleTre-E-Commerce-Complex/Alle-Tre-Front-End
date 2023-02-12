// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-gjCUd7qTemIViZNfyFKzYr37fKbyvwc",
  authDomain: "allatre-dev.firebaseapp.com",
  projectId: "allatre-dev",
  storageBucket: "allatre-dev.appspot.com",
  messagingSenderId: "956186851276",
  appId: "1:956186851276:web:5e4c5df7bb4c5360e50f69",
  measurementId: "G-VQ8KK6Q5NL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentications = getAuth(app);
