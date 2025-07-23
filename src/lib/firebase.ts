// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6OJWg2YSFiXqrqBoRH-S3g_CZqJCsXeA",
  authDomain: "advocate-empower.firebaseapp.com",
  projectId: "advocate-empower",
  storageBucket: "advocate-empower.firebasestorage.app",
  messagingSenderId: "662566433758",
  appId: "1:662566433758:web:ae5cc7edb538f92500634f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
