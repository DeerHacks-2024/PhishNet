// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage"; // Import Storage


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9uv2_UrNLWvMlp8lQcmdId0fP5wYIlf0",
  authDomain: "catphish-2459b.firebaseapp.com",
  projectId: "catphish-2459b",
  storageBucket: "catphish-2459b.appspot.com",
  messagingSenderId: "2910304812",
  appId: "1:2910304812:web:eb224096f9e2c98186af89"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const firestore = getFirestore(app);

export const storage = getStorage(app); // Initialize Firebase Storage