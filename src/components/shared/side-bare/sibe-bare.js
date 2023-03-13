import routes from "../../../routes";

import { ReactComponent as CloseIcon } from "../../../../src/assets/icons/x_icon.svg";
import { ReactComponent as Allatre } from "../../../../src/assets/logo/allatre-logo-color.svg";
import AccordionMenu from "../accordion-menu/accordion-menu";
import DropdownLang from "../header-app/dropdown-lang";
import { useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "../../../context/auth-context";
import { Open } from "../../../redux-store/auth-model-slice";
import { useDispatch } from "react-redux";
import "../../../../src/components/shared/header-app/nav-link-header.css";
import { motion } from "framer-motion";

const Sidebar = ({ SetSid, sid }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
    closed: {
      x: "-100%",
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

  const { user } = useAuthState();
  const dispatch = useDispatch();
  const handelOnSell = () => {
    if (user) {
      history.push(routes.createAuction.default);
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
        className={`fixed top-0  w-60 h-full bg-secondary z-50 shadow-lg`}
        variants={sidebarVariants}
        initial="closed"
        animate={sid ? "open" : "closed"}
      >
        {/* Sidebar content */}
        <div className="w-full mx-auto h-screen flex flex-col justify-between ">
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
          <div className="flex flex-col flex-grow gap-y-8 mx-6 mt-10">
            <NavLink
              title="My Bids"
              isActive={
                pathname.length === 1 || pathname.startsWith(routes.app.myBides)
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
                pathname.length === 1 || pathname.startsWith(routes.app.support)
              }
              onClick={() => {
                history.push(routes.app.support);
                SetSid(false);
              }}
            />
            <div className="mt-auto mb-5">
              <DropdownLang className={"text-white "} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
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
export default Sidebar;
