import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import userProfileicon from "../../../src/assets/icons/user-Profile-icon.png";
import logOut from "../../../src/assets/icons/log_out_icon.png";

import routes from "../../routes";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { useAuthState } from "context/auth-context";
import { useSocket } from "context/socket-context";

const ProfileSideBare = ({ SetSid, sid }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { pathname } = useLocation();
  const [pofileData, setPofileData] = useState();

  const { logout } = useAuthState();

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
  const socket = useSocket();
  const onLogout = () => {
    history.push(routes.app.home);
    socket.close();
    logout();
  };

  const ProfileData = useSelector((state) => state.profileData.PofileData);
  return (
    <>
      <div className="h-screen fixed md:block hidden w-[250px]">
        {/* Fixed Header */}
        <div className="h-[80px] flex gap-x-4 mx-14 pb-4 pt-3">
          <div className="min-w-[48px] h-12">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={
                ProfileData?.img || pofileData?.imageLink
                  ? ProfileData?.img || pofileData?.imageLink
                  : userProfileicon
              }
              alt="userProfileicon"
            />
          </div>
          <div className="pt-1">
            <h1 className="text-base text-gray-dark font-medium">
              {ProfileData?.name || pofileData?.userName}
            </h1>
            <p className="text-xs text-gray-med font-normal">
              {selectedContent[localizationKeys.online]}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex flex-col min-h-[500px] pb-10">
            <NavLink
              title={selectedContent[localizationKeys.profileSettings]}
              isActive={pathname.startsWith(routes.app.profile.profileSettings)}
              onClick={() => history.push(routes.app.profile.profileSettings)}
            />
            <NavLink
              title={selectedContent[localizationKeys.myAuctions]}
              isActive={pathname.startsWith(
                routes.app.profile.myAuctions.default
              )}
              onClick={() =>
                history.push(routes.app.profile.myAuctions.default)
              }
            />
            <NavLink
              title={selectedContent[localizationKeys.myBids]}
              isActive={pathname.startsWith(routes.app.profile.myBids.default)}
              onClick={() => history.push(routes.app.profile.myBids.default)}
            />
            <NavLink
              title={selectedContent[localizationKeys.watchlist]}
              isActive={pathname.startsWith(routes.app.profile.watchlist)}
              onClick={() => history.push(routes.app.profile.watchlist)}
            />
            <NavLink
              title={selectedContent[localizationKeys.Purchased]}
              isActive={pathname.startsWith(routes.app.profile.purchased)}
              onClick={() => history.push(routes.app.profile.purchased)}
            />
            <NavLink
              title={selectedContent[localizationKeys.Wallet]}
              isActive={pathname.startsWith(routes.app.profile.wallet)}
              onClick={() => history.push(routes.app.profile.wallet)}
            />
            <div className="h-[100px]"></div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div
          onClick={onLogout}
          className="h-[40px] fixed bottom-0 w-[250px] flex justify-center gap-x-2 py-2 cursor-pointer bg-white shadow-md border-t"
        >
          <LogoutIcon />
          <p className="text-red-600 text-base font-medium underline">
            {selectedContent[localizationKeys.logout]}
          </p>
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
          className="h-full fixed top-0 z-50 w-[255px] bg-white flex flex-col"
          variants={sidebarVariants}
          initial={lang === "en" ? "closedEn" : "closedAr"}
          animate={sid ? "open" : lang === "en" ? "closedEn" : "closedAr"}
        >
          {/* Fixed Header */}
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
              <p className="text-xs text-gray-med font-normal">
                {selectedContent[localizationKeys.online]}
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto">
            <div>
              <NavLink
                title={selectedContent[localizationKeys.profileSettings]}
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
                title={selectedContent[localizationKeys.myAuctions]}
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.myAuctions.default)
                }
                onClick={() => {
                  history.push(routes.app.profile.myAuctions.default);
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
                  history.push(routes.app.profile.myBids.default);
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
                  history.push(routes.app.profile.watchlist);
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
            </div>
          </div>

          {/* Fixed Footer */}
          <div
            onClick={onLogout}
            className="flex justify-center gap-x-2 py-4 cursor-pointer"
          >
            <p className="text-red-600 text-base font-medium underline">
              {selectedContent[localizationKeys.logout]}
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export const NavLink = ({ title, onClick, isActive }) => {
  return (
    <div
      onClick={onClick}
      className={`${
        isActive
          ? "bg-primary-light/10 text-primary mx-0 px-10 font-bold "
          : "mx-10 px-4 border-b-gray-veryLight border-b-[1px] "
      } text-base text-gray-dark font-normal py-5 cursor-pointer flex`}
    >
      <span
        className={`${
          isActive
            ? "bg-primary font-bold w-2 h-2 rounded-full mt-1.5 mx-4"
            : ""
        } translate delay-150 duration-150 `}
      ></span>
      <span className={`${isActive ? "font-bold " : ""}`}>{title}</span>
    </div>
  );
};

const LogoutIcon = () => (
  <svg
    className="w-5 h-5 mt-0.5 text-red-600"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

export default ProfileSideBare;
