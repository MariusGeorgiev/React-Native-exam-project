// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU5qttj-ZDrH2tz9zPVcV2-9ah677UyJM",
  authDomain: "furniturestoreapp-react-native.firebaseapp.com",
  projectId: "furniturestoreapp-react-native",
  storageBucket: "furniturestoreapp-react-native.firebasestorage.app",
  messagingSenderId: "136190598494",
  appId: "1:136190598494:web:2062a18a7d00a77e9143cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);