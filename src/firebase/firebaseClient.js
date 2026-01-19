import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Detect Vite env vars; do not hardcode secrets
const isVite = typeof import.meta !== 'undefined' && import.meta.env;
const env = isVite ? import.meta.env : process.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || env.REACT_APP_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID || env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID || env.REACT_APP_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const isValidConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
);

// Initialize (singleton-safe)
let app;
let auth = null;
let db = null;
let storage = null;

if (isValidConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch(() => {});
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn('[Firebase] Missing or invalid environment variables. Set VITE_FIREBASE_* (for Vite) or REACT_APP_FIREBASE_* (for CRA). App will run without Firebase.');
}

export { app, auth, db, storage };


