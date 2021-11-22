// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPj3swwXhJ37zNmKm5A4svpKBWjkvEh5Q",
  authDomain: "tinder-7805a.firebaseapp.com",
  projectId: "tinder-7805a",
  storageBucket: "tinder-7805a.appspot.com",
  messagingSenderId: "396582362215",
  appId: "1:396582362215:web:7db00b9b070dcbeec108c2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
