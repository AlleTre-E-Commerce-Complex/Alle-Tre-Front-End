import React from "react";
import Category from "./Category";
import useGetGatogry from "../../../hooks/use-get-category";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
// import { useLanguage } from "../../../context/language-context";
// import content from "../../../localization/content";
// import localizationKeys from "../../../localization/localization-keys";

const SliderRow = ({ categoryCounts = {} }) => {
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  // const [lang] = useLanguage();
  // const selectedContent = content[lang]
  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={loadingGatogry}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="container mx-auto mt-20 px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-11 gap-4 sm:gap-6 md:gap-16 lg:gap-20">
            {GatogryOptions?.map((e, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
                  index % 2 === 0
                    ? "col-span-1 md:col-start-2 md:col-end-6"
                    : "col-span-1 md:col-start-7 md:col-end-11"
                }`}
              >
                <Category
                  img={e?.sliderLink}
                  title={e?.text}
                  id={e?.value}
                  className=""
                  auctionCount={categoryCounts[e?.value]?.auctions || 0}
                  listingCount={categoryCounts[e?.value]?.listings || 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SliderRow;
