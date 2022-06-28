/* eslint-disable no-debugger, no-console*/
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
// import "firebase/auth";


// Firebase configuration
firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
});

// // Exporting Firebase instances
// export const FA = firebase.auth();
export const Fdb = firebase.firestore(); 
export const FAnalytics = firebase.analytics();