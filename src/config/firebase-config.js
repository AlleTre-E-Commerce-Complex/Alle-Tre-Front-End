// // Import the functions you need from the SDKs you need
// import { initializeApp,getApps, getApp  } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getMessaging, getToken } from "firebase/messaging";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
  
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,    
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOAMIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_SOTRAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };
// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// export const authentications = getAuth(app);

// // Initialize Firebase Cloud Messaging
// let messaging 
// try {
//    messaging = getMessaging(app);
// } catch (error) {
//   console.log('firebase message error :',error)
// }

// // Function to get FCM token
// export const getFCMToken = async () => {
//   try {
//     // Add your VAPID key here
//     const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
//     if (!vapidKey) {
//       console.error('VAPID key is missing');
//       return null;
//     }

//     const currentToken = await getToken(messaging, {
//       vapidKey: vapidKey
//     });

//     if (currentToken) {
//       return currentToken;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('An error occurred while retrieving token:', error);
//     return null;
//   }
// };



import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,    
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOAMIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_SOTRAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const authentications = getAuth(app);
export default app;
