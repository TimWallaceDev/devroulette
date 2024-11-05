// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX8TAVCqGINbLjOuEbdM8FCAf-T1ryzmw",
  authDomain: "devroulette-1da35.firebaseapp.com",
  projectId: "devroulette-1da35",
  storageBucket: "devroulette-1da35.firebasestorage.app",
  messagingSenderId: "208156390527",
  appId: "1:208156390527:web:c42aed2d45133cd8a47b4a",
  measurementId: "G-WTDLPCYZC0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);