import React from "react";

import routes from "../../routes";
import { Tab } from "semantic-ui-react";
import useTab from "../../hooks/use-tab";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import InProgressProducts from "./in-progress-products";
import OutOfStockProducts from "./out-of-stock-products";
import SoldOutProducts from "./SoldOutProducts";


const MyProductsTab = ({ onReload }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const panes = [
    {
      menuItem: `${selectedContent[localizationKeys.inProgress]}`,
      route: routes.app.profile.myProducts.inPogress,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <InProgressProducts OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.outOfStock]}`,
      route: routes.app.profile.myProducts.outOfStock,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <OutOfStockProducts OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: `${selectedContent[localizationKeys.soldOut]}`,
      route: routes.app.profile.myProducts.soldOut,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-backgroundGray dark:bg-darkMood-backgroundBlack animate-in">
            <SoldOutProducts OnReload={onReload} />
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

export default MyProductsTab;
