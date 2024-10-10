import React from "react";

import routes from "../../routes";
import { Tab } from "semantic-ui-react";
import useTab from "../../hooks/use-tab";

import WatingForDeliveryBids from "./wating-for-delivery-bids";
import InProgressBids from "./in-progress-bids";
import CompletedBids from "./completed-bids";
import PendingBids from "./pending-bids";
import ExpiredBids from "./expired-bids";

import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import CancelledBids from "./CancelledBids";

const MyBidsTabs = ({ onReload }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const panes = [
    {
      menuItem: `${selectedContent[localizationKeys.inProgress]}`,
      route: routes.app.profile.myBids.inPogress,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <InProgressBids OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.pending]}`,
      route: routes.app.profile.myBids.pending,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <PendingBids OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.waitingForDelivery]}`,
      route: routes.app.profile.myBids.waitingForDelivery,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <WatingForDeliveryBids OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.expired]}`,
      route: routes.app.profile.myBids.expired,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <ExpiredBids OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.completed]}`,
      route: routes.app.profile.myBids.completed,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <CompletedBids OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.cancelled]}`,
      route: routes.app.profile.myBids.cancelled,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <CancelledBids OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
  ];
  const { activeIndex, onTabChange } = useTab({ panes });

  return (
    <div className="">
      <div className="h-auto edit-For-my-auctions-tabs  animate-in ">
        <Tab
          menu={{
            secondary: true,
            pointing: true,
            className: "flex overflow-x-scroll scrollbar-hide",
          }}
          activeIndex={activeIndex}
          onTabChange={onTabChange}
          panes={panes}
        />
      </div>
    </div>
  );
};

export default MyBidsTabs;
