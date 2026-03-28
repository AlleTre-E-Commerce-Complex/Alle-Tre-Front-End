import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import userProfileicon from "../../../src/assets/icons/user-Profile-icon.png";
import { MdLogout } from "react-icons/md";
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
import LogoutModal from "../shared/logout-modal/logout-modal";

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
      authAxios
        .get(api.app.profile.default)
        .then((res) => {
          setPofileData(res?.data?.data);
        })
        .catch((error) => {
          console.log("ProfileSideBare error", error);
        }),
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
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const onLogout = () => {
    logout();
    history.push(routes.app.home);
    socket.close();
  };

  const ProfileData = useSelector((state) => state.profileData.PofileData);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed w-[250px] bg-white dark:bg-primary-dark h-[calc(100vh-14rem)] rounded-xl shadow-sm border border-primary-veryLight dark:border-gray-800/60 overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center gap-x-4 p-6 border-b border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-[#111A2E]">
          <div className="shrink-0 relative">
            <img
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
              src={
                ProfileData?.img || pofileData?.imageLink
                  ? ProfileData?.img || pofileData?.imageLink
                  : userProfileicon
              }
              alt="userProfileicon"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-primary rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate pb-0.5">
              {ProfileData?.name || pofileData?.userName}
            </h1>
            <p className="text-xs text-green-600 font-medium">
              {selectedContent[localizationKeys.online]}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-1 ">
          <NavLink
            title={selectedContent[localizationKeys.profile]}
            isActive={pathname.startsWith(routes.app.profile.profileSettings)}
            onClick={() => history.push(routes.app.profile.profileSettings)}
          />
          {/* <NavLink
            title={selectedContent[localizationKeys.myAuctions]}
            isActive={pathname.startsWith(
              routes.app.profile.myAuctions.default,
            )}
            onClick={() => history.push(routes.app.profile.myAuctions.default)}
          /> */}
          {/* <NavLink
            title={selectedContent[localizationKeys.myBids]}
            isActive={pathname.startsWith(routes.app.profile.myBids.default)}
            onClick={() => history.push(routes.app.profile.myBids.default)}
          /> */}
          <NavLink
            title={selectedContent[localizationKeys.myProducts]}
            isActive={pathname.startsWith(
              routes.app.profile.myProducts.default,
            )}
            onClick={() => history.push(routes.app.profile.myProducts.default)}
          />
          <NavLink
            title={selectedContent[localizationKeys.favourites]}
            isActive={pathname.startsWith(routes.app.profile.watchlist)}
            onClick={() => history.push(routes.app.profile.watchlist)}
          />
          {/* <NavLink
            title={selectedContent[localizationKeys.Purchased]}
            isActive={pathname.startsWith(routes.app.profile.purchased)}
            onClick={() => history.push(routes.app.profile.purchased)}
          /> */}
          {/* <NavLink
            title={selectedContent[localizationKeys.Wallet]}
            isActive={pathname.startsWith(routes.app.profile.wallet)}
            onClick={() => history.push(routes.app.profile.wallet)}
          /> */}
          <NavLink
            title={selectedContent[localizationKeys.notifications]}
            isActive={pathname.startsWith(routes.app.profile.notifications)}
            onClick={() => history.push(routes.app.profile.notifications)}
          />
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/60 bg-white dark:bg-primary-dark">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center justify-center gap-x-2 py-2.5 px-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
          >
            <MdLogout className="text-xl group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold tracking-wide">
              {selectedContent[localizationKeys.logout]}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="block md:hidden">
        <motion.div
          className={`fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm z-40 ${
            sid ? "pointer-events-auto" : "pointer-events-none"
          }`}
          variants={overlayVariants}
          initial="open"
          animate={sid ? "open" : "closed"}
          transition={{ duration: 0.3 }}
          onClick={() => SetSid(false)}
        />

        <motion.div
          className="fixed top-0 bottom-0 z-50 w-[280px] bg-white dark:bg-[#1A222F] flex flex-col shadow-2xl"
          variants={sidebarVariants}
          initial={lang === "en" ? "closedEn" : "closedAr"}
          animate={sid ? "open" : lang === "en" ? "closedEn" : "closedAr"}
        >
          {/* Fixed Header */}
          <div className="flex items-center gap-x-4 p-6 border-b border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-black/10">
            <div className="shrink-0 relative">
              <img
                className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                src={
                  ProfileData?.img || pofileData?.imageLink
                    ? ProfileData?.img || pofileData?.imageLink
                    : userProfileicon
                }
                alt="userProfileicon"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#1A222F] rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-gray-900 dark:text-white truncate">
                {ProfileData?.name}
              </h1>
              <p className="text-sm text-green-600 font-medium mt-0.5">
                {selectedContent[localizationKeys.online]}
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <NavLink
              title={selectedContent[localizationKeys.profileSettings]}
              isActive={pathname.startsWith(routes.app.profile.profileSettings)}
              onClick={() => {
                history.push(routes.app.profile.profileSettings);
                SetSid(false);
              }}
            />
            <NavLink
              title={selectedContent[localizationKeys.myAuctions]}
              isActive={pathname.startsWith(routes.app.profile.myAuctions.default)}
              onClick={() => {
                history.push(routes.app.profile.myAuctions.default);
                SetSid(false);
              }}
            />
            <NavLink
              title={selectedContent[localizationKeys.myBids]}
              isActive={pathname.startsWith(routes.app.profile.myBids.default)}
              onClick={() => {
                history.push(routes.app.profile.myBids.default);
                SetSid(false);
              }}
            />
            <NavLink
              title={selectedContent[localizationKeys.watchlist]}
              isActive={pathname.startsWith(routes.app.profile.watchlist)}
              onClick={() => {
                history.push(routes.app.profile.watchlist);
                SetSid(false);
              }}
            />
            <NavLink
              title={selectedContent[localizationKeys.Purchased]}
              isActive={pathname.startsWith(routes.app.profile.purchased)}
              onClick={() => {
                history.push(routes.app.profile.purchased);
                SetSid(false);
              }}
            />
            <NavLink
              title={selectedContent[localizationKeys.Wallet]}
              isActive={pathname.startsWith(routes.app.profile.wallet)}
              onClick={() => {
                history.push(routes.app.profile.wallet);
                SetSid(false);
              }}
            />
          </div>

          {/* Fixed Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800/60 bg-white dark:bg-primary-dark">
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="w-full flex items-center justify-center gap-x-2 py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
            >
              <MdLogout className="text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="text-base font-semibold tracking-wide">
                {selectedContent[localizationKeys.logout]}
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      <LogoutModal
        open={logoutModalOpen}
        setOpen={setLogoutModalOpen}
        onLogout={onLogout}
      />
    </>
  );
};

export const NavLink = ({ title, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-left ${
        isActive
          ? "bg-primary/5 dark:bg-[#D8B46C]/10 text-primary dark:text-[#D8B46C]"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A3441] hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      <span
        className={`shrink-0 w-2 h-2 rounded-full mr-4 transition-all duration-300 ${
          isActive
            ? "bg-primary dark:bg-[#D8B46C] scale-100"
            : "bg-transparent scale-0"
        }`}
      />
      <span
        className={`text-sm truncate ${isActive ? "font-black" : "font-bold"}`}
      >
        {title}
      </span>
    </button>
  );
};

export default ProfileSideBare;
