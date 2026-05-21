import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, set, push, get } from "firebase/database";

let app;
if (!getApps().length) {
  app = initializeApp({
    // add your firebase configurations
    apiKey: "AIzaSyBojPiepueiqe5oRzSIASzOVpN-nEbhOho",
    authDomain: "pill-pal-medical-app.firebaseapp.com",
    databaseURL:
      "https://pill-pal-medical-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pill-pal-medical-app",
    storageBucket: "pill-pal-medical-app.firebasestorage.app",
    messagingSenderId: "128102662796",
    appId: "1:128102662796:web:86561917f1c149c87b71a9",
    measurementId: "G-BY61N5FXH1",
  });
} else {
  app = getApps()[0];
}

// Initialize Firebase
const database = getDatabase(app);

export { database, ref, set, push, get };
