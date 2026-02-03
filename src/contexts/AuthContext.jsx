import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { auth, db } from '../firebase/firebaseClient';
import {
  onAuthStateChanged,
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const AuthContext = createContext(undefined);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [idToken, setIdToken] = useState(null);
  const lastResendRef = useRef(0);

  useEffect(() => {
    if (!auth) {
      setInitializing(false);
      return;
    }
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsEmailVerified(!!firebaseUser?.emailVerified);
      setInitializing(false);
    });
    const unsubToken = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
    });
    return () => {
      unsubAuth();
      unsubToken();
    };
  }, []);

  const withRetry = async (fn, { retries = 2, delayMs = 300 } = {}) => {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        const code = err?.code || '';
        if (code !== 'auth/network-request-failed') break;
        if (attempt < retries) await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
      }
    }
    throw lastError;
  };

  const signup = async (email, password, additionalData = {}) => {
    if (!auth) throw new Error('Authentication is not configured');
    const credential = await withRetry(() => createUserWithEmailAndPassword(auth, email, password));
    const createdUser = credential.user;
    if (additionalData?.displayName) {
      await updateProfile(createdUser, { displayName: additionalData.displayName });
    }
    try {
      await sendEmailVerification(createdUser);
    } catch { }
    try {
      if (db) {
        await setDoc(doc(db, 'users', createdUser.uid), {
          email: createdUser.email,
          displayName: additionalData?.displayName || '',
          createdAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch { }
    return createdUser;
  };

  const login = async (email, password) => {
    if (!auth) throw new Error('Authentication is not configured');
    const credential = await withRetry(() => signInWithEmailAndPassword(auth, email, password));
    return credential.user;
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const sendPasswordReset = async (email) => {
    if (!auth) throw new Error('Authentication is not configured');
    await sendPasswordResetEmail(auth, email);
  };

  const resendVerification = async () => {
    const now = Date.now();
    if (!auth || !user) return;
    if (now - lastResendRef.current < 60000) {
      const msLeft = 60000 - (now - lastResendRef.current);
      const err = new Error('Please wait before requesting another verification email.');
      err.cooldownMs = msLeft;
      throw err;
    }
    await sendEmailVerification(user);
    lastResendRef.current = now;
  };

  const googleLogin = async () => {
    if (!auth) throw new Error('Authentication is not configured');
    const provider = new GoogleAuthProvider();
    const result = await withRetry(() => signInWithPopup(auth, provider));
    const gUser = result.user;
    try {
      if (db) {
        await setDoc(doc(db, 'users', gUser.uid), {
          email: gUser.email,
          displayName: gUser.displayName || '',
          createdAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch { }
    return gUser;
  };

  const value = useMemo(() => ({
    user,
    initializing,
    isEmailVerified,
    idToken,
    signup,
    login,
    logout,
    sendPasswordReset,
    resendVerification,
    googleLogin,
  }), [user, initializing, isEmailVerified, idToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
