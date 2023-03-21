import React from "react";

import routes from "../../routes";
import { Tab } from "semantic-ui-react";
import useTab from "../../hooks/use-tab";

import ScheduledAuctions from "./scheduled-auctions";
import ExpiredAuctions from "./expired-auctions";
import PendingAuctions from "./pending-auctions";
import ActiveAuctions from "./active-auctions";
import DraftsAuctions from "./drafts-auctions";
import SoldAuctions from "./sold-auctions";

import { useLanguage } from "../../context/language-context";

const MyAuctionsTabs = () => {
  const [lang, setLang] = useLanguage("");

  const panes = [
    {
      menuItem: "Active",
      route: routes.app.profile.myAuctions.active,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <ActiveAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Scheduled",
      route: routes.app.profile.myAuctions.scheduled,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <ScheduledAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Drafts",
      route: routes.app.profile.myAuctions.drafts,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <DraftsAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Sold",
      route: routes.app.profile.myAuctions.sold,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <SoldAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Pending",
      route: routes.app.profile.myAuctions.pending,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <PendingAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Expired",
      route: routes.app.profile.myAuctions.expired,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray  dark:bg-darkMood-backgroundBlack animate-in">
            <ExpiredAuctions />
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
            className: "flex flex-wrap",
          }}
          activeIndex={activeIndex}
          onTabChange={onTabChange}
          panes={panes}
        />
      </div>
    </div>
  );
};

export default MyAuctionsTabs;
