import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBNTDxK5-qxcg2W4xlTLj3ps8qLHaGG3SA",
  authDomain: "recipiehunt-70f1a.firebaseapp.com",
  projectId: "recipiehunt-70f1a",
  storageBucket: "recipiehunt-70f1a.firebasestorage.app",
  messagingSenderId: "110723307788",
  appId: "1:110723307788:web:a37d233b3bdde9561f5129",
  measurementId: "G-0LDJR8GDCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional - for tracking user behavior)
export const analytics = getAnalytics(app);

export default app;
