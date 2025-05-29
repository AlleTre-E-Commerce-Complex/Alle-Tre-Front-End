// import { initializeApp, getApps, getApp } from "firebase/app";
// import {
//   getMessaging,
//   getToken,
//   onMessage,
//   isSupported
// } from "firebase/messaging";

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,    
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOAMIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_SOTRAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

// // 🔒 Avoid duplicate app initialization
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// isSupported().then((supported) => {
//   if (!supported) {
//     console.warn("FCM is not supported in this browser.");
//     return;
//   }

// let messaging 
// try {
//    messaging = getMessaging(app);
// } catch (error) {
//   console.log('firebase message error :',error)
// }

//   getToken(messaging, {
//     vapidKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
//   })
//     .then((token) => {
//       if (token) {
//         console.log("FCM Token:", token);
//       } else {
//         console.warn("No FCM token available.");
//       }
//     })
//     .catch((err) => {
//       console.error("An error occurred while retrieving token. ", err);
//     });

//   onMessage(messaging, (payload) => {
//     console.log("Message received. ", payload);
//   });
// });


import app from "./firebase-config";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from "firebase/messaging";

export const initMessaging = async () => {
  const supported = await isSupported();
  if (!supported) {
    console.warn("FCM not supported in this browser.");
    return null;
  }

  const messaging = getMessaging(app);

  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error retrieving FCM token", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(getMessaging(app), (payload) => {
      resolve(payload);
    });
  });
