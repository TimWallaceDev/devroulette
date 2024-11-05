import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAX8TAVCqGINbLjOuEbdM8FCAf-T1ryzmw",
  authDomain: "devroulette-1da35.firebaseapp.com",
  projectId: "devroulette-1da35",
  storageBucket: "devroulette-1da35.firebasestorage.app",
  messagingSenderId: "208156390527",
  appId: "1:208156390527:web:c42aed2d45133cd8a47b4a",
  measurementId: "G-WTDLPCYZC0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

// Function to handle Google Sign-in
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Get user's display name
    const userName = user.displayName;

    return userName;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

// Function to check if user is already signed in
const checkAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.displayName);
    } else {
      console.log("No user is signed in");
    }
  });
};

// Function to sign out
const signOut = () => {
  auth
    .signOut()
    .then(() => console.log("Signed out successfully"))
    .catch((error) => console.error("Error signing out:", error));
};

export { signInWithGoogle, checkAuthState, signOut };
