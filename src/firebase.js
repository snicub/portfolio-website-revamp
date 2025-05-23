// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "daniel-han-portfolio.firebaseapp.com",
  projectId: "daniel-han-portfolio",
  storageBucket: "daniel-han-portfolio.firebasestorage.app",
  messagingSenderId: "587413620340",
  appId: "1:587413620340:web:8092bd387f724d65333321",
  measurementId: "G-8D2MPCCP51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
