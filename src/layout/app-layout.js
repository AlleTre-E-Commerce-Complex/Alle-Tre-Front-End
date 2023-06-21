import React, { useState } from "react";

import { Route, Switch, useLocation } from "react-router-dom";
import routes from "../routes";

import Home from "../page/app/home/home";
import Header from "../component/shared/header-app/header";
import FAQs from "../page/app/FAQs/FAQs";
import Support from "../page/app/support/support";
import Categories from "../page/app/categories/categories";

import CreateAuction from "../page/app/create-auction/create-auction";
import ProductDetails from "../page/app/create-auction/product-details";
import AuctionDetails from "../page/app/create-auction/auction-details";
import ShippingDetails from "../page/app/create-auction/shipping-details";
import PaymentDetails from "../page/app/create-auction/payment-details";

import Sidebar from "../component/shared/side-bare/sibe-bare";

import AuthModel from "../component/shared/auth-model/auth-model";

import ProfileLayouts from "../page/app/profile/profile-layouts";
import ProfileAuctionDetails from "../page/app/auction-details/profile-auction-details";
import Footer from "../component/shared/footer/footer";
import HomeAuctionDetails from "../page/app/auction-details/home-auction-details";
import PaymentSucsessModel from "../component/shared/payment-models/payment-sucsess-model";
import PayDeposite from "../component/home-components/pay-deposite";
import useLocalStorage from "../hooks/use-localstorage";
import Win from "../component/shared/lotties-file/win";
import { useEffect } from "react";
import auth from "../utils/auth";
import { useAuthState } from "../context/auth-context";
import { io } from "socket.io-client";
import BuyNowPaymentPage from "../component/auctions-details-components/buy-now-payment-page";

const AppLayouts = () => {
  const [sid, SetSid] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { pathname, auctionId } = useLocation();
  const [auctionIdLocal, setAuctionId] = useLocalStorage("auctionId", "");

  return (
    <div className=" p-0 m-0 border-none border-0 scrollbar-hide  ">
      <Header SetSid={SetSid} sid={sid} />
      <Sidebar SetSid={SetSid} sid={sid} />
      <div className="p-0 m-0 border-none min-h-screen ">
        <Win />
        <AuthModel currentPAth={currentPath} />
        <PaymentSucsessModel
          open={
            pathname.length === 1 ||
            pathname.endsWith(`${routes.app.home}/paymentdetails`) ||
            pathname.endsWith(`${routes.app.home}/payDeposite`) ||
            pathname.endsWith(`${routes.app.home}/complete-pay`) ||
            pathname.endsWith(`${routes.app.home}/buyNow`)
              ? true
              : false
          }
        />
        {/* <SocketProvider> */}
        <Switch>
          <Route
            path={routes.app.profile.myBids.inPogressDetails()}
            component={HomeAuctionDetails}
          />
          <Route
            path={routes.app.profile.myBids.pendingDetails()}
            component={HomeAuctionDetails}
          />
          <Route
            path={routes.app.profile.myBids.waitingForDeliveryDetails()}
            component={HomeAuctionDetails}
          />
          <Route
            path={routes.app.profile.myBids.expiredDetails()}
            component={HomeAuctionDetails}
          />
          <Route
            path={routes.app.profile.myBids.completedDetails()}
            component={HomeAuctionDetails}
          />

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

          <Route path={routes.app.buyNow()} component={BuyNowPaymentPage} />
          <Route path={routes.app.payDeposite()} component={PayDeposite} />

          <Route
            path={routes.app.homeDetails()}
            component={HomeAuctionDetails}
          />

          <Route path={routes.app.home} component={Home} />
          <Route path={routes.app.categories()} component={Categories} />
          <Route path={routes.app.faqs} component={FAQs} />
          <Route path={routes.app.support} component={Support} />
        </Switch>
        {/* </SocketProvider> */}
      </div>
      <Footer />
    </div>
  );
};

export default AppLayouts;
