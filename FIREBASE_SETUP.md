# Firebase Setup for RecipeHunt

## Prerequisites
- Firebase account (https://firebase.google.com/)
- Node.js and npm installed

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `recipehunt` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Click "Email/Password"
3. Enable "Email/Password" provider
4. Click "Save"

### 3. Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### 4. Get Firebase Config
1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → "Web"
4. Register app with name: `RecipeHunt Web App`
5. Copy the config object

### 5. Update Firebase Config
1. Open `src/firebase.js`
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 6. Security Rules (Optional)
In Firestore Database → Rules, you can set custom security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features Added
- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ User data storage in Firestore
- ✅ Authentication state management
- ✅ Enhanced error handling and validation
- ✅ Professional error tooltips
- ✅ Loading states
- ✅ Logout functionality
- ✅ Protected routes (can be added later)

## Testing
1. Run `npm run dev`
2. Go to `/register` to create an account
3. Go to `/` to login with your account
4. Check Firebase Console → Authentication → Users to see registered users
5. Check Firebase Console → Firestore → Data to see user data

## Notes
- All existing functionality is preserved
- No layout changes were made
- Firebase is fully integrated with the existing UI
- Error handling is professional and user-friendly
