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
    let isMounted = true; // Prevents state updates if component unmounts
  
    const fetchNotifications = async () => {
      try {
        // Fetch notifications
        const { data } = await run(authAxios.get(api.app.notifications.get));
  
        if (isMounted) {
          setNotifications(data?.data || []); // Ensure data consistency
  
          // Mark notifications as read only if there are notifications
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
      isMounted = false; // Cleanup function to prevent memory leaks
    };
  }, [run]); 
  

  const handleViewDetails = (auctionId) => {
    history.push(routes.app.homeDetails(auctionId));
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Set to false for 24-hour format
    };
    return new Date(dateString).toLocaleString(undefined, options); // Changed to toLocaleString
  };
  console.log("dddddd", formatTime);
  return (
    <div>
      <Dimmer className=" bg-white/50" active={isLoading} inverted>
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>

      {notifications.length > 0 ? (
        <div className="p-4">
          <div className="transactions">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 hidden sm:table">
                <thead className="text-xs uppercase bg-primary text-white dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      {selectedContent[localizationKeys.Message]}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {selectedContent[localizationKeys.Date]}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      {selectedContent[localizationKeys.viewDetails]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...notifications].reverse().map((data, index) => (
                    <tr
                      key={index}
                      className={`border-b transition duration-300 ease-in-out ${
                        index % 2 !== 0
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "bg-white dark:bg-gray-900"
                      } hover:bg-gray-200 dark:hover:bg-gray-700`}
                    >
                      <td className="px-16 py-4">
                        <h1 className="text-lg font-bold">
                          {data.productTitle}
                        </h1>
                        <div className="flex items-center justify-between p-2 gap-4">
                          <div className="text-lg">{data.message}</div>
                          <img
                            src={data.imageLink}
                            alt="ProductImage"
                            className="w-24 h-auto rounded-lg hidden sm:block"
                          />
                        </div>
                      </td>
                      <td className="text-gray-600 space-y-2">
                        <div className="text-lg">
                          {formatTime(data.createdAt)}
                        </div>
                        <div className="inline text-sm text-gray-500">
                          {formatDate(data.createdAt)}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button
                          onClick={() => handleViewDetails(data.auctionId)}
                          className="bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2 rounded-md transition duration-300"
                        >
                          {selectedContent[localizationKeys.viewDetails]}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mobile Cards */}
              <div className="sm:hidden">
                {[...notifications].reverse().map((data, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg mb-4 p-4 ${
                      index % 2 !== 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <h1 className="text-lg font-bold flex items-center">
                      {data.productTitle}
                    </h1>
                    <p className="text-gray-500 text-md mb-2">{data.message}</p>
                    <img
                      src={data.imageLink}
                      alt="ProductImage"
                      className="w-16 sm:w-24 h-auto rounded-lg mb-4"
                    />
                    <div className="flex justify-between text-sm">
                      <div className="text-gray-600">
                        <div>{formatTime(data.createdAt)}</div>
                        <div className="text-gray-500">
                          {formatDate(data.createdAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(data.auctionId)}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition"
                      >
                        {selectedContent[localizationKeys.viewDetails]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center pt-56 ">
          <div>
            <img
              className="w-28 mx-auto"
              src={EmtyWatchlist}
              alt="EmtyWatchlist"
            />
            <h1 className="text-gray-dark pt-10">
              {selectedContent[localizationKeys.ThereAreNoNotificationsYet]}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
