"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyArWKMTuqkt4Yfj1f1G_OhoSvx6JhD5CW8",
  authDomain: "daniel-han-portfolio.firebaseapp.com",
  projectId: "daniel-han-portfolio",
  storageBucket: "daniel-han-portfolio.firebasestorage.app",
  messagingSenderId: "587413620340",
  appId: "1:587413620340:web:8092bd387f724d65333321",
  measurementId: "G-8D2MPCCP51",
};

let analytics: Analytics | null = null;

export function getFirebaseAnalytics(): Analytics | null {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  analytics = getAnalytics(app);
  return analytics;
}
