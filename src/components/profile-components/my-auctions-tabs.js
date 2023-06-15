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
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import WatingForPaymentAuctions from "./wating-for-payment-auctions";

const MyAuctionsTabs = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const panes = [
    {
      menuItem: `${selectedContent[localizationKeys.active]}`,
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
      menuItem: `${selectedContent[localizationKeys.Scheduled]}`,
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
      menuItem: `${selectedContent[localizationKeys.drafts]}`,
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
      menuItem: `${selectedContent[localizationKeys.sold]}`,
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
      menuItem: `${selectedContent[localizationKeys.pending]}`,
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
      menuItem: `wating for payment`,
      route: routes.app.profile.myAuctions.watingForPayment,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray  dark:bg-darkMood-backgroundBlack animate-in">
            <WatingForPaymentAuctions />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.expired]}`,
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

export default MyAuctionsTabs;
