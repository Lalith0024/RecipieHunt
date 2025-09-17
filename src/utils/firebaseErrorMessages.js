const FRIENDLY_MESSAGES = {
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/email-already-in-use': 'Email already in use. Try logging in.',
  'auth/weak-password': 'Password too weak. Use at least 8 characters.',
};

export function mapFirebaseError(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  const code = error.code || error.message || '';
  return FRIENDLY_MESSAGES[code] || fallback;
}


