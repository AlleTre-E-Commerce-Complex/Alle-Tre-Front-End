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

  return (
    <div className="flex flex-col gap-y-5">
      <div className={hiddenGatogry && "hidden"}>
        <AuctionFilterCardList
          title={selectedContent[localizationKeys.categories]}
          seeAll={GatogryOptions?.length}
          name="categories"
          values={GatogryOptions?.map((CategoryName) => ({
            name: CategoryName?.text,
            value: `${CategoryName?.value}`,
          })).filter(Boolean)}
          myRef={myRef}
        />
      </div>
      <div>
        {categoryId ? (
          <div className={NotAllBranOptions?.length === 0 && "hidden"}>
            <AuctionFilterCardList
              title={selectedContent[localizationKeys.brand]}
              seeAll={NotAllBranOptions?.length}
              name="brands"
              values={NotAllBranOptions?.map((brandName) => ({
                name: brandName?.text,
                value: `${brandName?.value}`,
              })).filter(Boolean)}
              myRef={myRef}
            />
          </div>
        ) : (
          <AuctionFilterCardList
            title={selectedContent[localizationKeys.brand]}
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
      <AuctionFilterCard
        title={selectedContent[localizationKeys.sellingType]}
        seeAll={2}
        name="sellingType"
        values={[
          { name: selectedContent[localizationKeys.auction], value: "Auction" },
          { name: selectedContent[localizationKeys.buyNow], value: "Buy_Now" },
        ].filter(Boolean)}
        myRef={myRef}
      />
      <AuctionFilterCard
        title={selectedContent[localizationKeys.auctionState]}
        seeAll={2}
        name="auctionStatus"
        values={[
          {
            name: selectedContent[localizationKeys.comingSoon],
            value: "IN_SCHEDULED",
          },
          {
            name: selectedContent[localizationKeys.liveAuction],
            value: "ACTIVE",
          },
        ].filter(Boolean)}
        myRef={myRef}
      />
      <AuctionFilterCardList
        title={selectedContent[localizationKeys.location]}
        seeAll={AllCountriesOptions?.length}
        name="countries"
        values={AllCountriesOptions?.map((countryName) => ({
          name: countryName?.text,
          value: `${countryName?.value}`,
        })).filter(Boolean)}
        myRef={myRef}
      />

      <AuctionFilterCardList
        title={selectedContent[localizationKeys.condition]}
        seeAll={3}
        name="usageStatus"
        values={[
          { name: selectedContent[localizationKeys.new], value: "NEW" },
          { name: selectedContent[localizationKeys.used], value: "USED" },
          {
            name: selectedContent[localizationKeys.openBox],
            value: "OPEN_BOX",
          },
        ].filter(Boolean)}
        myRef={myRef}
      />
      <RangeInput
        title={selectedContent[localizationKeys.price]}
        myRef={myRef}
      />
    </div>
  );
};

export default FilterSections;
