// Re-export from env-driven client to avoid hardcoded secrets in repo
export { app, auth, db, storage } from './firebase/firebaseClient';
