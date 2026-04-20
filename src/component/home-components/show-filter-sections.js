import { useHistory, useLocation,useEffect } from "react-router-dom";
import { ReactComponent as ClearFilterIcon } from "../../../src/assets/icons/clear-filter-icon.svg";
import { useLanguage } from "../../context/language-context";
import useFilter from "../../hooks/use-filter";
import useGetALLBrand from "../../hooks/use-get-all-brands";
import useGetAllCountries from "../../hooks/use-get-all-countries";
import useGetAllCities from "../../hooks/use-get-all-cities";
import useGetGatogry from "../../hooks/use-get-category";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import routes from "../../routes";

const ShowFilterSections = ({ category }) => {
  const history = useHistory();
  const { search } = useLocation();

  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const { GatogryOptions } = useGetGatogry();
  const { AllBranOptions } = useGetALLBrand();
  const { AllCountriesOptions } = useGetAllCountries();

  const [countries, setcountries] = useFilter("countryId", []);
  const [cities, setcities] = useFilter("cityId", []);

  const { AllCitiesOptions } = useGetAllCities(countries[0]); // Resolving names for cities of the first selected country

  const usageStatusOptinal = [
    { name: selectedContent[localizationKeys.new], value: "NEW" },
    { name: selectedContent[localizationKeys.used], value: "USED" },
  ];

  const [categories, setcategories] = useFilter("categories", []);
  const [brands, setbrands] = useFilter("brands", []);
  const [usageStatus, setusageStatus] = useFilter("usageStatus", []);
  const [sellingType, setsellingType] = useFilter("sellingType", "");
  const [auctionStatus, setauctionStatus] = useFilter("auctionStatus", "");

  const GatogryFind = categories.map((category) =>
    GatogryOptions?.find((option) => option.value === parseInt(category))
  );
  const brandsFind = brands.map((brand) =>
    AllBranOptions?.find((option) => option.value === parseInt(brand))
  );
  const countriesFind = countries.map((cId) =>
    AllCountriesOptions?.find((option) => option.value === parseInt(cId))
  );
  const citiesFind = cities.map((cId) =>
    AllCitiesOptions?.find((option) => option.value === parseInt(cId))
  );
  const usageStatusFind = usageStatus.map((usageStatus) =>
    usageStatusOptinal?.find((option) => option.value === usageStatus)
  );

  return (
    <div className="flex">
      <div className="gap-3 max-w-2xl">
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
          name="countryId"
          values={countriesFind
            ?.map((c) => ({
              name: c?.text,
              value: `${c?.value}`,
            }))
            .filter(Boolean)}
        />
        <ArrayButtonFilter
          name="cityId"
          values={citiesFind
            ?.map((c) => ({
              name: c?.text,
              value: `${c?.value}`,
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
            name="sellingType"
            values={[{ sellingType }]}
          />
        )}
        {auctionStatus && (
          <ButtonFilter
            name="auctionStatus"
            values={[{ auctionStatus }]}
          />
        )}
      </div>

      {search.includes("categories") ||
      search.includes("brands") ||
      search.includes("brands") ||
      search.includes("countryId") ||
      search.includes("cityId") ||
      search.includes("sellingType") ||
      search.includes("auctionStatus") ||
      search.includes("usageStatus") ? (
        <button
          onClick={() => {
            history.push(routes.app.home);
          }}
          className="underline text-primary-light text-base font-normal w-24"
        >
          {selectedContent[localizationKeys.clearAll]}
        </button>
      ) : null}
    </div>
  );
};

export const ArrayButtonFilter = ({ name, values }) => {
  const removeFromArray = (arr, v) => arr.filter((a) => a !== v);
  const [filter, setFilter] = useFilter(name, []);

  return (
    <div className="flex gap-3 my-1 flex-wrap">
      {values.map((v) => (
        <div key={v.value} className="bg-orange text-gray-dark w- h-9 p-1.5 rounded-md">
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
  const [filter, setFilter] = useFilter(name, "");

  return (
    <div className="flex gap-3 my-1 flex-wrap">
      {values.map((v) => (
        <div key={v.auctionStatus || v.sellingType} className="bg-[#62143A0C] text-gray-dark w-fit h-9 p-1.5 rounded-md">
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
              const newValue = v?.auctionStatus === filter ? "" : v?.auctionStatus;
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
