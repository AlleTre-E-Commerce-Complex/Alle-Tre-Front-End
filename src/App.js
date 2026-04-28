import { Toaster } from "react-hot-toast";
// import './config/firebase-messaging';
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "./routes";

import CredentialsuUpdateLayout from "./layout/credentials-update-layout";
import AuthLayouts from "./layout/auth-layout";
import AppLayouts from "./layout/app-layout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BlockedModal from "component/shared/UserBlockedModal/BlockedModal";
import { HelmetProvider } from "react-helmet-async";
import { initGA, logPageView } from "./utils/analytics";
// import InstallPromptButton from "component/shared/installPropt/InstallPromptButton";
import usePushNotifications from "hooks/usePushNotifications";

function App() {
  usePushNotifications();
  const location = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      initGA();
      logPageView();
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      logPageView();
    }
  }, [location.pathname]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/firebase-messaging-sw.js").then(() => {
        import("./config/firebase-messaging");
      });
    }
  }, []);

  //   useEffect(() => {
  //     const searchParams = new URLSearchParams(location.search);
  //     const unSubscribe = searchParams.get('unSubscribe') === true;

  //     console.log('***************123 Query Params:', searchParams.toString());
  //     console.log('*************** unSubscribe:', unSubscribe);

  //     // if (unSubscribe) {
  //     //     setUnSubscribeModal(true);
  //     // }
  // }, [location.search]);
  return (
    <HelmetProvider>
      <div className="App">
        <Switch>
          <Route
            exact
            path={routes.auth.forgetpass.restpass}
            component={CredentialsuUpdateLayout}
          />
          <Route
            exact
            path={routes.auth.forgetpass.default}
            component={CredentialsuUpdateLayout}
          />
          <Route path={routes.auth.default} component={AuthLayouts} />
          <Redirect exact from="/" to={routes.app.home} />
          <Route path={routes.app.default} component={AppLayouts} />
          {/* <Redirect to={`${routes.app.home}?${getDefaultPaginationString()}`} /> */}
        </Switch>
        {/* Blocked Modal */}
        <BlockedModal />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            top: 40,
          }}
          toastOptions={{
            className: "premium-toast",
            duration: 3000,
            success: {
              className: "premium-toast premium-toast-success",
              iconTheme: {
                primary: "var(--color-green)",
                secondary: "#fff",
              },
            },
            error: {
              className: "premium-toast premium-toast-error",
              iconTheme: {
                primary: "var(--color-red)",
                secondary: "#fff",
              },
            },
            loading: {
              className: "premium-toast premium-toast-loading",
              iconTheme: {
                primary: "var(--color-yellow)",
                secondary: "#fff",
              },
            },
          }}
        />
        {/* <InstallPromptButton /> */}
      </div>
    </HelmetProvider>
  );
}

export default App;
