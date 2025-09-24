// src/hooks/usePushNotifications.js
import { useEffect } from 'react';
import { initMessagingAndGetToken, onMessageListener } from '../config/firebase-messaging';
import { authAxios } from '../config/axios-config'; // your auth axios instance
import { useAuthState } from 'context/auth-context';

export default function usePushNotifications() {
    console.log('push notification');
    const { user } = useAuthState();
  const isAuthenticated = user ? true : false
  useEffect(() => {
    let unsubOnMessage;

    async function setup() {
        if (!isAuthenticated) return;
        
        const vapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
        const token = await initMessagingAndGetToken({ vapidKey });
      if (token) {
        try {
          // POST token to backend authenticated endpoint
          await authAxios.post('/notifications/save-token', { fcmToken: token });
          // store for local comparison (optional)
          localStorage.setItem('fcmToken', token);
        } catch (err) {
          console.error('Failed to save FCM token to backend', err);
        }
      }

      // subscribe to foreground messages
      unsubOnMessage = onMessageListener((payload) => {
        console.log('Foreground push payload:', payload);
        // show in-app toast / UI update
      });
    }

    setup();

    return () => {
      if (typeof unsubOnMessage === 'function') unsubOnMessage();
    };
  }, [isAuthenticated]);
}
