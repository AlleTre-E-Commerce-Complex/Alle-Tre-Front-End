import routes from "../../../routes";
import { useState, useEffect } from "react";

import { ReactComponent as CloseIcon } from "../../../../src/assets/icons/x_icon.svg";
import { ReactComponent as AllatreLogo } from "../../../../src/assets/logo/3arbon-main.svg";

import { ReactComponent as Allatre } from "../../../../src/assets/logo/allatre-logo-color.svg";
// import DropdownLang from "../header-app/dropdown-lang";
import { useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "../../../context/auth-context";
import { Open } from "../../../redux-store/auth-model-slice";
import { useDispatch } from "react-redux";
import "../header-app/nav-link-header.css";
import { motion } from "framer-motion";
import { useLanguage } from "../../../context/language-context";
import { toast } from "react-hot-toast";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { useSocket } from "context/socket-context";
import { MdLogout } from "react-icons/md";
import LogoutModal from "../logout-modal/logout-modal";

const Sidebar = ({ SetSid, sid }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

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

  const { user } = useAuthState();
  const dispatch = useDispatch();
  const handelOnSell = () => {
    if (user) {
      history.push(routes.app.createAuction.productDetails);
    } else {
      dispatch(Open());
      toast.error("You must log in first to add new auction");
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
  const handelPurchased = () => {
    if (user) {
      history.push(routes.app.profile.purchased);
    } else dispatch(Open());
  };
  const handelWallet = () => {
    if (user) {
      history.push(routes.app.profile.wallet);
    } else dispatch(Open());
  };
  const handelFaq = () => {
    if (user) {
      history.push(routes.app.faqs);
    } else dispatch(Open());
  };

  const { logout } = useAuthState();

  const socket = useSocket();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const onLogout = async () => {
    setLogoutModalOpen(false);
    history.push(routes.app.home);
    socket.close();
    await logout();
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
  const handleMyProducts = () => {
    if (user) {
      history.push(routes.app.profile.myProducts.default);
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
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[70] ${
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
        className={`fixed top-0 w-60 h-full bg-primary z-[70] shadow-lg`}
        variants={sidebarVariants}
        initial={lang === "en" ? "closedEn" : "closedAr"}
        animate={sid ? "open" : lang === "en" ? "closedEn" : "closedAr"}
      >
        {/* Sidebar content */}
        <div className="w-full mx-auto h-screen flex flex-col justify-between ">
          <div className="flex justify-between pt-5">
            <AllatreLogo
              onClick={() => {
                history.push(routes.app.home);
                SetSid(false);
              }}
              className="w-28 mx-4"
            />
            <CloseIcon
              onClick={() => SetSid(false)}
              className="mx-4 mt-2 cursor-pointer"
            />
          </div>
          <div className="flex-grow overflow-y-auto">
            <div className="flex flex-col gap-y-4  px-6 mt-10 w-full">
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
              {/* <NavLink
                title={selectedContent[localizationKeys.myAuctions]}
                isActive={
                  pathname.startsWith(routes.app.profile.myAuctions.default)
                }
                onClick={() => {
                  handelmyAuctions();
                  SetSid(false);
                }}
              /> */}
              {/* <NavLink
                title={selectedContent[localizationKeys.myBids]}
                isActive={
                  pathname.startsWith(routes.app.profile.myBids.default)
                }
                onClick={() => {
                  handelmyBids();
                  SetSid(false);
                }}
              /> */}
              <NavLink
                title={selectedContent[localizationKeys.myProducts]}
                isActive={
                  pathname.startsWith(routes.app.profile.myProducts.default)
                }
                onClick={() => {
                  handleMyProducts();
                  SetSid(false);
                }}
              />
              {/* <NavLink
                title={selectedContent[localizationKeys.createAuction]}
                isActive={
                  pathname.startsWith(routes.app.createAuction.productDetails)
                }
                onClick={() => {
                  handelOnSell();
                  SetSid(false);
                }}
              /> */}
              <NavLink
                title={selectedContent[localizationKeys.favourites]}
                isActive={
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
                  pathname.startsWith(routes.app.profile.purchased)
                }
                onClick={() => {
                  handelPurchased();
                  SetSid(false);
                }}
              />
              {/* <NavLink
                title={selectedContent[localizationKeys.Wallet]}
                isActive={
                  pathname.startsWith(routes.app.profile.wallet)
                }
                onClick={() => {
                  handelWallet();
                  SetSid(false);
                }}
              /> */}
              <NavLink
                title={selectedContent[localizationKeys.faqs]}
                isActive={pathname.startsWith(routes.app.faqs)}
                onClick={() => {
                  handelFaq();
                  SetSid(false);
                }}
              />

              {/* <NavLink
                title={selectedContent[localizationKeys.support]}
                isActive={
                  pathname.startsWith(routes.app.support)
                }
                onClick={() => {
                  history.push(routes.app.support);
                  SetSid(false);
                }}
              /> */}
              {/* Only show logout button if user is logged in */}
              {user && (
                <>
                  <div
                    onClick={() => setLogoutModalOpen(true)}
                    className="flex justify-start items-center gap-x-1 mt-12 mb-6 cursor-pointer mx-10"
                  >
                    <MdLogout className="text-xl text-red-600" />
                    <p className="text-red-600 text-sm font-normal underline">
                      {selectedContent[localizationKeys.logout]}
                    </p>
                  </div>
                  <LogoutModal
                    open={logoutModalOpen}
                    setOpen={setLogoutModalOpen}
                    onLogout={onLogout}
                  />
                </>
              )}
              {/* <div className="mt-10 mb-5">
                <DropdownLang className={"text-white "} />
              </div> */}
            </div>
          </div>

          {/* Bottom Pinned Items */}
          <div className="w-full px-6 pb-6 pt-4 border-t border-gray-600">
            <div className="h-12 flex items-center justify-start gap-x-4">
              <span className="text-white text-base py-1 hover-underline-animation cursor-pointer">
                {selectedContent[localizationKeys.darkMode]}
              </span>
              <button
                onClick={toggleTheme}
                className={`relative w-[64px] h-8 rounded-full border flex items-center transition-colors duration-300 focus:outline-none shadow-inner ${
                  isDarkMode
                    ? "bg-primary-dark border-gray-600"
                    : "bg-primary-light border-primary-dark"
                }`}
              >
                <div className="absolute left-2 flex items-center justify-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="absolute right-2 flex items-center justify-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </div>
                <div
                  className={`absolute w-6 h-6 rounded-full bg-[#d4af37] shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                    !isDarkMode
                      ? "ltr:translate-x-1 rtl:-translate-x-1 translate-x-1"
                      : "ltr:translate-x-[34px] rtl:-translate-x-[34px] translate-x-[34px]"
                  }`}
                >
                  {!isDarkMode ? (
                    <svg
                      className="w-3 h-3 text-primary-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3 h-3 text-primary-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export const NavLink = ({ title, onClick, isActive }) => {
  return (
    <div onClick={onClick} className={`w-full cursor-pointer h-12`}>
      <div
        className={`${
          isActive ? "active-underline-animation" : "hover-underline-animation"
        } text-base text-white font-normal py-1`}
      >
        {title}
      </div>
    </div>
  );
};

export default Sidebar;
