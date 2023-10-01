// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIza*********",
  authDomain: "cardst************",
  projectId: "cardst***********",
  storageBucket: "cardst*********",
  messagingSenderId: "**********",
  appId: "1:974835535904:web:ce************"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
