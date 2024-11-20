// import React, { useState } from "react";
// import useGetALLBrand from "../../hooks/use-get-all-brands";
// import useGetAllCountries from "../../hooks/use-get-all-countries";
// import useGetGatogry from "../../hooks/use-get-category";
// import AuctionFilterCard from "./auction-filter-card";
// import AuctionFilterCardList from "./auction-filter-card-list";
// import RangeInput from "./range-input";
// import useGetBrand from "../../hooks/use-get-brand";
// import { useLanguage } from "../../context/language-context";
// import content from "../../localization/content";
// import localizationKeys from "../../localization/localization-keys";

// const FilterSections = ({ myRef, Results, hiddenGatogry, categoryId }) => {
//   const [lang] = useLanguage("");
//   const selectedContent = content[lang];
//   const { GatogryOptions, loadingGatogry } = useGetGatogry();
//   const { NotAllBranOptions } = useGetBrand(categoryId);
//   const { AllBranOptions, loadingAllBranOptions } = useGetALLBrand();
//   const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();

//   return (
//     <div className="sm:flex flex-col gap-y-5 hidden ">
//       <div className={hiddenGatogry && "hidden"}>
//         <AuctionFilterCardList
//           title={selectedContent[localizationKeys.categories]}
//           seeAll={GatogryOptions?.length}
//           name="categories"
//           values={GatogryOptions?.map((CategoryName) => ({
//             name: CategoryName?.text,
//             value: `${CategoryName?.value}`,
//           })).filter(Boolean)}
//           myRef={myRef}
//         />
//       </div>
//       <div>
//         {categoryId ? (
//           <div className={NotAllBranOptions?.length === 0 && "hidden"}>
//             <AuctionFilterCardList
//               title={selectedContent[localizationKeys.brand]}
//               seeAll={NotAllBranOptions?.length}
//               name="brands"
//               values={NotAllBranOptions?.map((brandName) => ({
//                 name: brandName?.text,
//                 value: `${brandName?.value}`,
//               })).filter(Boolean)}
//               myRef={myRef}
//             />
//           </div>
//         ) : (
//           <AuctionFilterCardList
//             title={selectedContent[localizationKeys.brand]}
//             seeAll={AllBranOptions?.length}
//             name="brands"
//             values={AllBranOptions?.map((brandName) => ({
//               name: brandName?.text,
//               value: `${brandName?.value}`,
//             })).filter(Boolean)}
//             myRef={myRef}
//           />
//         )}
//       </div>
//       <AuctionFilterCard
//         title={selectedContent[localizationKeys.sellingType]}
//         seeAll={2}
//         name="sellingType"
//         values={[
//           { name: selectedContent[localizationKeys.auction], value: "Auction" },
//           { name: selectedContent[localizationKeys.buyNow], value: "Buy_Now" },
//         ].filter(Boolean)}
//         myRef={myRef}
//       />
//       <AuctionFilterCard
//         title={selectedContent[localizationKeys.auctionState]}
//         seeAll={2}
//         name="auctionStatus"
//         values={[
//           {
//             name: selectedContent[localizationKeys.comingSoon],
//             value: "IN_SCHEDULED",
//           },
//           {
//             name: selectedContent[localizationKeys.liveAuction],
//             value: "ACTIVE",
//           },
//         ].filter(Boolean)}
//         myRef={myRef}
//       />
//       <AuctionFilterCardList
//         title={selectedContent[localizationKeys.location]}
//         seeAll={AllCountriesOptions?.length}
//         name="countries"
//         values={AllCountriesOptions?.map((countryName) => ({
//           name: countryName?.text,
//           value: `${countryName?.value}`,
//         })).filter(Boolean)}
//         myRef={myRef}
//       />

//       <AuctionFilterCardList
//         title={selectedContent[localizationKeys.condition]}
//         seeAll={3}
//         name="usageStatus"
//         values={[
//           { name: selectedContent[localizationKeys.new], value: "NEW" },
//           { name: selectedContent[localizationKeys.used], value: "USED" },
//           {
//             name: selectedContent[localizationKeys.openBox],
//             value: "OPEN_BOX",
//           },
//         ].filter(Boolean)}
//         myRef={myRef}
//       />
//       <RangeInput
//         title={selectedContent[localizationKeys.price]}
//         myRef={myRef}
//       />
//     </div>
//   );
// };

// export default FilterSections;


import React, { useState } from "react";
import useGetALLBrand from "../../hooks/use-get-all-brands";
import useGetAllCountries from "../../hooks/use-get-all-countries";
import useGetGatogry from "../../hooks/use-get-category";
import AuctionFilterCard from "./auction-filter-card";
import AuctionFilterCardList from "./auction-filter-card-list";
import RangeInput from "./range-input";
import useGetBrand from "../../hooks/use-get-brand";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const FilterSections = ({ myRef, Results, hiddenGatogry, categoryId }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { NotAllBranOptions } = useGetBrand(categoryId);
  const { AllBranOptions, loadingAllBranOptions } = useGetALLBrand();
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();

  // State to manage visibility of each section
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="sm:flex flex-col gap-y-5 hidden">
      {/* Categories Section */}
      <div className={hiddenGatogry && "hidden"}>
        <div
          onClick={() => toggleSection("categories")}
          className="cursor-pointer border text-center rounded-md min-w-[200px] p-2"
        >
          <h3>{selectedContent[localizationKeys.categories]}</h3>
        </div>
        {expandedSections.categories && (
          <AuctionFilterCardList
            // title={selectedContent[localizationKeys.categories]}
            seeAll={GatogryOptions?.length}
            name="categories"
            values={GatogryOptions?.map((CategoryName) => ({
              name: CategoryName?.text,
              value: `${CategoryName?.value}`,
            })).filter(Boolean)}
            myRef={myRef}
          />
        )}
      </div>

      {/* Brands Section */}
      <div>
        <div
          onClick={() => toggleSection("brands")}
          className="cursor-pointer border text-center rounded-md min-w-[200px] p-2"
        >
          <h3>{selectedContent[localizationKeys.brand]}</h3>
        </div>
        {expandedSections.brands && (
          <>
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
          </>
        )}
      </div>

      {/* Other Sections */}
      {[
        {
          key: "sellingType",
          title: selectedContent[localizationKeys.sellingType],
          values: [
            { name: selectedContent[localizationKeys.auction], value: "Auction" },
            { name: selectedContent[localizationKeys.buyNow], value: "Buy_Now" },
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
            { name: selectedContent[localizationKeys.openBox], value: "OPEN_BOX" },
          ],
        },
      ].map(({ key, title, values }) => (
        <div key={key}>
          <div
            onClick={() => toggleSection(key)}
            className="cursor-pointer border text-center rounded-md min-w-[200px] p-2"
          >
            <h3>{title}</h3>
          </div>
          {expandedSections[key] && (
            <AuctionFilterCardList
              // title={title}
              seeAll={values?.length}
              name={key}
              values={values}
              myRef={myRef}
            />
          )}
        </div>
      ))}

      {/* Price Range Section */}
      <div>
        <div
          onClick={() => toggleSection("price")}
          className="cursor-pointer border text-center rounded-md min-w-[200px] p-2"
        >
          <h3>{selectedContent[localizationKeys.price]}</h3>
        </div>
        {expandedSections.price && (
          <RangeInput
          //  title={selectedContent[localizationKeys.price]}
            myRef={myRef} />
        )}
      </div>
    </div>
  );
};

export default FilterSections;
