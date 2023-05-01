import React, { useState } from "react";
import useGetALLBrand from "../../hooks/use-get-all-brands";
import useGetAllCountries from "../../hooks/use-get-all-countries";
import useGetGatogry from "../../hooks/use-get-category";
import AuctionFilterCard from "./auction-filter-card";
import AuctionFilterCardList from "./auction-filter-card-list";
import RangeInput from "./range-input";
import useGetBrand from "../../hooks/use-get-brand";

const FilterSections = ({ myRef, Results, hiddenGatogry, categoryId }) => {
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { NotAllBranOptions } = useGetBrand(categoryId);
  const { AllBranOptions, loadingAllBranOptions } = useGetALLBrand();
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();

  return (
    <div className="flex flex-col gap-y-5">
      <div className={hiddenGatogry && "hidden"}>
        <AuctionFilterCardList
          title={"Categories"}
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
              title={"Brand"}
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
            title={"Brand"}
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
        title={"Selling Type"}
        seeAll={2}
        name="sellingType"
        values={[
          { name: "Auction", value: "Auction" },
          { name: "Buy Now", value: "Buy_Now" },
        ].filter(Boolean)}
        myRef={myRef}
      />
      <AuctionFilterCard
        title={"Auction state"}
        seeAll={2}
        name="auctionStatus"
        values={[
          { name: "Coming soon", value: "IN_SCHEDULED" },
          { name: "Live Auction", value: "ACTIVE" },
        ].filter(Boolean)}
        myRef={myRef}
      />
      <AuctionFilterCardList
        title={"Location"}
        seeAll={AllCountriesOptions?.length}
        name="countries"
        values={AllCountriesOptions?.map((countryName) => ({
          name: countryName?.text,
          value: `${countryName?.value}`,
        })).filter(Boolean)}
        myRef={myRef}
      />
      <AuctionFilterCardList
        title={"Condition"}
        seeAll={3}
        name="usageStatus"
        values={[
          { name: "New", value: "NEW" },
          { name: "Used", value: "USED" },
          { name: "Open Box", value: "OPEN_BOX" },
        ].filter(Boolean)}
        myRef={myRef}
      />
      <RangeInput title={"Price"} myRef={myRef} />
    </div>
  );
};

export default FilterSections;
