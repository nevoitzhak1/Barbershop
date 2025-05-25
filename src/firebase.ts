// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgFZPwyWzj7UIiKKOX_B88SW_ZWrtDaf8",
  authDomain: "barbershop-app-b2d11.firebaseapp.com",
  projectId: "barbershop-app-b2d11",
  storageBucket: "barbershop-app-b2d11.firebasestorage.app",
  messagingSenderId: "940185680264",
  appId: "1:940185680264:web:2737ec65dc12b739ff623d",
  measurementId: "G-127P4C0KYT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
