import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "astroguid-1.firebaseapp.com",
    projectId: "astroguid-1",
    storageBucket: "astroguid-1.firebasestorage.app",
    messagingSenderId: "765854749850",
    appId: "1:765854749850:web:7533627e7c0530246dfb23",
    measurementId: "G-CR95Q3HXZR"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
}

export { app, auth, messaging, getToken, onMessage };
