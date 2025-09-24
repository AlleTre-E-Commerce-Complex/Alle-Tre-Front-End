/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCYRf1halN-JVwx1PwHCqvAcB0UeecEDlI",    
    authDomain: "alletre-auctions.firebaseapp.com",
    projectId: "alletre-auctions",
    storageBucket: "alletre-auctions.firebasestorage.app",
    messagingSenderId: "1043853491459",
    appId: "1:1043853491459:web:68fe909550a22915f6bd36",
};

// Initialize Firebase
 firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
 messaging.onBackgroundMessage(function(payload) {

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://firebasestorage.googleapis.com/v0/b/allatre-2e988.appspot.com/o/1.png?alt=media&token=3d538116-bf6d-45d9-83e0-7f0076c43077',
    // badge: '/path/to/your/badge.png',
    data: {
      url: payload.data?.url || '/',
      auctionId: payload.data?.auctionId
    },
    requireInteraction: true
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
