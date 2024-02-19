// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJWmqotjwtikxnXKxFVw1d1tzBV17mCwg",
  authDomain: "proyecto-agendabd2.firebaseapp.com",
  projectId: "proyecto-agendabd2",
  storageBucket: "proyecto-agendabd2.appspot.com",
  messagingSenderId: "539885623142",
  appId: "1:539885623142:web:dc42dd3f3413e2f8f59aa7"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);


export default appFirebase;
