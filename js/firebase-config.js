// Firebase web config — fill in from:
// Firebase Console → Project settings → Your apps → Web app → SDK setup and configuration → Config
//
// While apiKey is empty the store runs in DEMO MODE with the built-in catalogue (js/data.js);
// orders open WhatsApp only and are not saved.

export const firebaseConfig = {
  apiKey: "",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "",
  appId: "",
};

// Store owner's login email (the user created in Authentication → Users).
// When set, the admin login screen asks for the password only.
export const ADMIN_EMAIL = "";
