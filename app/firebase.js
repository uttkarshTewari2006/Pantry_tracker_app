// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRoDk_11CfOo5328UHKRoUOMhrFldQSnw",
  authDomain: "expense-tracker-a9d2e.firebaseapp.com",
  projectId: "expense-tracker-a9d2e",
  storageBucket: "expense-tracker-a9d2e.appspot.com",
  messagingSenderId: "520187757242",
  appId: "1:520187757242:web:04b88c0f48f200a4e2b883",
  measurementId: "G-563QDX9ZPN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
