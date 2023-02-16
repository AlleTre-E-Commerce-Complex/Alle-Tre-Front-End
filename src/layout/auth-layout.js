import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import routes from "../routes";

import OAuthpage from "../page/auth/O-Auth-page";

const AuthLayouts = () => {
  return (
    <div className="h-screen">
      <Switch>
        <Route path={routes.auth.default} component={OAuthpage} />

        <Redirect to={routes.auth.default} />
      </Switch>
    </div>
  );
};

export default AuthLayouts;
