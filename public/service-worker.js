const { default: routes } = require("routes");

/* eslint-disable no-restricted-globals */
self.addEventListener('push', function(event) {
    const options = {
      body: event.data.text(),
      icon: 'https://firebasestorage.googleapis.com/v0/b/allatre-2e988.appspot.com/o/1.png?alt=media&token=3d538116-bf6d-45d9-83e0-7f0076c43077', // Your notification icon
      // badge: '/path/to/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      },
      actions: [
        {
          action: 'explore',
          title: 'View notification',
        }
      ]
    };
  
    event.waitUntil(
      self.registration.showNotification('Allatre Notification', options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    const urlToOpen = event.notification.data.url;
    console.log("urlToOpen", urlToOpen);
    event.waitUntil(
      self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(function(clientList) {
        // If a window is already open, focus it and navigate
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
    );
  });