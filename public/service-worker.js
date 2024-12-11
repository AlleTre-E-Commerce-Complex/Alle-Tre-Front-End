/* eslint-disable no-restricted-globals */
self.addEventListener('push', function(event) {
    const options = {
      body: event.data.text(),
      icon: '/path/to/icon.png', // Your notification icon
      badge: '/path/to/badge.png',
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
    
    event.waitUntil(
      self.clients.openWindow('/')  // Or specific URL based on notification
    );
  });