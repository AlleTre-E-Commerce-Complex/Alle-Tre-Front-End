import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as AllatreLogo } from "../../../../src/assets/logo/allatre-logo-color.svg";
import routes from "../../../routes";
import DropdownLang from "./dropdown-lang";
import NavLinkHeader from "./nav-link-header";
import { useDispatch } from "react-redux";
import { Open } from "../../../redux-store/auth-model-slice";
import { useAuthState } from "../../../context/auth-context";
import { BiMenu } from "react-icons/bi";
import { RiArrowDownSFill, RiHome2Line } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import PopupCategoriesModel from "./popup-categories-model";
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
import { IoNotifications } from "react-icons/io5";
import { authAxios } from "../../../config/axios-config";
import useAxios from "hooks/use-axios";
import { getFCMToken } from '../../../config/firebase-config';
import { getMessaging, onMessage } from 'firebase/messaging';
const Header = ({ SetSid }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState(null);
  const [serchShow, setSerchShow] = useState(false);
  const [open, setOpen] = useState(false);
  const { run } = useAxios();
  const { user } = useAuthState();
  const [name, setTitle] = useFilter("title", "");

  const [pushEnabled, setPushEnabled] = useState(false);
  // const socketUrl = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
  const { logout } = useAuthState();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);// Use ref to persist socket instance
  const socket = useSocket();

  async function getNotificationCount() {
    const response = await run(authAxios.get('/notifications/unread-count'));
    console.log("response count*************",response.data.count);
    if (response.data.success) {
      setNotificationCount(response.data.count);
    }
  }

  useEffect(() => {
    console.log('soket useEffect test')
    if (!socket) return;  // Ensure socket is available

    const handleNotification = (data) => {
      console.log("notification data *************", data);

      if (data.status === "ON_SELLING") {
        console.log("listing message");
        setNotificationCount((prev) => prev + 1);
      } else if (data.status === "ON_BIDDING" && data.userType === "FOR_SELLER" && data.usersId === user?.id) {
        console.log("seller message");
        setNotificationCount((prev) => prev + 1);
      } else if (data.status === "ON_BIDDING" && data.userType === "CURRENT_BIDDER" && data.usersId === user?.id) {
        console.log("bidder message");
        setNotificationCount((prev) => prev + 1);
      } else if (data.status === "ON_BIDDING" && data.userType === "OTHER_BIDDERS" && data.usersId.includes(String(user?.id))) {
        console.log("other bidders message");
        setNotificationCount((prev) => prev + 1);
      } else if (data.status === "ON_AUCTION_EXPIRE_WITH_ZERO_BIDDER" && data.userType === "FOR_SELLER" && data.usersId === user?.id) {
        console.log("ON_AUCTION_EXPIRE_WITH_ZERO_BIDDER");
        setNotificationCount((prev) => prev + 1);
      } else if (data.status === "ON_AUCTION_EXPIRE_WITH_BIDDER" && data.usersId === user?.id) {
        console.log("ON_AUCTION_EXPIRE_WITH_BIDDER");
        setNotificationCount((prev) => prev + 1);
      }else if(data.status === "ON_AUCTION_CANCELLED_WITH_ZERO_BIDDER" && data.usersId === user?.id){
        console.log("ON_AUCTION_CANCELLED_WITH_ZERO_BIDDER");
        setNotificationCount((prev) => prev + 1);
      }else if(data.status === "ON_AUCTION_CANCELLED_WITH_BIDDER" && data.usersId === user?.id){
        console.log("ON_AUCTION_CANCELLED_WITH_BIDDER");
        setNotificationCount((prev) => prev + 1);
      }else if(data.status === "ON_AUCTION_PURCHASE_SUCCESS" && data.usersId === user?.id){
        console.log("ON_AUCTION_PURCHASE_SUCCESS");
        setNotificationCount((prev) => prev + 1);
      }else if(data.status === "ON_PENDING_PAYMENT_OF_WINNER" && data.usersId === user?.id){
        console.log("ON_PENDING_PAYMENT_OF_WINNER");
        setNotificationCount((prev) => prev + 1);
      }else if(data.status === "ON_DELIVERY_DELAY" && data.usersId === user?.id){
        console.log("ON_DELIVERY_DELAY");
        setNotificationCount((prev) => prev + 1);
      }else if(data.status === "ON_PENDING_PAYMENT_TIME_EXPIRED" && data.usersId === user?.id){
        console.log("ON_PENDING_PAYMENT_TIME_EXPIRED");
        setNotificationCount((prev) => prev + 1);
      }else if(data.status === "ON_ITEM_SEND_FOR_DELIVERY" && data.usersId === user?.id){
        console.log("ON_ITEM_SEND_FOR_DELIVERY");
        setNotificationCount((prev) => prev + 1);
      }else if(data.status === "ON_ITEM_BUY_NOW" && data.usersId === user?.id){
        console.log("ON_ITEM_BUY_NOW");
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
  }, [socket, user?.id]); 

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
    setNotificationCount(0); // Reset count when viewing notifications
    history.push(routes.app.profile.notifications);
    const response = await run(authAxios.put('/notifications/mark-read'));
    console.log("response *************",response);
  };

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

  const dispatch = useDispatch();

  const handelMyPfofile = () => {
    if (user) {
      history.push(routes.app.profile.profileSettings);
    } else {
      dispatch(Open());
    }
  };
  const handleOnSell = () => {
    if (user) {
      const hasCompletedProfile = window.localStorage.getItem(
        "hasCompletedProfile"
      );
      console.log("isProfileComplete", hasCompletedProfile);
      if (JSON.parse(hasCompletedProfile)) {
        history.push(routes.app.createAuction.productDetails);
        dispatch(productDetails({}));
      } else {
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
    history.push(routes.app.home);
    socket.close();
    logout();
  };

  return (
    <div className=" w-full fixed top-0 z-50 bg-white/30 backdrop-blur-md  ">
      <div className="md:h-[72px] h-[60px] flex justify-between gap-x-4  max-w-[1440px] lg:mx-auto md:mx-12 px-2 md:px-0">
        <div className="my-auto hidden md:block">
          <AllatreLogo
            className="cursor-pointer hidden md:block"
            onClick={() => history.push(`${routes.app.home}?page=1&perPage=28`)}
          />
        </div>
        <div className="flex items-center space-x-4 md:hidden ">
          <BiMenu
            onClick={() => SetSid(true)}
            className="text-primary cursor-pointer"
            size={30}
          />
          <RiHome2Line
            onClick={() => {
              history.push(routes.app.home);
            }}
            className="text-primary cursor-pointer"
            size={30}
          />
          <div className="relative">
             <NavLinkHeader
                title={
                  <>
                    <IoNotifications size={20} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 font-bold bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                  </>
                }
                isActive={
                  pathname.length === 1 || pathname.startsWith(routes.app.profile.notifications)
                }
                onClick={handleNotificationClick}
              />
           </div>
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
              title={selectedContent[localizationKeys.home]}
              isActive={
                pathname.length === 1 || pathname.startsWith(routes.app.home)
              }
              onClick={() => history.push(routes.app.home)}
            />
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
              title={selectedContent[localizationKeys.Purchased]}
              isActive={
                pathname.length === 1 ||
                pathname.startsWith(routes.app.profile.purchased)
              }
              onClick={() => handelPurchased()}
            />
            <NavLinkHeader
              title={selectedContent[localizationKeys.Wallet]}
              isActive={
                pathname.length === 1 ||
                pathname.startsWith(routes.app.profile.wallet)
              }
              onClick={() => handelWallet()}
            />
            <NavLinkHeader
              title={selectedContent[localizationKeys.faqs]}
              isActive={
                pathname.length === 1 || pathname.startsWith(routes.app.faqs)
              }
              onClick={() => handelFaqs()}
            />
            <div className="relative">
              <NavLinkHeader
                title={
                  <>
                    <IoNotifications size={20} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 font-bold bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </span>
                    )}
                  </>
                }
                isActive={
                  pathname.length === 1 ||
                  pathname.startsWith(routes.app.profile.notifications)
                }
                onClick={handleNotificationClick}
              />
            </div>
            {/* <NavLinkHeader
              title={selectedContent[localizationKeys.support]}
              isActive={
                pathname.length === 1 || pathname.startsWith(routes.app.support)
              }
              onClick={() => history.push(routes.app.support)}
            /> */}
            <div className="my-auto flex items-center">
              <DropdownLang className="text-black bg-white/90 hover:bg-white px-4 py-2.5 rounded-lg transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200" />
            </div>
          </div>
          <div className="my-auto ltr:ml-16 rtl:mr-16 md:flex hidden">
            <button
              onClick={handleOnSell}
              className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[136px] h-[48px] ltr:font-serifEN rtl:font-serifAR"
            >
              {selectedContent[localizationKeys.createAuction]}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-x-2 md:hidden">
          <DropdownLang className="text-black bg-white/90 hover:bg-white px-3 py-2 rounded-lg transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200" />
          <CgProfile
            className="text-primary cursor-pointer"
            size={30}
            onClick={() => {
              handelMyPfofile();
            }}
          />
        </div>
      </div>
      <div className={` ${serchShow ? "h-[60px]" : ""} bg-white`}>
        <div className="py-[6px] flex gap-x-4 max-w-[1440px] lg:mx-auto md:mx-12 px-2 md:px-0">
          <Input
            className="w-full border border-secondary rounded-md h-[48px] edit-search-Input ltr:font-serifEN rtl:font-serifAR"
            icon="search"
            placeholder={selectedContent[localizationKeys.search]}
            onChange={(e, { value }) => {
              debounced(value);
            }}
          />
          <div className="md:block hidden">
            <button
              className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[250px] h-[48px] flex justify-center gap-x-1 py-3 text-base font-normal"
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
      />
    </div>
  );
};

export default Header;
