import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyD_0lko0Y1P7jRdBlUsWawVn-jdwTSCMf0",
    authDomain: "bootcamp-project-abb2c.firebaseapp.com",
    projectId: "bootcamp-project-abb2c",
    storageBucket: "bootcamp-project-abb2c.firebasestorage.app",
    messagingSenderId: "267499139656",
    appId: "1:267499139656:web:47ca0d324208da75b9de7d",
    measurementId: "G-5NJEGGV0YZ"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
