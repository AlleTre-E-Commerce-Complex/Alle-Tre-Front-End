import LodingTestAllatre from "component/shared/lotties-file/loding-test-allatre";
import { useLanguage } from "context/language-context";
import EmtyWatchlist from "../../../../src/assets/icons/empty-watch-list.svg";
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
import { FaGavel } from "react-icons/fa";
import { FiClock, FiDollarSign, FiShield, FiSliders, FiBellOff } from "react-icons/fi";
import { MdOutlineHistory } from "react-icons/md";

const getNotificationMeta = (title, message) => {
  const text = ((title || "") + " " + (message || "")).toLowerCase();
  
  if (text.includes("bid")) {
    return {
      title: "New Bid Received",
      icon: <FaGavel size={20} />,
      iconBg: "bg-yellow-100 dark:bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-500",
      actionText: "View Details",
    };
  }
  if (text.includes("end") || text.includes("soon")) {
    return {
      title: "Auction Ending Soon",
      icon: <FiClock size={20} />,
      iconBg: "bg-yellow-100 dark:bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-500",
      actionText: "Go to Auction",
    };
  }
  if (text.includes("sold") || text.includes("won") || text.includes("success")) {
    return {
      title: "Asset Successfully Sold",
      icon: <FiDollarSign size={20} />,
      iconBg: "bg-yellow-100 dark:bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-500",
      actionText: "View Receipt",
    };
  }
  if (text.includes("verif") || text.includes("authent") || text.includes("listed")) {
    return {
      title: "Asset Authenticity Verified",
      icon: <FiShield size={20} />,
      iconBg: "bg-blue-100 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      actionText: "View Report",
    };
  }
  
  return {
    title: title || "Notification",
    icon: <FaGavel size={20} />,
    iconBg: "bg-gray-200 dark:bg-gray-700",
    iconColor: "text-gray-600 dark:text-gray-300",
    actionText: "View Details",
  };
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const distanceString = formatDistanceToNow(date, { addSuffix: true });
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

  const handleViewDetails = (auctionId) => {
    history.push(routes.app.homeDetails(auctionId));
  };

  return (
    <div className="w-full min-h-screen bg-transparent p-4 rounded-xl dark:bg-primary-dark text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Dimmer className="bg-white/50 dark:bg-primary-dark shadow-none border-none" active={isLoading} inverted>
        <LodingTestAllatre />
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
              const meta = getNotificationMeta(data.productTitle, data.message);
              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-xl bg-white dark:bg-[#313C4A] hover:bg-gray-50 dark:hover:bg-[#3A4354] border border-primary-veryLight dark:border-[#3A4354]/50 shadow-sm dark:shadow-none transition duration-300 group"
                >
                  {/* Icon */}
                  <div className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${meta.iconBg} ${meta.iconColor}`}>
                    {meta.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-[#D8B46C] transition duration-300">
                        {data?.productTitle}
                      </h2>
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block sm:hidden mb-2">
                        {formatRelativeTime(data.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-2xl leading-relaxed">
                      {data.message}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => handleViewDetails(data.auctionId)}
                        className="px-4 py-2 flex items-center justify-center text-sm font-medium text-primary dark:text-yellow border border-primary/30 dark:border-[#D8B46C]/30 rounded-lg hover:bg-primary/5 dark:hover:bg-[#D8B46C]/10 transition duration-300"
                      >
                        {meta.actionText}
                      </button>
                      {/* <span className="hidden md:inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-[#3A4354]/50 text-gray-600 dark:text-gray-400">
                        ID: #{data.auctionId || "RX-2024"}
                      </span> */}
                    </div>
                  </div>

                  {/* Right side data & Image */}
                  <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:block mb-4">
                      {formatRelativeTime(data.createdAt)}
                    </span>
                    {data.imageLink && (
                      <img
                        src={data.imageLink}
                        alt="Product"
                        className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                      />
                    )}
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
