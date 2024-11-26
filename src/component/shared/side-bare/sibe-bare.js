import routes from "../../../routes";

import { ReactComponent as CloseIcon } from "../../../../src/assets/icons/x_icon.svg";
import { ReactComponent as Allatre } from "../../../../src/assets/logo/allatre-logo-color.svg";
import AccordionMenu from "../accordion-menu/accordion-menu";
import DropdownLang from "../header-app/dropdown-lang";
import { useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "../../../context/auth-context";
import { Open } from "../../../redux-store/auth-model-slice";
import { useDispatch, useSelector } from "react-redux";
import "../header-app/nav-link-header.css";
import { motion } from "framer-motion";
import { useLanguage } from "../../../context/language-context";
import { toast } from "react-hot-toast";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { useSocket } from "context/socket-context";
import logOut from "../../../../src/assets/icons/log_out_icon.png";

const Sidebar = ({ SetSid, sid }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
    closedEn: {
      x: "-100%",
      transition: { ease: "easeInOut", duration: 0.3 },
    },
    closedAr: {
      x: "100%",
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };
  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
    closed: {
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  const loginData = useSelector((state) => state?.loginDate?.loginDate);

  const { user } = useAuthState();
  const dispatch = useDispatch();
  const handelOnSell = () => {
    if (user) {
      history.push(routes.app.createAuction.default);
    } else {
      dispatch(Open());
      toast.error("You must log in first to add new ads");
    }
  };

  const handelMyPfofile = () => {
    if (user) {
      history.push(routes.app.profile.profileSettings);
    } else {
      dispatch(Open());
      toast.error("You must log in first to show your profile");
    }
  };
  const { logout } = useAuthState();

  const socket = useSocket();
  const onLogout = () => {
    history.push(routes.app.home);
    socket.close();
    logout();
    SetSid(false);
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
    <>
      {/* Overlay */}
      <motion.div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
          sid ? "pointer-events-auto" : "pointer-events-none"
        }`}
        variants={overlayVariants}
        initial="open"
        animate={sid ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        onClick={() => SetSid(false)}
      />
      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 w-60 h-full bg-secondary z-50 shadow-lg`}
        variants={sidebarVariants}
        initial={lang === "en" ? "closedEn" : "closedAr"}
        animate={sid ? "open" : lang === "en" ? "closedEn" : "closedAr"}
      >
        {/* Sidebar content */}
        <div className="w-full mx-auto h-screen flex flex-col justify-between ">
          <div className="flex justify-between pt-5">
            <CloseIcon
              onClick={() => SetSid(false)}
              className="mx-4 mt-2 cursor-pointer"
            />
            <Allatre
              onClick={() => {
                history.push(routes.app.home);
                SetSid(false);
              }}
              className="w-28 mx-8"
            />
          </div>
          <div className="flex-grow overflow-y-auto">
            <div className="flex flex-col gap-y-8 mx-6 mt-10 w-full">
              <NavLink
                title={selectedContent[localizationKeys.profile]}
                isActive={
                  pathname === routes.app.profile.profileSettings ||
                  pathname === routes.app.profile.default
                }
                onClick={() => {
                  handelMyPfofile();
                  SetSid(false);
                }}
              />
              <NavLink
                title={selectedContent[localizationKeys.myAuctions]}
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.myAuctions.default)
                }
                onClick={() => {
                  handelmyAuctions();
                  SetSid(false);
                }}
              />
              <NavLink
                title={selectedContent[localizationKeys.myBids]}
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.myBids.default)
                }
                onClick={() => {
                  handelmyBids();
                  SetSid(false);
                }}
              />
              <NavLink
                title={selectedContent[localizationKeys.sellNow]}
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.createAuction.default)
                }
                onClick={() => {
                  handelOnSell();
                  SetSid(false);
                }}
              />
              <NavLink
                title={selectedContent[localizationKeys.watchlist]}
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.watchlist)
                }
                onClick={() => {
                  handelWatchlist();
                  SetSid(false);
                }}
              />
              <NavLink
                title={selectedContent[localizationKeys.Purchased]}
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.purchased)
                }
                onClick={() => {
                  history.push(routes.app.profile.purchased);
                  SetSid(false);
                }}
              />
              <NavLink
                title={selectedContent[localizationKeys.Wallet]}
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.wallet)
                }
                onClick={() => {
                  history.push(routes.app.profile.wallet);
                  SetSid(false);
                }}
              />
              <NavLink
                title={selectedContent[localizationKeys.faqs]}
                isActive={
                  pathname.length === 1 || pathname.startsWith(routes.app.faqs)
                }
                onClick={() => {
                  history.push(routes.app.faqs);
                  SetSid(false);
                }}
              />
              <NavLink
                title={selectedContent[localizationKeys.support]}
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.support)
                }
                onClick={() => {
                  history.push(routes.app.support);
                  SetSid(false);
                }}
              />
              <div
                onClick={onLogout}
                className="flex justify-start items-center gap-x-2 mt-12 mb-6 cursor-pointer mx-10"
              >
                <LogoutIcon />
                <p className="text-red-600 text-base font-medium underline">
                  {selectedContent[localizationKeys.logout]}
                </p>
              </div>
              <div className="mt-auto mb-5">
                <DropdownLang className={"text-white "} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export const NavLink = ({ title, onClick, isActive }) => {
  return (
    <div className="w-full">
      <p
        onClick={onClick}
        className={`${
          isActive ? "active-underline-animation" : "hover-underline-animation"
        } text-base text-white font-normal cursor-pointer`}
      >
        {title}
      </p>
    </div>
  );
};

const LogoutIcon = () => (
  <svg
    className="w-4 h-4 mt-0.5 text-red-600"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

export default Sidebar;
