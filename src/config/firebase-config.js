// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,    
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOAMIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_SOTRAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentications = getAuth(app);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

// Function to get FCM token
export const getFCMToken = async () => {
  try {
    // Add your VAPID key here
    const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
    console.log("vapidKey *************", vapidKey);
    if (!vapidKey) {
      console.error('VAPID key is missing');
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey
    });

    if (currentToken) {
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
};
