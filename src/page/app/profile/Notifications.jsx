import LoadingTest3arbon from "component/shared/lotties-file/loading-test-3arbon";
import { useLanguage } from "context/language-context";
// import EmtyWatchlist from "../../../../src/assets/icons/empty-watch-list.svg";
import useAxios from "hooks/use-axios";
import content from "localization/content";
import localizationKeys from "localization/localization-keys";
import React, { useEffect, useState } from "react";
import { Dimmer } from "semantic-ui-react";
import { authAxios } from "config/axios-config";
import api from "api";
import routes from "routes";
import { useHistory } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { FaGavel } from "react-icons/fa";
import { FiClock, FiDollarSign, FiShield, FiBellOff, } from "react-icons/fi";
import { MdImageNotSupported } from "react-icons/md";
// import { MdOutlineHistory } from "react-icons/md";

const getLocalizedMessage = (message, title, lang, selectedContent) => {
  if (!message) return "";

  // Helper to replace {title} and {status} in templates
  const injectVars = (template, vars) => {
    let result = template;
    Object.keys(vars).forEach(key => {
      result = result.replace(`{${key}}`, vars[key]);
    });
    return result;
  };

  const statusMap = {
    "OUT_OF_STOCK": lang === "ar" ? "غير متوفر" : "OUT OF STOCK",
    "SOLD OUT": lang === "ar" ? "مباع بالكامل" : "SOLD OUT",
    "LISTING": lang === "ar" ? "جاري العرض" : "LISTING",
    "IN_PROGRESS": lang === "ar" ? "قيد التنفيذ" : "IN PROGRESS",
    "IN PROGRESS": lang === "ar" ? "قيد التنفيذ" : "IN PROGRESS",
  };

  // 1. Saved as draft
  if (message.includes("saved as a draft")) {
    return injectVars(selectedContent[localizationKeys.productSavedAsDraft], { title: title || "" });
  }
  // 2. Successfully updated
  if (message.includes("successfully updated")) {
    return injectVars(selectedContent[localizationKeys.productSuccessfullyUpdated], { title: title || "" });
  }
  // 3. Successfully listed
  if (message.includes("successfully listed")) {
    return injectVars(selectedContent[localizationKeys.productSuccessfullyListed], { title: title || "" });
  }
  // 4. Status changed
  if (message.includes("status") && message.includes("changed to")) {
    const parts = message.split("changed to ");
    const statusRaw = parts[1]?.replace(".", "").trim();
    const status = statusMap[statusRaw] || statusRaw;
    return injectVars(selectedContent[localizationKeys.statusChangedTo], { title: title || "", status });
  }

  return message;
};

const getNotificationMeta = (title, message, selectedContent) => {
  const text = ((title || "") + " " + (message || "")).toLowerCase();
  
  if (text.includes("bid")) {
    return {
      title: selectedContent[localizationKeys.newBidReceived],
      icon: <FaGavel size={20} />,
      iconBg: "bg-yellow-100 dark:bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-500",
      actionText: selectedContent[localizationKeys.viewDetails],
    };
  }
  if (text.includes("end") || text.includes("soon")) {
    return {
      title: selectedContent[localizationKeys.auctionEndingSoon],
      icon: <FiClock size={20} />,
      iconBg: "bg-yellow-100 dark:bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-500",
      actionText: selectedContent[localizationKeys.goToAuction],
    };
  }
  if (text.includes("listed") || text.includes("product") || text.includes("draft") || text.includes("status")) {
    return {
      title: selectedContent[localizationKeys.productUpdate],
      icon: <FiShield size={20} />,
      iconBg: "bg-green-100 dark:bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
      actionText: selectedContent[localizationKeys.viewProduct],
    };
  }
  
  if (text.includes("sold") || text.includes("won") || text.includes("success")) {
    return {
      title: selectedContent[localizationKeys.assetSuccessfullySold],
      icon: <FiDollarSign size={20} />,
      iconBg: "bg-yellow-100 dark:bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-500",
      actionText: selectedContent[localizationKeys.viewReceipt],
    };
  }
  if (text.includes("verif") || text.includes("authent")) {
    return {
      title: selectedContent[localizationKeys.assetAuthenticityVerified],
      icon: <FiShield size={20} />,
      iconBg: "bg-blue-100 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      actionText: selectedContent[localizationKeys.viewReport],
    };
  }
  
  return {
    title: title || selectedContent[localizationKeys.notification],
    icon: <FaGavel size={20} />,
    iconBg: "bg-gray-200 dark:bg-gray-700",
    iconColor: "text-gray-600 dark:text-gray-300",
    actionText: selectedContent[localizationKeys.viewDetails],
  };
};

const formatRelativeTime = (dateString, lang) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const distanceString = formatDistanceToNow(date, { 
      addSuffix: true,
      locale: lang === "ar" ? ar : enUS
    });
    return distanceString.toUpperCase();
  } catch (e) {
    return "";
  }
};

const Notifications = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run, isLoading } = useAxios([]);
  const [notifications, setNotifications] = useState([]);
  const history = useHistory();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let isMounted = true; 
  
    const fetchNotifications = async () => {
      try {
        const { data } = await run(authAxios.get(api.app.notifications.get));
  
        if (isMounted) {
          setNotifications(data?.data || []); 
  
          if (data?.data?.length) {
            await run(authAxios.put(api.app.notifications.markAsRead));
          }
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
  
    fetchNotifications();
  
    return () => {
      isMounted = false; 
    };
  }, [run]); 

  const handleViewDetails = (auctionId, productId) => {
    if (productId) {
      history.push(routes.app.listProduct.details(productId));
    } else if (auctionId) {
      history.push(routes.app.homeDetails(auctionId));
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent p-4 rounded-xl dark:bg-primary-dark text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Dimmer className="bg-white/50 dark:bg-primary-dark shadow-none border-none" active={isLoading} inverted>
        <LoadingTest3arbon />
      </Dimmer>

      <div className="w-full h-full pb-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700/50">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedContent[localizationKeys.notifications]}</h1>
            <p className="text-gray-500 dark:text-gray-400">{selectedContent[localizationKeys.manageYourActivityAndAlerts]}</p>
          </div>
          {/* <div className="flex items-center gap-4 mt-6 md:mt-0">
            <button className="px-4 py-2 text-sm font-medium text-primary dark:text-[#D8B46C] border border-gray-300 dark:border-[#3A4354] rounded-lg hover:bg-gray-100 dark:hover:bg-[#3A4354]/50 transition duration-300">
              Mark all as read
            </button>
            <button className="p-2 border border-gray-300 dark:border-[#3A4354] rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#3A4354]/50 transition duration-300">
              <FiSliders size={20} />
            </button>
          </div> */}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {[...notifications].reverse().map((data, index) => {
              const meta = getNotificationMeta(data.productTitle, data.message, selectedContent);
              return (
                <div
                  key={index}
                  className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-xl bg-white dark:bg-[#313C4A] hover:bg-gray-50 dark:hover:bg-[#3A4354] border border-primary-veryLight dark:border-[#3A4354]/50 shadow-sm dark:shadow-none transition duration-300 group min-h-[100px]"
                >
                  {/* Time Positioned by Language */}
                  <span className={`absolute top-4 ${lang === 'en' ? 'right-6' : 'left-6'} text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hidden sm:block`}>
                    {formatRelativeTime(data.createdAt, lang)}
                  </span>

                  {/* Icon */}
                  <div className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${meta.iconBg} ${meta.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                    {meta.icon}
                  </div>

                  {/* Main Content Area (Title + Message + Actions) */}
                  <div className="flex-grow flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full">
                    {/* Text block */}
                    <div className="flex-grow min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-[#D8B46C] transition duration-300 truncate">
                        {data?.productTitle}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {getLocalizedMessage(data.message, data.productTitle, lang, selectedContent)}
                      </p>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block sm:hidden mt-2">
                        {formatRelativeTime(data.createdAt, lang)}
                      </span>
                    </div>

                    {/* Actions block (Image + Button) */}
                    <div className="flex items-center gap-16 mr-auto md:mr-0 shrink-0 mt-2 md:mt-0">
                      {data.imageLink ? (
                        <img
                          src={data.imageLink}
                          alt="Product"
                          className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm group-hover:rotate-2 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 shadow-sm">
                          <MdImageNotSupported className="text-gray-300 dark:text-gray-600 w-8 h-8" />
                        </div>
                      )}

                      <button
                        onClick={() => handleViewDetails(data.auctionId, data.productId)}
                        className="whitespace-nowrap px-6 py-2 flex items-center justify-center text-sm font-bold text-white bg-primary dark:bg-yellow dark:text-primary-dark rounded-lg hover:opacity-90 transition duration-300 shadow-sm"
                      >
                        {meta.actionText}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* View Older Notifications Footer */}
            {/* <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700/50 flex justify-center">
              <button className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition duration-300">
                <MdOutlineHistory size={18} />
                View Older Notifications
              </button>
            </div> */}
          </div>
        ) : (
          <div className="flex justify-center items-center py-32 px-4">
            <div className="text-center bg-white dark:bg-primary-dark p-12 rounded-3xl border border-gray-100 dark:border-[#3A4354]/50 shadow-sm max-w-sm w-full mx-auto">
              <div className="w-20 h-20 bg-gray-50 dark:bg-[#3A4354]/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FiBellOff className="text-primary-light dark:text-[#D8B46C]/60 w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedContent[localizationKeys.ThereAreNoNotificationsYet] }
              </h2>
              {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                When you participate in auctions or verify assets, you'll see your alerts here.
              </p> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
