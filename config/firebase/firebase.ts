// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCibZ2810M-sX0Yn0Ze5Wjjw-fwOSdnHrk",
  authDomain: "schoolmanager-1710e.firebaseapp.com",
  projectId: "schoolmanager-1710e",
  storageBucket: "schoolmanager-1710e.appspot.com",
  messagingSenderId: "199844543738",
  appId: "1:199844543738:web:3863aacfbad6bfc5295d43"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)