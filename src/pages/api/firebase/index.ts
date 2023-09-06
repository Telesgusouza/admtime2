import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBGKDknVbGkHK6DxEa6KI0jpqTPbqiFk2I",
  authDomain: "admtime-ed291.firebaseapp.com",
  projectId: "admtime-ed291",
  storageBucket: "admtime-ed291.appspot.com",
  messagingSenderId: "247286085513",
  appId: "1:247286085513:web:dc3181779eb20fd0e19358",
  measurementId: "G-C2QCEL8SSY"
};

const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
export const storage = getStorage(firebase);