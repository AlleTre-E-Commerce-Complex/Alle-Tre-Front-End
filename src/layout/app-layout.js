import React, { useState } from "react";

import { Route, Switch } from "react-router-dom";
import routes from "../routes";

import Home from "../page/app/home/home";
import Header from "../components/shared/header-app/header";
import MyBids from "../page/app/my-bids/my-bids";
import Categories from "../page/app/categories/categories";
import FAQs from "../page/app/FAQs/FAQs";
import Support from "../page/app/support/support";

import CreateAuction from "../page/app/create-auction/create-auction";
import ProductDetails from "../page/app/create-auction/product-details";
import AuctionDetails from "../page/app/create-auction/auction-details";
import ShippingDetails from "../page/app/create-auction/shipping-details";
import PaymentDetails from "../page/app/create-auction/payment-details";

import Sidebar from "../components/shared/side-bare/sibe-bare";

import AuthModel from "../components/shared/auth-model/auth-model";

import ProfileLayouts from "../page/app/profile/profile-layouts";
import ProfileAuctionDetails from "../page/app/auction-details/profile-auction-details";
import Footer from "../components/shared/footer/footer";
import Watshlist from "../components/profile-components/watshlist";

const AppLayouts = () => {
  const [sid, SetSid] = useState(false);

  return (
    <div className=" p-0 m-0 border-none border-0 scrollbar-hide  ">
      <Header SetSid={SetSid} sid={sid} />
      <Sidebar SetSid={SetSid} sid={sid} />
      <div className="p-0 m-0 border-none min-h-screen ">
        <AuthModel />
        <Switch>
          <Route
            path={routes.app.profile.myAuctions.activeDetails()}
            component={ProfileAuctionDetails}
          />
          <Route
            path={routes.app.profile.myAuctions.scheduledDetails()}
            component={ProfileAuctionDetails}
          />
          <Route
            path={routes.app.profile.myAuctions.soldDetails()}
            component={ProfileAuctionDetails}
          />
          <Route
            path={routes.app.profile.myAuctions.pendingDetails()}
            component={ProfileAuctionDetails}
          />
          <Route
            path={routes.app.profile.myAuctions.expiredDetails()}
            component={ProfileAuctionDetails}
          />
          <Route path={routes.app.profile.default} component={ProfileLayouts} />
          <Route
            path={routes.app.createAuction.paymentDetails}
            component={PaymentDetails}
          />
          <Route
            path={routes.app.createAuction.shippingDetails}
            component={ShippingDetails}
          />
          <Route
            path={routes.app.createAuction.auctionDetails}
            component={AuctionDetails}
          />
          <Route
            path={routes.app.createAuction.productDetails}
            component={ProductDetails}
          />
          <Route
            path={routes.app.createAuction.default}
            component={CreateAuction}
          />
          <Route path={routes.app.home} component={Home} />
          <Route path={routes.app.myBides} component={MyBids} />
          <Route path={routes.app.categories} component={Categories} />
          <Route path={routes.app.faqs} component={FAQs} />
          <Route path={routes.app.support} component={Support} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayouts;
