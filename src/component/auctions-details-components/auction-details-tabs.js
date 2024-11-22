import React from "react";

import { Tab } from "semantic-ui-react";

import { useLanguage } from "../../context/language-context";

// import ShippingPolicy from "./shipping-policy";
import ReturnPolicy from "./return-policy";
import WarrantyPolicy from "./warranty-policy";
import ItemDetails from "./item-details";
// import Feedback from "./feedback";
import DeliveryPolicy from "./delivery-policy";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const AuctionDetailsTabs = ({
  dataTabs,
  activeIndexTab,
  setActiveIndexTab,
}) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const panes = [
    {
      menuItem: `${selectedContent[localizationKeys.itemDetails]}`,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full animate-in">
            <ItemDetails itemDetailsData={dataTabs?.product} />
          </Tab.Pane>
        </div>
      ),
    },
    // {
    //   menuItem: `${selectedContent[localizationKeys.shippingPolicy]}`,
    //   render: () => (
    //     <div>
    //       <Tab.Pane className="border-none w-full h-full  animate-in">
    //         <ShippingPolicy />
    //       </Tab.Pane>
    //     </div>
    //   ),
    // },
    {
      menuItem: `${selectedContent[localizationKeys.returnPolicy]}`,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full  animate-in">
            <ReturnPolicy dataTabs={dataTabs} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.warrantyPolicy]}`,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full  animate-in">
            <WarrantyPolicy dataTabs={dataTabs} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.deliveryPolicy]}`,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full  animate-in">
            <DeliveryPolicy dataTabs={dataTabs} />
          </Tab.Pane>
        </div>
      ),
    },

    // {
    //   menuItem: `${selectedContent[localizationKeys.feedback]}`,
    //   render: () => (
    //     <div>
    //       <Tab.Pane className="border-none w-full h-full  animate-in">
    //         <Feedback />
    //       </Tab.Pane>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="">
      <div className="h-auto edit-For-my-auctions-tabs animate-in  ">
        <Tab
          menu={{
            secondary: true,
            pointing: true,
            className: "flex overflow-x-scroll scrollbar-hide ",
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
