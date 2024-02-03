// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration, FIJARSE LUEGO DE HACER PRIVADAS LAS CREDENCIALES
const firebaseConfig = {
  apiKey: "AIzaSyCiqh1bJBgR6hh0-Xya4r8R4lD9dSclqMw",
  authDomain: "proyecto-agendabd.firebaseapp.com",
  projectId: "proyecto-agendabd",
  storageBucket: "proyecto-agendabd.appspot.com",
  messagingSenderId: "951046571798",
  appId: "1:951046571798:web:29249bd74ad3f970147237"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
