import { Toaster } from "react-hot-toast";

import { Redirect, Route, Switch } from "react-router-dom";
import routes from "./routes";

import CredentialsuUpdateLayout from "./layout/credentials-update-layout";
import AuthLayouts from "./layout/auth-layout";
import AppLayouts from "./layout/app-layout";
import { useEffect } from "react";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import { useAuthState } from "context/auth-context";
import api from "api";

const subscribeUser = async (run) => {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
  });

  console.log('Push Subscription:', subscription);

  // Send subscription to your backend
  await run(authAxios.post(api.app.notifications.subscribe, {
    subscription: subscription,
  }));
};

function App() { 
  const {run} = useAxios([])
  const {user} = useAuthState()

 
  
  // useEffect(() => {
  //   if (Notification.permission === 'default') {
  //     Notification.requestPermission().then((permission) => {
  //       if (permission === 'granted') {
  //         subscribeUser(run);
  //       }
  //     });
  //   }
  // }, [run]);
  

  // useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/service-worker.js').then((registration) => {
  //       console.log('Service Worker registered:', registration);
  //     }).catch((error) => {
  //       console.error('Service Worker registration failed:', error);
  //     });
  //   }
  // }, []);



  return (
    <div className="App">
      <Switch>
        <Route path={routes.app.default} component={AppLayouts} />

        <Route path={routes.auth.default} component={AuthLayouts} />
        <Route
          path={routes.auth.forgetpass.default}
          component={CredentialsuUpdateLayout}
        />
        <Redirect to={`${routes.app.home}?page=1&perPage=28`} />
      </Switch>

      <Toaster
        position="top-right"
        reverseOrder={true}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          iconTheme: {
            className: "hidden p-0",
          },
          loading: {
            duration: 5000,
            className:
              "w-[430px] h-auto border-l-8 border-[#002189] bg-[#F7F9FF] py-3",
          },
          success: {
            duration: 5000,
            className:
              "w-[430px] h-auto border-l-8 border-[#45BF55] bg-[#F7F9FF] py-3",
          },
          error: {
            duration: 5000,
            className:
              "w-[430px] h-auto border-l-8 border-[#E53737] bg-[#FFFAFA] py-3",
          },
        }}
      />
    </div>
  );
}

export default App;
