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
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [idToken, setIdToken] = useState(null);
  const lastResendRef = useRef(0);

  useEffect(() => {
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

  const signup = async (email, password, additionalData = {}) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const createdUser = credential.user;
    if (additionalData?.displayName) {
      await updateProfile(createdUser, { displayName: additionalData.displayName });
    }
    try {
      await sendEmailVerification(createdUser);
    } catch {}
    try {
      await setDoc(doc(db, 'users', createdUser.uid), {
        email: createdUser.email,
        displayName: additionalData?.displayName || '',
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch {}
    return createdUser;
  };

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const sendPasswordReset = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const resendVerification = async () => {
    const now = Date.now();
    if (!user) return;
    if (now - lastResendRef.current < 60000) {
      const msLeft = 60000 - (now - lastResendRef.current);
      const err = new Error('Please wait before requesting another verification email.');
      err.cooldownMs = msLeft;
      throw err;
    }
    await sendEmailVerification(user);
    lastResendRef.current = now;
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
  }), [user, initializing, isEmailVerified, idToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
