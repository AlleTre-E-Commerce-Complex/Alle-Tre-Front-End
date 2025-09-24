import app from "./firebase-config";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from "firebase/messaging";

export const initMessagingAndGetToken = async () => {
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
