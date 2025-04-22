// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDZ2fZuMn-6O1GKXiJ8-vg17qLpPvOcgO8",
  authDomain: "handsfree-os.firebaseapp.com",
  projectId: "handsfree-os",
  storageBucket: "handsfree-os.firebasestorage.app",
  messagingSenderId: "402930513336",
  appId: "1:402930513336:web:d0773d32f670525a1e8b4d",
  measurementId: "G-M131PNB992"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, db, storage, analytics };
