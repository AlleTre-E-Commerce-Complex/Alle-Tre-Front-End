import React, { useState } from "react";
import useGetALLBrand from "../../hooks/use-get-all-brands";
import useGetAllCountries from "../../hooks/use-get-all-countries";
import useGetGatogry from "../../hooks/use-get-category";
import AuctionFilterCardList from "./auction-filter-card-list";
import RangeInput from "./range-input";
import useGetBrand from "../../hooks/use-get-brand";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const FilterSections = ({ myRef, hiddenGatogry, categoryId }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { GatogryOptions } = useGetGatogry();
  const { NotAllBranOptions } = useGetBrand(categoryId);
  const { AllBranOptions } = useGetALLBrand();
  const { AllCountriesOptions } = useGetAllCountries();

  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="hidden lg:block flex flex-col gap-6 p-4 rounded-lg shadow-md max-w-full mx-auto w-full lg:max-w-xs">
      {/* <h2 className="text-2xl font-bold text-center text-gray-700">
        Filter Options
      </h2> */}

      {/* Categories Section */}
      {!hiddenGatogry && (
        <div className="mb-4">
          <div
            onClick={() => toggleSection("categories")}
            className="cursor-pointer bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            <h3 className="font-medium">
              {selectedContent[localizationKeys.categories]}
            </h3>
          </div>
          {expandedSections.categories && (
            <div className="mt-2 p-4  rounded-lg">
              <AuctionFilterCardList
                seeAll={GatogryOptions?.length}
                name="categories"
                values={GatogryOptions?.map((CategoryName) => ({
                  name: CategoryName?.text,
                  value: `${CategoryName?.value}`,
                })).filter(Boolean)}
                myRef={myRef}
              />
            </div>
          )}
        </div>
      )}

      {/* Brands Section */}
      <div className="mb-4">
        <div
          onClick={() => toggleSection("brands")}
          className="cursor-pointer bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          <h3 className="font-medium">
            {selectedContent[localizationKeys.brand]}
          </h3>
        </div>
        {expandedSections.brands && (
          <div className="mt-2 p-4 rounded-lg">
            {categoryId ? (
              NotAllBranOptions?.length > 0 && (
                <AuctionFilterCardList
                  // title={selectedContent[localizationKeys.brand]}
                  seeAll={NotAllBranOptions?.length}
                  name="brands"
                  values={NotAllBranOptions?.map((brandName) => ({
                    name: brandName?.text,
                    value: `${brandName?.value}`,
                  })).filter(Boolean)}
                  myRef={myRef}
                />
              )
            ) : (
              <AuctionFilterCardList
                // title={selectedContent[localizationKeys.brand]}
                seeAll={AllBranOptions?.length}
                name="brands"
                values={AllBranOptions?.map((brandName) => ({
                  name: brandName?.text,
                  value: `${brandName?.value}`,
                })).filter(Boolean)}
                myRef={myRef}
              />
            )}
          </div>
        )}
      </div>

      {/* Other Sections */}
      {[
        {
          key: "sellingType",
          title: selectedContent[localizationKeys.sellingType],
          values: [
            {
              name: selectedContent[localizationKeys.auction],
              value: "Auction",
            },
            {
              name: selectedContent[localizationKeys.buyNow],
              value: "Buy_Now",
            },
          ],
        },
        {
          key: "auctionState",
          title: selectedContent[localizationKeys.auctionState],
          values: [
            {
              name: selectedContent[localizationKeys.comingSoon],
              value: "IN_SCHEDULED",
            },
            {
              name: selectedContent[localizationKeys.liveAuction],
              value: "ACTIVE",
            },
          ],
        },
        {
          key: "location",
          title: selectedContent[localizationKeys.location],
          values: AllCountriesOptions?.map((countryName) => ({
            name: countryName?.text,
            value: `${countryName?.value}`,
          })).filter(Boolean),
        },
        {
          key: "condition",
          title: selectedContent[localizationKeys.condition],
          values: [
            { name: selectedContent[localizationKeys.new], value: "NEW" },
            { name: selectedContent[localizationKeys.used], value: "USED" },
            {
              name: selectedContent[localizationKeys.openBox],
              value: "OPEN_BOX",
            },
          ],
        },
      ].map(({ key, title, values }) => (
        <div key={key} className="mb-4">
          <div
            onClick={() => toggleSection(key)}
            className="cursor-pointer bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition"
          >
            <h3 className="font-medium">{title}</h3>
          </div>
          {expandedSections[key] && (
            <div className="mt-2 p-4  rounded-lg">
              <AuctionFilterCardList
                seeAll={values?.length}
                name={key}
                values={values}
                myRef={myRef}
              />
            </div>
          )}
        </div>
      ))}

      {/* Price Range Section */}
      <div>
        <div
          onClick={() => toggleSection("price")}
          className="cursor-pointer bg-white p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          <h3 className="font-medium">
            {selectedContent[localizationKeys.price]}
          </h3>
        </div>
        {expandedSections.price && (
          <div className="mt-2 rounded-lg  max-w-full overflow-hidden">
            <RangeInput className="" myRef={myRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSections;
