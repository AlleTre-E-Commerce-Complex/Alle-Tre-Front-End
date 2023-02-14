import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import EnterEmailPage from "../page/auth/enter-email-page";
import OAuthpage from "../page/auth/O-Auth-page";
import routes from "../routes";

const AuthLayouts = () => {
  return (
    <div className="h-screen">
      <Switch>
        <Route path={routes.auth.enterEmail} component={EnterEmailPage} />
        <Route path={routes.auth.default} component={OAuthpage} />

        <Redirect to={routes.auth.default} />
      </Switch>
    </div>
  );
};

export default AuthLayouts;
