// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFwGSNNBdmgenm07oCm7jgebucOwabKIo",
  authDomain: "quickart-4aa22.firebaseapp.com",
  projectId: "quickart-4aa22",
  storageBucket: "quickart-4aa22.appspot.com",
  messagingSenderId: "48163017896",
  appId: "1:48163017896:web:2c2fc37fe2e59ad0b4de9d",
  // Add your realtime database URL here
  databaseURL: "https://quickart-4aa22-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
console.log('Initializing Firebase...');
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized successfully');

// Initialize Firebase Authentication
console.log('Initializing Firebase Auth...');
export const auth = getAuth(app);
console.log('Firebase Auth initialized');

// Initialize Realtime Database
console.log('Initializing Realtime Database...');
export const db = getDatabase(app);
console.log('Realtime Database initialized');

export default app;
