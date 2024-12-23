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
    const fetchNotifications = async () => {
      try {
        const response = await run(
          authAxios.get(`${api.app.notifications.get}`)
        );
        console.log("*****----------->", response.data);
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchNotifications();
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
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                      className={`border-b ${
                        index % 2 !== 0
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "bg-white dark:bg-gray-900"
                      } hover:bg-gray-200 dark:hover:bg-gray-700`}
                    >
                    <th scope="row" className="px-6 py-4">
                        {formatDate(data.createdAt)}
                    </th>
                    <td className="px-6 py-4">
                       <div>{data.message}</div>
                       <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0px 10px',
                          }}
                        >
                          <h1
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                            }}
                          >
                            {data.productTitle}
                          </h1>
                          <img
                            src={data.imageLink}
                            alt="Product"
                            style={{
                              width: '100%',
                              maxWidth: '100px',
                              height: 'auto',
                              borderRadius: '8px',
                              display: 'inline-block',
                            }}
                          />
                        </div>

                    </td>

                    <td className="px-6 py-4 text-right">
                        <button 
                        onClick={() => handleViewDetails(data.auctionId)}
                        className="bg-primary text-white px-4 py-2 rounded-md">
                            {selectedContent[localizationKeys.viewDetails]}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
