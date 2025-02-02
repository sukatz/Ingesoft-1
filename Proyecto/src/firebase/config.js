// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCUdWNXJ_VPj2sun_U6r5ibRmO569U-1aI",
    authDomain: "twordle-unal.firebaseapp.com",
    projectId: "twordle-unal",
    storageBucket: "twordle-unal.firebasestorage.app",
    messagingSenderId: "992872294892",
    appId: "1:992872294892:web:0bc74d6323e118b928f8c9",
    measurementId: "G-CD3MCKK999"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };