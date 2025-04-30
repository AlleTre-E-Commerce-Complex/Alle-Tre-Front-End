import React from "react";
import Category from "./Category";
import useGetGatogry from "../../../hooks/use-get-category";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
// import { useLanguage } from "../../../context/language-context";
// import content from "../../../localization/content";
// import localizationKeys from "../../../localization/localization-keys";

const SliderRow = () => {
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
          <div className="grid grid-cols-11 gap-6 sm:gap-12 md:gap-16 lg:gap-20">
            {GatogryOptions?.map((e, index) => (
              <div
                key={index}
                className={`${
                  index % 2 === 0
                    ? "col-start-2 col-end-6"
                    : "col-start-7 col-end-11"
                } group bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1`}
              >
                <Category
                  img={e?.sliderLink}
                  title={e?.text}
                  id={e?.value}
                  className=""
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
