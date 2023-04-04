import React, { useState } from "react";

import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as AllatreLogo } from "../../../../src/assets/logo/allatre-logo-color.svg";
import routes from "../../../routes";
import DropdownLang from "./dropdown-lang";
import NavLinkHeader from "./nav-link-header";
import { useDispatch } from "react-redux";
import { Open } from "../../../redux-store/auth-model-slice";
import { useAuthState } from "../../../context/auth-context";
import { BiMenu } from "react-icons/bi";
import { RxMagnifyingGlass } from "react-icons/rx";
import { RiArrowDownSFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import PopupCategoriesModel from "./popup-categories-model";
import { Input } from "semantic-ui-react";

const Header = ({ SetSid }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const [serchShow, setSerchShow] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const { user } = useAuthState();
  const dispatch = useDispatch();

  const handelOnSell = () => {
    if (user) {
      history.push(routes.app.createAuction.default);
    } else dispatch(Open());
  };

  const handelRegister = () => {
    if (user) {
      history.push(routes.app.profile.profileSettings);
    } else dispatch(Open());
  };
  return (
    <div className=" w-full fixed top-0 z-50 bg-white/30  backdrop-blur-md ">
      <div className="md:h-[72px] h-[60px] flex justify-between lg:px-16 px-5 max-w-[1440px] mx-auto ">
        <div className="my-auto hidden md:block">
          <AllatreLogo
            className="cursor-pointer hidden md:block"
            onClick={() => history.push(routes.app.home)}
          />
        </div>
        <div onClick={() => SetSid(true)} className="my-auto md:hidden block">
          <BiMenu className="text-primary cursor-pointer" size={30} />
        </div>
        <div className="flex">
          <div className="my-auto ">
            <AllatreLogo
              className="cursor-pointer w-[100px] block md:hidden"
              onClick={() => history.push(routes.app.home)}
            />
          </div>
          <div className="md:flex hidden lg:gap-x-12 gap-x-10 my-auto">
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
          <div className="my-auto ltr:ml-16 rtl:mr-16 md:flex hidden">
            <button
              onClick={handelOnSell}
              className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[136px] h-[48px]"
            >
              Sell Now
            </button>
          </div>
        </div>
        <div
          onClick={() => setSerchShow((p) => !p)}
          className="my-auto md:hidden block"
        >
          <RxMagnifyingGlass
            className="text-primary cursor-pointer"
            size={30}
          />
        </div>
      </div>
      <div className={` ${serchShow ? " h-[60px]" : ""}  bg-secondary   `}>
        <div className="py-[6px] flex gap-x-4 lg:px-16 px-5 max-w-[1440px] mx-auto ">
          <Input
            className="w-full h-[48px] edit-search-Input "
            icon="search"
            placeholder="Search..."
          />
          <div className="sm:block hidden">
            <button
              className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[304px] h-[48px] flex justify-center gap-x-1 py-3 text-base font-normal"
              onClick={handleOpen}
            >
              Categories
              <RiArrowDownSFill size={20} />
            </button>
          </div>
          <PopupCategoriesModel isOpen={isOpen} onClose={handleClose} />
          <div className="sm:block hidden">
            <button
              onClick={handelRegister}
              className="w-[136px] h-[48px] border-[1px] border-white text-white rounded-lg flex justify-center gap-x-1 py-3 text-base font-normal"
            >
              <FaUser size={15} className="mt-1" />
              <p className="pt-1">{user ? "Profile" : "Register Now"}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
