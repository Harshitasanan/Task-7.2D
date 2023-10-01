// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDyp1vjkHob7t9xFMAYIkKs6i-o_ScHLdk",
  authDomain: "cardstorage-44338.firebaseapp.com",
  projectId: "cardstorage-44338",
  storageBucket: "cardstorage-44338.appspot.com",
  messagingSenderId: "974835535904",
  appId: "1:974835535904:web:ce04eba3d11340fd012c45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);