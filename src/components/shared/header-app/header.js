import React from "react";

import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as AllatreLogo } from "../../../../src/assets/logo/allatre-logo-color.svg";
import routes from "../../../routes";
import DropdownLang from "./dropdown-lang";
import NavLinkHeader from "./nav-link-header";
import { useDispatch } from "react-redux";
import { Open } from "../../../redux-store/auth-model-slice";
import { useAuthState } from "../../../context/auth-context";

const Header = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const { user } = useAuthState();
  const dispatch = useDispatch();

  const handelOnSell = () => {
    if (user) {
      history.push(routes.createAuction.default);
    } else dispatch(Open());
  };
  return (
    <div className="w-full fixed top-0 z-20  ">
      <div className="backdrop-blur-md bg-white/30  h-[72px] flex justify-between px-16  ">
        <div className="my-auto">
          <AllatreLogo
            className="cursor-pointer"
            onClick={() => history.push(routes.app.home)}
          />
        </div>
        <div className="flex">
          <div className="flex gap-x-12 my-auto">
            <NavLinkHeader
              title="My Bids"
              isActive={
                pathname.length === 1 || pathname.startsWith(routes.app.myBides)
              }
              onClick={() => history.push(routes.app.myBides)}
            />
            <NavLinkHeader
              title="Categories"
              isActive={
                pathname.length === 1 ||
                pathname.startsWith(routes.app.categories)
              }
              onClick={() => history.push(routes.app.categories)}
            />
            <NavLinkHeader
              title="Watchlist"
              isActive={
                pathname.length === 1 ||
                pathname.startsWith(routes.app.watchlist)
              }
              onClick={() => history.push(routes.app.watchlist)}
            />
            <NavLinkHeader
              title="FAQs"
              isActive={
                pathname.length === 1 || pathname.startsWith(routes.app.faqs)
              }
              onClick={() => history.push(routes.app.faqs)}
            />
            <NavLinkHeader
              title="Support"
              isActive={
                pathname.length === 1 || pathname.startsWith(routes.app.support)
              }
              onClick={() => history.push(routes.app.support)}
            />
            <DropdownLang />
          </div>
          <div className="my-auto ltr:ml-16 rtl:mr-16">
            <button
              onClick={handelOnSell}
              className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[136px] h-[48px]"
            >
              Sell Now
            </button>
          </div>
        </div>
      </div>
      <div className="bg-secondary h-[60px]"></div>
    </div>
  );
};

export default Header;
