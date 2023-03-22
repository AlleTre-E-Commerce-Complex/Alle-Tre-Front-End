import React from "react";

import { Tab } from "semantic-ui-react";

import { useLanguage } from "../../context/language-context";

import ShippingPolicy from "./shipping-policy";
import ReturnPolicy from "./return-policy";
import ItemDetails from "./item-details";
import Feedback from "./feedback";
import Payment from "./payment";

const AuctionDetailsTabs = ({
  dataTabs,
  activeIndexTab,
  setActiveIndexTab,
}) => {
  const [lang, setLang] = useLanguage("");

  const panes = [
    {
      menuItem: "Item Details",
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full animate-in">
            <ItemDetails itemDetailsData={dataTabs?.product} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Shipping Policy",
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full  animate-in">
            <ShippingPolicy />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Return Policy",
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full  animate-in">
            <ReturnPolicy />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Payment",
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full  animate-in">
            <Payment />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: "Feedback",
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full  animate-in">
            <Feedback />
          </Tab.Pane>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <div className="h-auto edit-For-my-auctions-tabs  animate-in ">
        <Tab
          menu={{
            secondary: true,
            pointing: true,
            className: "flex flex-wrap",
          }}
          activeIndex={activeIndexTab}
          onTabChange={(e, { activeIndex }) => setActiveIndexTab(activeIndex)}
          panes={panes}
        />
      </div>
    </div>
  );
};

export default AuctionDetailsTabs;
