import React from "react";

import { useLanguage } from "../../context/language-context";

// import ShippingPolicy from "./shipping-policy";
import ReturnPolicy from "./return-policy";
import WarrantyPolicy from "./warranty-policy";
import ItemDetails from "./item-details";
// import Feedback from "./feedback";
// import DeliveryPolicy from "./delivery-policy";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const AuctionDetailsTabs = ({
  dataTabs,
  activeIndexTab,
  setActiveIndexTab,
  isListProduct,
}) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const tabs = [
    {
      id: 0,
      label: selectedContent[localizationKeys.itemDetails],
      content: (
        <ItemDetails
          itemDetailsData={dataTabs?.product ? dataTabs?.product : dataTabs}
        />
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
    ...(!isListProduct
      ? [
          {
            id: 1,
            label: selectedContent[localizationKeys.returnPolicy],
            content: <ReturnPolicy dataTabs={dataTabs} />,
          },
          {
            id: 2,
            label: selectedContent[localizationKeys.warrantyPolicy],
            content: <WarrantyPolicy dataTabs={dataTabs} />,
          },
        ]
      : []),
    // {
    //   menuItem: `${selectedContent[localizationKeys.deliveryPolicy]}`,
    //   render: () => (
    //     <div>
    //       <Tab.Pane className="border-none w-full h-full  animate-in">
    //         <DeliveryPolicy dataTabs={dataTabs} />
    //       </Tab.Pane>
    //     </div>
    //   ),
    // },

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
    <div className="w-full">
      {/* Custom Tab Menu */}
      <div className="flex overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 md:gap-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveIndexTab(tab.id)}
              className={`relative py-4 text-[11px] md:text-sm font-bold uppercase tracking-[0.05em] transition-all duration-300 whitespace-nowrap ${
                activeIndexTab === tab.id
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {/* Active Underline */}
              {activeIndexTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary dark:bg-white animate-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        <div
          key={activeIndexTab}
          className="animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          {tabs.find((t) => t.id === activeIndexTab)?.content}
        </div>
      </div>

    </div>
  );
};

export default AuctionDetailsTabs;
