import { Toaster } from "react-hot-toast";

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
import { getDefaultPaginationString } from "./constants/pagination";
import InstallPromptButton from "component/shared/installPropt/InstallPromptButton";



function App() {
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
          <Route exact path={routes.auth.forgetpass.restpass} component={CredentialsuUpdateLayout} />
          <Route exact path={routes.auth.forgetpass.default} component={CredentialsuUpdateLayout} />
          <Route path={routes.auth.default} component={AuthLayouts} />
          <Route path={routes.app.default} component={AppLayouts} />
          <Redirect to={`${routes.app.home}?${getDefaultPaginationString()}`} />
        </Switch>
        {/* Blocked Modal */}
        <BlockedModal />
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
        {/* <InstallPromptButton /> */}
      </div>
    </HelmetProvider>
  );
}

export default App;
