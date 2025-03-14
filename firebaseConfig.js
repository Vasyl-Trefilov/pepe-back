import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAky8A0-3DJTPJSYoUwvJBT0RAKbvVf8XE",
  authDomain: "pepeplush.firebaseapp.com",
  projectId: "pepeplush",
  storageBucket: "pepeplush.appspot.com",
  messagingSenderId: "415655329817",
  appId: "1:415655329817:web:d944d23c1e7a1eb5deaa88",
  measurementId: "G-NS49XF3G1K",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { auth, firestore };
