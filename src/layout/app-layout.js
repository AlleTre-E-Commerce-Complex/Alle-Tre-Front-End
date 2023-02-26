import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import routes from "../routes";

import Home from "../page/app/home/home";
import Header from "../components/shared/header-app/header";
import MyBids from "../page/app/my-bids/my-bids";
import Categories from "../page/app/categories/categories";
import Watshlist from "../page/app/watshlist/watshlist";
import FAQs from "../page/app/FAQs/FAQs";
import Support from "../page/app/support/support";
import AuthModel from "../components/shared/auth-model/auth-model";

const AppLayouts = () => {
  return (
    <div className="h-screen">
      <AuthModel />
      <Header />
      <Switch>
        <Route path={routes.app.home} component={Home} />
        <Route path={routes.app.myBides} component={MyBids} />
        <Route path={routes.app.categories} component={Categories} />
        <Route path={routes.app.watchlist} component={Watshlist} />
        <Route path={routes.app.faqs} component={FAQs} />
        <Route path={routes.app.support} component={Support} />

        <Redirect to={routes.app.home} />
      </Switch>
    </div>
  );
};

export default AppLayouts;
