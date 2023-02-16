import { Toaster } from "react-hot-toast";

import { Redirect, Route, Switch } from "react-router-dom";
import routes from "./routes";

import CredentialsuUpdateLayout from "./layout/credentials-update-layout";
import AuthLayouts from "./layout/auth-layout";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={routes.auth.default} component={AuthLayouts} />

        <Route
          path={routes.auth.forgetpass.default}
          component={CredentialsuUpdateLayout}
        />

        <Redirect path={routes.auth.default} component={AuthLayouts} />
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
              "w-[430px] h-[85px] border-l-8 border-[#002189] bg-[#F7F9FF]",
          },
          success: {
            duration: 5000,
            className:
              "w-[430px] h-[85px] border-l-8 border-[#002189] bg-[#F7F9FF]",
          },
          error: {
            duration: 5000,
            className:
              "w-[430px] h-[85px] border-l-8 border-[#E53737] bg-[#FFFAFA]",
          },
        }}
      />
    </div>
  );
}

export default App;
