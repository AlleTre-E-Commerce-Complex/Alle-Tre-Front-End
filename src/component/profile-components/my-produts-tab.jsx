import React from "react";

import routes from "../../routes";
import { Tab, Menu } from "semantic-ui-react";
import useTab from "../../hooks/use-tab";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import InProgressProducts from "./in-progress-products";
import OutOfStockProducts from "./out-of-stock-products";
import SoldOutProducts from "./SoldOutProducts";


const MyProductsTab = ({ onReload, inProgressProducts, outOfStockProducts, soldOutProducts }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const panes = [
    {
      menuItem: (
        <Menu.Item key="inProgress" className="dark:text-white font-medium">
          {selectedContent[localizationKeys.inProgress]}
          {inProgressProducts > 0 && (
            <span className="ml-2 bg-[#FDC02A]/20 text-[#FDC02A] px-2 py-0.5 rounded-full text-xs font-semibold">
              {inProgressProducts < 10 ? `0${inProgressProducts}` : inProgressProducts}
            </span>
          )}
        </Menu.Item>
      ),
      route: routes.app.profile.myProducts.inPogress,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-white dark:bg-primary-dark animate-in">
            <InProgressProducts OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="outOfStock" className="dark:text-white font-medium">
          {selectedContent[localizationKeys.outOfStock]}
          {outOfStockProducts > 0 && (
            <span className="ml-2 bg-[#FDC02A]/20 text-[#FDC02A] px-2 py-0.5 rounded-full text-xs font-semibold">
              {outOfStockProducts < 10 ? `0${outOfStockProducts}` : outOfStockProducts}
            </span>
          )}
        </Menu.Item>
      ),
      route: routes.app.profile.myProducts.outOfStock,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-white dark:bg-primary-dark animate-in">
            <OutOfStockProducts OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
    {
      menuItem: (
        <Menu.Item key="soldOut" className="dark:text-white font-medium">
          {selectedContent[localizationKeys.soldOut]}
          {soldOutProducts > 0 && (
            <span className="ml-2 bg-[#FDC02A]/20 text-[#FDC02A] px-2 py-0.5 rounded-full text-xs font-semibold">
              {soldOutProducts < 10 ? `0${soldOutProducts}` : soldOutProducts}
            </span>
          )}
        </Menu.Item>
      ),
      route: routes.app.profile.myProducts.soldOut,
      render: () => (
        <div>
          <Tab.Pane className="border-none w-full h-full bg-white dark:bg-primary-dark animate-in">
            <SoldOutProducts OnReload={onReload} />
          </Tab.Pane>
        </div>
      ),
    },
  ];
  const { activeIndex, onTabChange } = useTab({ panes });

  return (
    <div className="">
      <div className="h-auto edit-For-my-auctions-tabs animate-in ">
        <Tab
          menu={{
            secondary: true,
            pointing: true,
            className: "flex overflow-x-scroll scrollbar-hide border-b border-gray-200 dark:border-gray-800",
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

