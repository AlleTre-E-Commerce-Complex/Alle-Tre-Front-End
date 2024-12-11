export  const  subscribeUser = async () => {
    const registration = await navigator.serviceWorker.ready;
  
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
    });
  
    console.log('Push Subscription:', subscription);
  
    // Send subscription to your backend
    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  

  