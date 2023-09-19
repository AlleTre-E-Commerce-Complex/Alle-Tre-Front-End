import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import routes from "../routes";

import OAuthpage from "../page/auth/O-Auth-page";
import ResetPasswordPage from "page/auth/rest-password-page";

const AuthLayouts = () => {
  return (
    <div className="h-screen">
      <Switch>
        {console.log("auth")}
        <Route path={routes.auth.default} component={OAuthpage} />
      </Switch>
    </div>
  );
};

export default AuthLayouts;
