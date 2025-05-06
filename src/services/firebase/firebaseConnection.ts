import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB7up3c7fhEdPrxY0e2_djubt3Rmxpgrcg",
  authDomain: "tarefasplus-192f4.firebaseapp.com",
  projectId: "tarefasplus-192f4",
  storageBucket: "tarefasplus-192f4.firebasestorage.app",
  messagingSenderId: "83842013421",
  appId: "1:83842013421:web:f997a4f0010b6a4fa714e4"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db }