import React, { useState } from "react";

import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as AllatreLogo } from "../../../../src/assets/logo/allatre-logo-color.svg";
import routes from "../../../routes";
import DropdownLang from "./dropdown-lang";
import NavLinkHeader from "./nav-link-header";
import { useDispatch, useSelector } from "react-redux";
import { Open } from "../../../redux-store/auth-model-slice";
import { useAuthState } from "../../../context/auth-context";
import { BiMenu } from "react-icons/bi";
import { RxMagnifyingGlass } from "react-icons/rx";
import { RiArrowDownSFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import PopupCategoriesModel from "./popup-categories-model";
import { Input } from "semantic-ui-react";
import useFilter from "../../../hooks/use-filter";
import { useDebouncedCallback } from "use-debounce";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

const Header = ({ SetSid }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { pathname } = useLocation();
  const { search } = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const [serchShow, setSerchShow] = useState(false);

  const [name, setTitle] = useFilter("title", "");
  const debounced = useDebouncedCallback((value) => {
    setTitle(value);
    history.push(`${routes.app.home}?page=1&perPage=28&title=${value}`);
    window.scrollTo({
      behavior: "smooth",
      top: 950,
    });
  }, 850);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const { user } = useAuthState();
  const dispatch = useDispatch();
  const loginData = useSelector((state) => state?.loginDate?.loginDate);

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
  const handelmyAuctions = () => {
    if (user) {
      history.push(routes.app.profile.myAuctions.default);
    } else dispatch(Open());
  };
  const handelmyBids = () => {
    if (user) {
      history.push(routes.app.profile.myBids.default);
    } else dispatch(Open());
  };
  const handelWatchlist = () => {
    if (user) {
      history.push(routes.app.profile.watchlist);
    } else dispatch(Open());
  };

  return (
    <div className=" w-full fixed top-0 z-50 bg-white/30 backdrop-blur-md ">
      <div className="md:h-[72px] h-[60px] flex justify-between gap-x-4  max-w-[1440px] lg:mx-auto md:mx-12 px-2 md:px-0">
        <div className="my-auto hidden md:block">
          <AllatreLogo
            className="cursor-pointer hidden md:block"
            onClick={() => history.push(`${routes.app.home}?page=1&perPage=28`)}
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
              title={selectedContent[localizationKeys.myAuctions]}
              isActive={
                pathname.length === 1 ||
                pathname.startsWith(routes.app.profile.myAuctions.default)
              }
              onClick={() => handelmyAuctions()}
            />
            <NavLinkHeader
              title={selectedContent[localizationKeys.myBids]}
              isActive={
                pathname.length === 1 ||
                pathname.startsWith(routes.app.profile.myBids.default)
              }
              onClick={() => handelmyBids()}
            />
            <NavLinkHeader
              title={selectedContent[localizationKeys.watchlist]}
              isActive={
                pathname.length === 1 ||
                pathname.startsWith(routes.app.profile.watchlist)
              }
              onClick={() => handelWatchlist()}
            />
            <NavLinkHeader
              title={selectedContent[localizationKeys.faqs]}
              isActive={
                pathname.length === 1 || pathname.startsWith(routes.app.faqs)
              }
              onClick={() => history.push(routes.app.faqs)}
            />
            {/* <NavLinkHeader
              title={selectedContent[localizationKeys.support]}
              isActive={
                pathname.length === 1 || pathname.startsWith(routes.app.support)
              }
              onClick={() => history.push(routes.app.support)}
            /> */}
            <DropdownLang />
          </div>
          <div className="my-auto ltr:ml-16 rtl:mr-16 md:flex hidden">
            <button
              onClick={handelOnSell}
              className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[136px] h-[48px] ltr:font-serifEN rtl:font-serifAR"
            >
              {selectedContent[localizationKeys.sellNow]}
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
      <div className={` ${serchShow ? "h-[60px]" : ""} bg-white`}>
        <div className="py-[6px] flex gap-x-4  max-w-[1440px] lg:mx-auto md:mx-12 px-2 md:px-0 ">
          <Input
            className="w-full border border-secondary rounded-md h-[48px] edit-search-Input ltr:font-serifEN rtl:font-serifAR "
            icon="search"
            placeholder={selectedContent[localizationKeys.search]}
            onChange={(e, { value }) => {
              debounced(value);
            }}
          />
          <div className="md:block hidden">
            <button
              className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[304px] h-[48px] flex justify-center gap-x-1 py-3 text-base font-normal"
              onClick={handleOpen}
            >
              {selectedContent[localizationKeys.categories]}
              <RiArrowDownSFill size={20} />
            </button>
          </div>
          <PopupCategoriesModel
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onClose={handleClose}
          />
          <div className="md:block hidden">
            <button
              onClick={handelRegister}
              className="w-[136px] h-[48px] border-[1px] border-secondary text-secondary rounded-lg flex justify-center gap-x-1 py-3 text-base font-normal"
            >
              <FaUser size={15} className="mt-1" />
              <p className="pt-1">
                {user
                  ? selectedContent[localizationKeys.profile]
                  : selectedContent[localizationKeys.registerNow]}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
