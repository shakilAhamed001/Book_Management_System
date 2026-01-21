// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2rdnmQWQPm01rrUrml8fYnvQzcybUDTY",
  authDomain: "gyangriho-eb35e.firebaseapp.com",
  projectId: "gyangriho-eb35e",
  storageBucket: "gyangriho-eb35e.firebasestorage.app",
  messagingSenderId: "216646280109",
  appId: "1:216646280109:web:695b7a3a4f41e522b23724"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);