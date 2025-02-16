import firebase from 'firebase/app';
import 'firebase/auth';

// Firebase configuration object containing keys and identifiers
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase with the configuration
firebase.initializeApp(firebaseConfig);

// Export the authentication module for use in Vue components
export const auth = firebase.auth();

// Monitor authentication state changes
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in; update application state accordingly
    console.log('User signed in:', user);
  } else {
    // User is signed out; update the UI to reflect sign-out state
    console.log('No user is signed in.');
  }
});