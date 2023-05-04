import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import userProfileicon from "../../../src/assets/icons/user-Profile-icon.png";
import logOut from "../../../src/assets/icons/log_out_icon.png";

import auth from "../../utils/auth";
import routes from "../../routes";

import { motion } from "framer-motion";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";

const ProfileSideBare = ({ SetSid, sid }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [lang] = useLanguage();
  const [pofileData, setPofileData] = useState();

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const { run: runPofile, isLoading: isLoadingPofile } = useAxios([]);
  useEffect(() => {
    runPofile(
      authAxios.get(api.app.profile.default).then((res) => {
        setPofileData(res?.data?.data);
      })
    );
  }, [runPofile, forceReload]);

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

  const onLogout = () => {
    window.location.reload();
    history.push(routes.app.home);
    auth.logout();
  };

  const ProfileData = useSelector((state) => state.profileData.PofileData);
  return (
    <>
      <div className="h-screen fixed md:block hidden w-[255px] ">
        {/* img */}
        <div className="flex gap-x-4 mx-14 pb-8 pt-3">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={
              ProfileData?.img || pofileData?.imageLink
                ? ProfileData?.img || pofileData?.imageLink
                : userProfileicon
            }
            alt="userProfileicon"
          />
          <div className="pt-1">
            <h1 className="text-base text-gray-dark font-medium">
              {ProfileData?.name || pofileData?.userName}
            </h1>
            <p className="text-xs text-gray-med font-normal">Online</p>
          </div>
        </div>
        {/* content */}
        <div>
          <NavLink
            title="Profile Settings"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.profile.profileSettings)
            }
            onClick={() => history.push(routes.app.profile.profileSettings)}
          />
          <NavLink
            title="My Auctions"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.profile.myAuctions.default)
            }
            onClick={() => history.push(routes.app.profile.myAuctions.default)}
          />
          <NavLink
            title="Watchlist"
            isActive={
              pathname.length === 1 ||
              pathname.startsWith(routes.app.profile.watchlist)
            }
            onClick={() => history.push(routes.app.profile.watchlist)}
          />
        </div>
        <div
          onClick={onLogout}
          className="flex justify-center gap-x-2 mt-12  cursor-pointer"
        >
          <img className="w-4 h-4 mt-0.5" src={logOut} alt="logOut" />
          <p className="text-gray-med text-sm font-normal underline">Logout</p>
        </div>
      </div>
      <div className="block md:hidden">
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
        <motion.div
          className="h-full fixed top-0 z-50 w-[255px] bg-white "
          variants={sidebarVariants}
          initial={lang === "en" ? "closedEn" : "closedAr"}
          animate={sid ? "open" : lang === "en" ? "closedEn" : "closedAr"}
        >
          <div className="">
            {/* img */}
            <div className="flex gap-x-4 mx-14 pb-8 pt-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={ProfileData?.img ? ProfileData?.img : userProfileicon}
                alt="userProfileicon"
              />
              <div className="pt-1">
                <h1 className="text-base text-gray-dark font-medium">
                  {ProfileData?.name}
                </h1>
                <p className="text-xs text-gray-med font-normal">Online</p>
              </div>
            </div>
            {/* content */}
            <div>
              <NavLink
                title="Profile Settings"
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.profileSettings)
                }
                onClick={() => {
                  history.push(routes.app.profile.profileSettings);
                  SetSid(false);
                }}
              />
              <NavLink
                title="My Auctions"
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.myAuctions.default)
                }
                onClick={() => {
                  history.push(routes.app.profile.myAuctions.default);
                  SetSid(false);
                }}
              />
            </div>
            <div
              onClick={onLogout}
              className="flex justify-center gap-x-2 mt-12  cursor-pointer"
            >
              <img className="w-4 h-4 mt-0.5" src={logOut} alt="logOut" />
              <p className="text-gray-med text-sm font-normal underline">
                Logout
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export const NavLink = ({ title, onClick, isActive }) => {
  return (
    <div>
      <p
        onClick={onClick}
        className={`${
          isActive
            ? "bg-primary-light/10 text-primary mx-0 px-10 font-bold "
            : "mx-10 px-4 border-b-gray-veryLight border-b-[1px] "
        } text-base text-gray-dark font-normal py-5 cursor-pointer flex`}
      >
        <p
          className={`${
            isActive
              ? "bg-primary font-bold w-2 h-2 rounded-full mt-1.5 mx-4"
              : ""
          } translate delay-150 duration-150 `}
        ></p>
        <p className={`${isActive ? " font-bold " : ""}`}>{title}</p>
      </p>
    </div>
  );
};
export default ProfileSideBare;
