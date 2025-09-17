## Firebase Email/Password Integration

### Set up Firebase
- Create a Firebase project and a Web App in the Firebase console.
- Enable Authentication → Email/Password provider.
- Create Cloud Firestore in Production mode.

### Environment variables
This project uses Vite, so configure these in a `.env.local` file (do not commit it):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

### Firestore security rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### Cloud Function example (optional)
Create a `functions` directory separately (not in this repo) and initialize with Firebase Tools. Example onCreate:
```js
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();
  await db.doc(`users/${user.uid}`).set({
    email: user.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
});
```

### Notes
- Auth persistence is set to local.
- `ProtectedRoute` requires `user` and shows a skeleton while initializing.
- Use `firebaseAuthFetch` to automatically send the ID token in the `Authorization` header.


