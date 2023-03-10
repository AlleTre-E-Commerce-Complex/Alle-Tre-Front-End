import React from "react";

import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import routes from "../routes";

import Home from "../page/app/home/home";
import Header from "../components/shared/header-app/header";
import MyBids from "../page/app/my-bids/my-bids";
import Categories from "../page/app/categories/categories";
import Watshlist from "../page/app/watshlist/watshlist";
import FAQs from "../page/app/FAQs/FAQs";
import Support from "../page/app/support/support";
import AuthModel from "../components/shared/auth-model/auth-model";
import CreateAuction from "../page/app/create-auction/create-auction";
import ProductDetails from "../page/app/create-auction/product-details";
import AuctionDetails from "../page/app/create-auction/auction-details";
import ShippingDetails from "../page/app/create-auction/shipping-details";
import PaymentDetails from "../page/app/create-auction/payment-details";
import { Menu, Sidebar } from "semantic-ui-react";
import { ReactComponent as CloseIcon } from "../../src/assets/icons/x_icon.svg";
import { ReactComponent as Allatre } from "../../src/assets/logo/allatre-logo-color.svg";
import DropdownLang from "../components/shared/header-app/dropdown-lang";
import "../../src/components/shared/header-app/nav-link-header.css";
import AccordionMenu from "../components/shared/accordion-menu/accordion-menu";
import { useAuthState } from "../context/auth-context";

const AppLayouts = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [sid, SetSid] = React.useState(false);

  const { user } = useAuthState();
  const handelOnSell = () => {
    if (user) {
      history.push(routes.createAuction.default);
    } else history.push(routes.auth.logIn);
  };

  return (
    <div className="h-screen  p-0 m-0 border-none border-0 scrollbar-hide ">
      <Sidebar.Pushable className="p-0 m-0 border-none scrollbar-hide">
        <Sidebar
          className="p-0 m-0 border-none bg-secondary overflow-hidden"
          as={Menu}
          animation="overlay"
          inverted
          onHide={() => SetSid(false)}
          vertical
          direction="left"
          visible={sid}
        >
          <div className="w-full mx-auto ">
            <div className="flex justify-between pt-5">
              <CloseIcon onClick={() => SetSid(false)} className="mx-4 mt-2" />
              <Allatre
                onClick={() => {
                  history.push(routes.app.home);
                  SetSid(false);
                }}
                className="w-28 mx-8"
              />
            </div>
            <div className="flex flex-col gap-y-8 mx-6 mt-10">
              <NavLink
                title="My Bids"
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.myBides)
                }
                onClick={() => {
                  history.push(routes.app.myBides);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Sell Now"
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.createAuction.default)
                }
                onClick={() => {
                  handelOnSell();
                  SetSid(false);
                }}
              />
              <AccordionMenu />
              <NavLink
                title="Watchlist"
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.watchlist)
                }
                onClick={() => {
                  history.push(routes.app.watchlist);
                  SetSid(false);
                }}
              />
              <NavLink
                title="FAQS"
                isActive={
                  pathname.length === 1 || pathname.startsWith(routes.app.faqs)
                }
                onClick={() => {
                  history.push(routes.app.faqs);
                  SetSid(false);
                }}
              />
              <NavLink
                title="Support"
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.support)
                }
                onClick={() => {
                  history.push(routes.app.support);
                  SetSid(false);
                }}
              />
              <div className="mt-80 ">
                <DropdownLang className={"text-white"} />
              </div>
            </div>
          </div>
        </Sidebar>
        <Sidebar.Pusher
          className=" p-0 m-0 border-none  border-0 "
          dimmed={sid}
        >
          <div className="p-0 m-0 border-none ">
            <AuthModel />
            <Header SetSid={SetSid} sid={sid} />
            <Switch>
              <Route
                path={routes.createAuction.paymentDetails}
                component={PaymentDetails}
              />
              <Route
                path={routes.createAuction.shippingDetails}
                component={ShippingDetails}
              />
              <Route
                path={routes.createAuction.auctionDetails}
                component={AuctionDetails}
              />
              <Route
                path={routes.createAuction.productDetails}
                component={ProductDetails}
              />
              <Route
                path={routes.createAuction.default}
                component={CreateAuction}
              />
              <Route path={routes.app.home} component={Home} />
              <Route path={routes.app.myBides} component={MyBids} />
              <Route path={routes.app.categories} component={Categories} />
              <Route path={routes.app.watchlist} component={Watshlist} />
              <Route path={routes.app.faqs} component={FAQs} />
              <Route path={routes.app.support} component={Support} />
            </Switch>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
};

export const NavLink = ({ title, onClick, isActive }) => {
  return (
    <div>
      <p
        onClick={onClick}
        className={`${
          isActive ? "active-underline-animation" : "hover-underline-animation"
        } text-base text-white font-normal`}
      >
        {title}
      </p>
    </div>
  );
};

export default AppLayouts;
