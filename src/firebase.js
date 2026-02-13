import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "daniel-han-portfolio.firebaseapp.com",
  projectId: "daniel-han-portfolio",
  storageBucket: "daniel-han-portfolio.firebasestorage.app",
  messagingSenderId: "587413620340",
  appId: "1:587413620340:web:8092bd387f724d65333321",
  measurementId: "G-8D2MPCCP51",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
