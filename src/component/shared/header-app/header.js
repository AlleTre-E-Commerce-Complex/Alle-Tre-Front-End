import React, { useEffect, useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as AllatreLogo } from "../../../../src/assets/logo/ALLETRE LOGO-03-01.svg";
import { ReactComponent as AllatreLogoIcon } from "../../../../src/assets/logo/ALLETRE LOGO-03-02.svg";
import { ReactComponent as AllatreLogoFull } from "../../../../src/assets/logo/allatre-logo-color.svg";
import routes from "../../../routes";
import DropdownLang from "./dropdown-lang";
import NavLinkHeader from "./nav-link-header";
import { useDispatch } from "react-redux";
import { Open } from "../../../redux-store/auth-model-slice";
import { useAuthState } from "../../../context/auth-context";
import { BiMenu } from "react-icons/bi";
import { RiArrowDownSFill, RiHome2Line } from "react-icons/ri";
import { FaUser, FaSearch } from "react-icons/fa";
// import PopupCategoriesModel from "./popup-categories-model";
import { Input } from "semantic-ui-react";
import useFilter from "../../../hooks/use-filter";
import { useDebouncedCallback } from "use-debounce";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { useSocket } from "../../../context/socket-context";
import LogoutModal from "../logout-modal/logout-modal";
import { productDetails } from "../../../redux-store/product-details-Slice";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import { MdOutlineNotifications } from "react-icons/md";
import { authAxios } from "../../../config/axios-config";
import useAxios from "hooks/use-axios";
import { FaPlus } from "react-icons/fa6";
import {
  DEFAULT_PAGE,
  getDefaultPerPage,
  getDefaultPaginationString,
} from "../../../constants/pagination";
import useGetGatogry from "../../../hooks/use-get-category";
// import { getFCMToken } from "../../../config/firebase-config";
// import { getMessaging, onMessage } from "firebase/messaging";
const Header = ({
  SetSid,
  setSelectedType,
  onFilterClick,
  isOpen,
  onDropdownChange,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { pathname } = useLocation();
  const { user } = useAuthState();
  const dispatch = useDispatch();
  // const socketauctionId = useSelector((state) => state.socket.auct);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchShow, setSearchShow] = useState(false);

  const [isListing, setIsListing] = useState(false);
  const [open, setOpen] = useState(false);
  const { run } = useAxios();
  const [name, setTitle] = useFilter("title", "");
  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(
    selectedContent[localizationKeys.all]
  );
  const { GatogryOptions, loadingGatogry } = useGetGatogry();

  // const [pushEnabled, setPushEnabled] = useState(false);
  // const socketUrl = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
  const { logout } = useAuthState();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const socket = useSocket();

  const [showLogo, setShowLogo] = useState(false);
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    setSelectedOption(selectedContent[localizationKeys.all]);
  }, [selectedContent, localizationKeys]);

  // Clear search input on route change or page reload
  useEffect(() => {
    setSearchValue("");
    setTitle("");
  }, [pathname]);

  // Show the AllatreLogo after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIcon(false);
      setShowLogo(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  async function getNotificationCount() {
    try {
      const response = await run(authAxios.get("/notifications/unread-count"));
      if (response.data.success) {
        setNotificationCount(response.data.count);
      }
    } catch (error) {
      console.log("unread count error :", error);
    }
  }
  const handleTypeChange = (type) => {
    switch (type) {
      case "auction":
        setSelectedOption(selectedContent[localizationKeys.viewAuction]);
        break;
      case "products":
        setSelectedOption(selectedContent[localizationKeys.viewProducts]);
        break;
      case "all":
        setSelectedOption(selectedContent[localizationKeys.viewAll]);
        break;
      default:
        break;
    }
    setSelectedType(type);
    onDropdownChange?.(false);
  };

  useEffect(() => {
    if (!socket) return;

    if (user) {
      const handleNotification = (data) => {
        if (data.status === "ON_SELLING") {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_BIDDING" &&
          data.userType === "FOR_SELLER" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_BIDDING" &&
          data.userType === "CURRENT_BIDDER" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_BIDDING" &&
          data.userType === "OTHER_BIDDERS" &&
          data.usersId.includes(String(user?.id))
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_AUCTION_EXPIRE_WITH_ZERO_BIDDER" &&
          data.userType === "FOR_SELLER" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_AUCTION_EXPIRE_WITH_BIDDER" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_AUCTION_CANCELLED_WITH_ZERO_BIDDER" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_AUCTION_CANCELLED_WITH_BIDDER" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_AUCTION_PURCHASE_SUCCESS" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_PENDING_PAYMENT_OF_WINNER" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_DELIVERY_DELAY" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_PENDING_PAYMENT_TIME_EXPIRED" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_ITEM_SEND_FOR_DELIVERY" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_ITEM_BUY_NOW" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_CONFIRM_DELIVERY" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        } else if (
          data.status === "ON_AUCTION_CANCELLED_BY_ADMIN" &&
          data.usersId === user?.id
        ) {
          setNotificationCount((prev) => prev + 1);
        }
      };

      // Register the event listener
      socket.on("notification", handleNotification);
      getNotificationCount();

      // Clean up listener on unmount
      return () => {
        socket.off("notification", handleNotification);
      };
    }
  }, [socket, user?.id]);

  const location = useLocation();
  const currentPath = location.pathname;
  // Combined notification initialization and FCM setup
  // useEffect(() => {
  //   console.log("user?.id *************", user?.id);
  //   const initializeNotifications = async () => {
  //     try {
  //       if (!user?.id) return;

  //       if ("Notification" in window && "serviceWorker" in navigator) {
  //         // Register service worker first
  //         const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  //         console.log('Service Worker registered:', registration);

  //         const permission = await Notification.requestPermission();
  //         console.log("Permission:", permission);

  //         if (permission === "granted") {
  //           // Get FCM token after service worker is registered
  //           const fcmToken = await getFCMToken();
  //           console.log("FCM Token:", fcmToken);

  //           if (fcmToken) {
  //             await run(authAxios.post('/notifications/save-token', {
  //               userId: user.id,
  //               fcmToken
  //             }));
  //             setPushEnabled(true);

  //             // Set up FCM message handling
  //             const messaging = getMessaging();
  //             onMessage(messaging, (payload) => {
  //               console.log('Foreground message received:', payload);
  //               // setNotificationCount(prev => prev + 1);
  //             });
  //           }
  //         }
  //       }

  //       // Fetch initial unread count
  //       const response = await authAxios.get('/notifications/unread-count');
  //       console.log("response count*************",response.data.count);
  //       if (response.data.success) {
  //         setNotificationCount(response.data.count);
  //       }
  //     } catch (error) {
  //       console.error('Error initializing notifications:', error);
  //     }
  //   };

  //   initializeNotifications();

  //   // Cleanup
  //   return () => {
  //     if (socket_) {
  //       socket_.off("notification");
  //     }
  //   };
  // }, [user?.id]);

  // Handle notification click
  const handleNotificationClick = async () => {
    try {
      setNotificationCount(0);
      if (user) {
        history.push(routes.app.profile.notifications);
      } else {
        dispatch(Open());
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const debounced = useDebouncedCallback((value) => {
    setTitle(value);
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", DEFAULT_PAGE);
    queryParams.set("perPage", getDefaultPerPage());
    queryParams.set("title", value);
    
    const currentPathname = window.location.pathname;
    const targetPath = currentPathname.includes("/alletre/categories") 
      ? `${currentPathname}` // Keep the current category path
      : routes.app.home;
    
    history.push(`${targetPath}?${queryParams.toString()}`);
    window.scrollTo({
      behavior: "smooth",
      top: 600,
    });
  }, 500);

  const handelMyPfofile = () => {
    if (user) {
      history.push(routes.app.profile.profileSettings);
    } else {
      dispatch(Open());
    }
  };
  const handleOnSell = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem("auctionId");
    dispatch(productDetails({ auctionId: null }));

    if (user) {
      const hasCompletedProfile = window.localStorage.getItem(
        "hasCompletedProfile"
      );

      if (JSON.parse(hasCompletedProfile)) {
        history.push(routes.app.createAuction.productDetails);
        // dispatch(productDetails({}))
      } else {
        setOpen(true);
      }
    } else {
      dispatch(Open());
    }
  };
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsDropdownOpen(false); // Close dropdown
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleListProduct = () => {
    setIsDropdownOpen(false);
    if (user) {
      const hasCompletedProfile = window.localStorage.getItem(
        "hasCompletedProfile"
      );
      if (JSON.parse(hasCompletedProfile)) {
        history.push(routes.app.listProduct.default);
        // dispatch(productDetails({}));
      } else {
        setIsListing(true);
        setOpen(true);
      }
    } else {
      dispatch(Open());
    }
  };

  const handelRegister = () => {
    if (user) {
      history.push(routes.app.profile.profileSettings);
    } else dispatch(Open());
  };
  const handelHome = () => {
    history.push(`${routes.app.home}?${getDefaultPaginationString()}`);
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
  const handelmyProducts = () => {
    if (user) {
      history.push(routes.app.profile.myProducts.default);
    } else dispatch(Open());
  };
  const handelWatchlist = () => {
    if (user) {
      history.push(routes.app.profile.watchlist);
    } else dispatch(Open());
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

  const handelFaqs = () => {
    if (user) {
      history.push(routes.app.faqs);
    } else dispatch(Open());
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);

    socket.close();
    logout();
  };

  const dropdownRef = useRef(null);
  const sellDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onDropdownChange?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleSellDropdownClickOutside = (event) => {
      if (
        sellDropdownRef.current &&
        !sellDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleSellDropdownClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleSellDropdownClickOutside);
    };
  }, []);

  const handleTypeDropdownClick = (e) => {
    e.preventDefault();
    onDropdownChange?.(!isOpen);
  };

  useEffect(() => {
    const handleTypeDropdownClickOutside = (event) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target)
      ) {
        onDropdownChange?.(false);
      }
    };

    document.addEventListener("mousedown", handleTypeDropdownClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleTypeDropdownClickOutside);
    };
  }, []);

  // Handle scroll blocking when dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="w-full fixed top-0 z-50 bg-white/90 backdrop-blur-md">
      <div
        className={`md:h-[72px] h-[60px] flex justify-between gap-x-2 w-full ${lang === "en" ? "pr-3" : "pl-3"
          } md:px-4 lg:px-5`}
      >
        <div className="my-auto hidden md:block">
          <AllatreLogoFull
            className="cursor-pointer hidden md:block"
            onClick={() =>
              history.push(`${routes.app.home}?${getDefaultPaginationString()}`)
            }
          />
        </div>
        <div></div>
        <div className="flex items-center space-x-3 md:hidden">
          <BiMenu
            onClick={() => SetSid(true)}
            className="text-primary cursor-pointer"
            size={30}
          />

          <RiHome2Line
            onClick={() => {
              history.push(
                `${routes.app.home}?${getDefaultPaginationString()}`
              );
            }}
            className="text-primary cursor-pointer"
            size={25}
          />
        </div>
        <div className="flex items-center justify-center flex-1 md:flex-none">
          <div className="flex justify-center items-center">
            {showIcon && (
              <AllatreLogoIcon className="cursor-pointer w-[35px] block md:hidden text-primary" />
            )}
            {showLogo && (
              <AllatreLogo
                style={{
                  opacity: showLogo ? 1 : 0,
                  transition: "opacity 0.5s ease-in-out",
                }}
                className="cursor-pointer w-[100px] block md:hidden text-primary"
                onClick={() =>
                  history.push(
                    `${routes.app.home}?${getDefaultPaginationString()}`
                  )
                }
              />
            )}
          </div>
          <div className="md:flex hidden lg:gap-x-12 gap-x-8 my-auto justify-center items-center">
            {[
              {
                key: localizationKeys.home,
                path: routes.app.home,
                handler: handelHome,
              },
              {
                key: localizationKeys.myAuctions,
                path: routes.app.profile.myAuctions.default,
                handler: handelmyAuctions,
              },
              {
                key: localizationKeys.myBids,
                path: routes.app.profile.myBids.default,
                handler: handelmyBids,
              },
              {
                key: localizationKeys.myProducts,
                path: routes.app.profile.myProducts.default,
                handler: handelmyProducts,
              },
              {
                key: localizationKeys.watchlist,
                path: routes.app.profile.watchlist,
                handler: handelWatchlist,
              },
              {
                key: localizationKeys.Purchased,
                path: routes.app.profile.purchased,
                handler: handelPurchased,
              },
              {
                key: localizationKeys.Wallet,
                path: routes.app.profile.wallet,
                handler: handelWallet,
              },
              {
                key: localizationKeys.faqs,
                path: routes.app.faqs,
                handler: handelFaqs,
              },
            ].map(({ key, path, handler }) => (
              <NavLinkHeader
                key={key}
                title={selectedContent[key]}
                isActive={pathname.length === 1 || pathname.startsWith(path)}
                onClick={handler || (() => history.push(path))}
              />
            ))}
            <div className="relative">
              <NavLinkHeader
                title={
                  <div className="flex items-center relative">
                    {selectedContent[localizationKeys.notifications]}
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-3 font-bold bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-bounce">
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </span>
                    )}
                  </div>
                }
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.notifications)
                }
                onClick={handleNotificationClick}
              />
            </div>
            <div className="my-auto ">
              <DropdownLang className="Edit_Lang_Dropdown text-black bg-white/90 hover:bg-white px-4 py-2.5 rounded-lg transition-all duration-300 border border-gray-300 shadow-sm hover:shadow-md hover:border-gray-600 w-[120px] h-[48px] flex items-center justify-center " />
            </div>
            <div
              className="relative inline-block text-left"
              ref={sellDropdownRef}
            >
              <div>
                <button
                  type="button"
                  className={` w-[120px] h-[48px] hidden sm:inline-flex bg-primary hover:bg-primary-dark text-white font-bold rounded-lg px-4 transition-all duration-200 ease-in-out shadow-md transform hover:scale-105 ${lang === "ar" ? "-mr-7" : "-ml-7"
                    } ltr:font-serifEN rtl:font-serifAR items-center justify-center`}
                  id="menu-button"
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                  aria-haspopup="true"
                  onClick={toggleDropdown}
                >
                  <FaPlus className="mr-1 ml-1 text-md" />
                  {selectedContent[localizationKeys.sell]}
                </button>
              </div>

              {isDropdownOpen && (
                <div
                  className={`absolute  ${lang === "ar" ? "left-0 -translate-x-7" : "right-0"
                    } z-10 mt-1 w-56 origin-top-${lang === "ar" ? "left" : "right"
                    } rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none transform transition-all duration-200 ease-in-out opacity-100`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                >
                  <div
                    className=" bg-white border rounded-lg shadow-lg py-2"
                    role="none"
                  >
                    <div className="my-auto space-y-3 px-4 py-2">
                      <button
                        onClick={handleOnSell}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-medium rounded-lg h-[48px] transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        {selectedContent[localizationKeys.createAuction]}
                      </button>
                      <button
                        onClick={handleListProduct}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-medium rounded-lg h-[48px] transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        {selectedContent[localizationKeys.listProduct]}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center  md:hidden">
          <div className="flex items-center gap-x-3">
            <NavLinkHeader
              title={
                <div className="relative">
                  <MdOutlineNotifications
                    size={25}
                    className="text-primary cursor-pointer"
                    style={{ marginTop: "4px" }}
                  />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 font-medium bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center border-2 border-white ">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </div>
              }
              isActive={
                pathname.length === 1 ||
                pathname.startsWith(routes.app.profile.notifications)
              }
              onClick={handleNotificationClick}
            />
            <CgProfile
              className="text-primary cursor-pointer"
              size={25}
              onClick={() => {
                handelMyPfofile();
              }}
            />
          </div>
        </div>
      </div>
      <div className={` ${searchShow ? "h-[60px]" : ""} bg-white`}>
        <div className="pb-[6px] flex gap-x-1 xs:gap-x-2 md:gap-x-6 sm:gap-x-4 w-full px-4 xs:px-4 md:px-4 lg:px-5">
          {currentPath.includes("/alletre/categories") && (
            <button
              onClick={onFilterClick}
              className="md:hidden text-primary rounded-full flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 xs:h-6 xs:w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </button>
          )}
          <div className="relative flex-1 min-w-[120px] sm:w-[40%] md:w-[50%]">
            <Input
              className="flex-1 border border-secondary rounded-md h-[48px] edit-search-Input 
               ltr:font-serifEN rtl:font-serifAR 
               w-full pr-10"
              placeholder={selectedContent[localizationKeys.search]}
              value={searchValue}
              onChange={(e, { value }) => setSearchValue(value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchValue.trim()) {
                  debounced(searchValue);
                }
              }}
            />
            <button
              onClick={() => {
                if (searchValue.trim()) {
                  debounced(searchValue);
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaSearch className="cursor-pointer text-primary hover:text-primary-dark" size={18} />
            </button>
          </div>

          {currentPath.includes("/alletre/categories") && (
            <div className="relative" ref={typeDropdownRef}>
              <button
                className="bg-primary hover:bg-primary-dark text-white rounded-lg 
             w-[90px] h-[48px] sm:w-[110px] sm:h-[48px] md:w-[160px] xs:h-[48px]
             flex items-center justify-between px-4 py-2 text-md font-medium 
             transition-all duration-300 shadow-md"
                onClick={handleTypeDropdownClick}
              >
                <span className="flex-1 text-center ">{selectedOption}</span>

                <span
                  className={`transform transition-transform duration-300 ${isOpen ? "rotate-[180deg]" : "rotate-[360deg]"
                    }`}
                >
                  <RiArrowDownSFill size={20} />
                </span>
              </button>

              {isOpen && (
                <div className="absolute left-0 mt-2 w-40 sm:w-42 md:w-48 bg-white border rounded-lg shadow-lg z-50">
                  <ul className="py-2">
                    <li>
                      <button
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-veryLight ${selectedOption ===
                          selectedContent[localizationKeys.viewAuction]
                          ? "bg-gray-med"
                          : ""
                          }`}
                        onClick={() => handleTypeChange("auction")}
                      >
                        {selectedContent[localizationKeys.viewAuction]}
                      </button>
                    </li>
                    <li>
                      <button
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-veryLight ${selectedOption ===
                          selectedContent[localizationKeys.viewProducts]
                          ? "bg-gray-med"
                          : ""
                          }`}
                        onClick={() => handleTypeChange("products")}
                      >
                        {selectedContent[localizationKeys.viewProducts]}
                      </button>
                    </li>
                    <li>
                      <button
                        className={`block w-full text-left px-4 py-2 hover:bg-gray-veryLight ${selectedOption ===
                          selectedContent[localizationKeys.viewAll]
                          ? "bg-gray-med"
                          : ""
                          }`}
                        onClick={() => handleTypeChange("all")}
                      >
                        {selectedContent[localizationKeys.viewAll]}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {currentPath === routes.app.home && (
            <div className="relative" ref={typeDropdownRef}>
              <button
                className="bg-primary hover:bg-primary-dark text-white rounded-lg 
             w-[90px] h-[48px] sm:w-[110px] sm:h-[48px] md:w-[160px] xs:h-[48px]
             flex items-center justify-between px-4 py-2 text-md font-medium 
             transition-all duration-300 shadow-md"
                onClick={handleTypeDropdownClick}
              >
                <span className="flex-1 text-center text-sm sm:text-base">
                  {selectedContent[localizationKeys.categories]}
                </span>

                <span
                  className={`transform transition-transform duration-300 ${isOpen ? "rotate-[180deg]" : "rotate-[360deg]"
                    }`}
                >
                  <RiArrowDownSFill size={20} />
                </span>
              </button>

              {isOpen && (
                <div
                  className={`absolute ${lang === "ar" ? "-right-44" : "-left-44"
                    } mt-2 w-[240px] xs:w-[280px] sm:w-[320px] bg-white/90 backdrop-blur-md border rounded-lg shadow-lg z-50 p-2 xs:p-3 transition-all duration-300 ease-out origin-top ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                >
                  <div className="grid grid-cols-2 gap-2 xs:gap-3 max-h-[calc(3*84px+62px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                    {GatogryOptions?.map((e, index) => (
                      <div
                        key={index}
                        className="relative h-20 xs:h-24 sm:h-28 cursor-pointer group overflow-hidden rounded-lg"
                        onClick={() => {
                          if (user) {
                            history.push(
                              `${routes.app.categories(
                                e.text,
                                e.value
                              )}?categories[]=${e.value}`
                            );
                          } else {
                            dispatch(Open());
                          }
                          onDropdownChange?.(false);
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 group-hover:from-black/30 group-hover:to-black/70 transition-all duration-500 z-10"></div>
                        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-lg transition-all duration-500 z-20"></div>
                        <img
                          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-all duration-500 ease-out"
                          src={e?.sliderLink}
                          alt={e.text}
                          loading="lazy"
                        />
                        <div className="absolute inset-x-1 xs:inset-x-2 bottom-1 xs:bottom-2 p-1 xs:p-1.5 backdrop-blur-sm bg-black/30 rounded-md transform group-hover:translate-y-0 transition-all duration-500 z-30">
                          <p className="text-white font-bold text-xs xs:text-sm sm:text-base text-center group-hover:scale-105 transition-transform duration-300">
                            {e.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DropdownLang className="text-black md:hidden bg-white/90 hover:bg-white px-3 py-2 rounded-lg transition-all duration-300 border border-gray-300 shadow-sm hover:shadow-md hover:border-gray-600" />

          {/* <PopupCategoriesModel
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onClose={handleClose}
          /> */}
          <div className="md:flex hidden gap-x-4">
            {user ? (
              <>
                <button
                  onClick={handelRegister}
                  className="w-[120px] h-[48px] border-[1px] border-secondary text-secondary rounded-lg flex justify-center gap-x-1 py-3 text-base font-normal"
                >
                  <FaUser size={15} className="mt-1" />
                  <p className="pt-1">
                    {selectedContent[localizationKeys.profile]}
                  </p>
                </button>
                <div
                  onClick={() => setLogoutModalOpen(true)}
                  className="group w-[120px] h-[48px] border-[1px] border-primary text-red-600 hover:bg-primary hover:text-white rounded-lg flex items-center justify-center gap-x-1 py-3 text-base font-normal transition-all duration-300 cursor-pointer"
                >
                  <MdLogout className="text-xl" />
                  <span> {selectedContent[localizationKeys.logout]}</span>
                </div>
                <LogoutModal
                  open={logoutModalOpen}
                  setOpen={setLogoutModalOpen}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <button
                onClick={handelRegister}
                className="w-[120px] h-[48px] border-[1px] border-secondary text-secondary rounded-lg flex justify-center gap-x-1 py-3 text-base font-normal"
              >
                <FaUser size={15} className="mt-1" />
                <p className="pt-1">
                  {selectedContent[localizationKeys.loginOrRegister]}
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
      <AddLocationModel
        open={open}
        setOpen={setOpen}
        TextButton={selectedContent[localizationKeys.proceed]}
        isListing={isListing}
        setIsListing={setIsListing}
      />
    </div>
  );
};

export default Header;
