import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import useGetGatogry from "../../hooks/use-get-category";
import useGetALLBrand from "../../hooks/use-get-all-brands";
import useGetAllCountries from "../../hooks/use-get-all-countries";
import useFilter from "../../hooks/use-filter";
import localizationKeys from "../../localization/localization-keys";

import { ReactComponent as ClearFilterIcon } from "../../../src/assets/icons/clear-filter-icon.svg";
import routes from "../../routes";
import { useHistory, useLocation } from "react-router-dom";

const ShowFilterSections = () => {
  const history = useHistory();
  const { search } = useLocation();

  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { AllBranOptions, loadingAllBranOptions } = useGetALLBrand();
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();

  const usageStatusOptinal = [
    { name: selectedContent[localizationKeys.new], value: "NEW" },
    { name: selectedContent[localizationKeys.used], value: "USED" },
    {
      name: selectedContent[localizationKeys.openBox],
      value: "OPEN_BOX",
    },
  ];

  const [categories, setcategories] = useFilter("categories", []);
  const [brands, setbrands] = useFilter("brands", []);
  const [countries, setcountries] = useFilter("countries", []);
  const [usageStatus, setusageStatus] = useFilter("usageStatus", []);

  const [sellingType, setsellingType] = useFilter("sellingType", "");
  const [auctionStatus, setauctionStatus] = useFilter("auctionStatus", "");

  const GatogryFind = categories.map((category) =>
    GatogryOptions?.find((option) => option.value === parseInt(category))
  );
  const brandsFind = brands.map((brand) =>
    AllBranOptions?.find((option) => option.value === parseInt(brand))
  );
  const countriesFind = countries.map((countries) =>
    AllCountriesOptions?.find((option) => option.value === parseInt(countries))
  );
  const usageStatusFind = usageStatus.map((usageStatus) =>
    usageStatusOptinal?.find((option) => option.value === usageStatus)
  );

  return (
    <div className="flex ">
      <div className=" gap-3 max-w-2xl">
        <ArrayButtonFilter
          name="categories"
          values={GatogryFind?.map((CategoryName) => ({
            name: CategoryName?.text,
            value: `${CategoryName?.value}`,
          })).filter(Boolean)}
        />
        <ArrayButtonFilter
          name="brands"
          values={brandsFind
            ?.map((brandsFindName) => ({
              name: brandsFindName?.text,
              value: `${brandsFindName?.value}`,
            }))
            .filter(Boolean)}
        />
        <ArrayButtonFilter
          name="countries"
          values={countriesFind
            ?.map((countriesFind) => ({
              name: countriesFind?.text,
              value: `${countriesFind?.value}`,
            }))
            .filter(Boolean)}
        />
        <ArrayButtonFilter
          name="usageStatus"
          values={usageStatusFind
            ?.map((usageStatusFind) => ({
              name: usageStatusFind?.name,
              value: `${usageStatusFind?.value}`,
            }))
            .filter(Boolean)}
        />
        {sellingType && (
          <ButtonFilter
            name={sellingType && "sellingType"}
            values={[{ sellingType }]}
          />
        )}

        {auctionStatus && (
          <ButtonFilter
            name={auctionStatus && "auctionStatus"}
            values={[{ auctionStatus }]}
          />
        )}
      </div>

      {search.includes("categories") ||
      search.includes("brands") ||
      search.includes("countries") ||
      search.includes("sellingType") ||
      search.includes("auctionStatus") ||
      search.includes("usageStatus") ? (
        <button
          onClick={() => {
            history.push(routes.app.home);
          }}
          className="underline text-primary-light text-base font-normal w-24 "
        >
          Clear All
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export const ArrayButtonFilter = ({ name, values }) => {
  const removeFromArray = (arr, v) => arr.filter((a) => a !== v);
  const [filter, setFilter] = useFilter(name, []);

  return (
    <div className="flex gap-3 my-1 flex-wrap">
      {values.map((v) => (
        <div className="bg-[#62143A0C] text-gray-dark w- h-9 p-1.5 rounded-md">
          {v?.name}
          <button
            onClick={() => {
              setFilter(
                filter.includes(v?.value)
                  ? removeFromArray(filter, v?.value)
                  : [...filter, v?.value]
              );
            }}
            className="ltr:ml-6 rtl:mr-6"
          >
            <ClearFilterIcon />
          </button>
        </div>
      ))}
    </div>
  );
};

export const ButtonFilter = ({ name, values }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [filter, setFilter] = useFilter(name, []);
  return (
    <div className="flex gap-3 my-1 flex-wrap">
      {values.map((v) => (
        <div className="bg-[#62143A0C] text-gray-dark w-fit h-9 p-1.5 rounded-md">
          {v?.auctionStatus === "IN_SCHEDULED" &&
            selectedContent[localizationKeys.comingSoon]}
          {v?.auctionStatus === "ACTIVE" &&
            selectedContent[localizationKeys.liveAuction]}
          {v?.sellingType === "Auction" &&
            selectedContent[localizationKeys.auction]}
          {v?.sellingType === "Buy_Now" &&
            selectedContent[localizationKeys.buyNow]}
          <button
            className="ltr:ml-6 rtl:mr-6"
            onClick={() => {
              const newValue =
                v?.auctionStatus === filter ? "" : v?.auctionStatus;
              setFilter(newValue);
            }}
          >
            <ClearFilterIcon />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ShowFilterSections;
