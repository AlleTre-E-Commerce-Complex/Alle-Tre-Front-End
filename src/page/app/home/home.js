import React, { useEffect } from "react";

import ImageSlider from "../../../components/home-components/image-slider";
import { SliderData } from "../../../components/home-components/imge-data";
import SliderRow from "../../../components/shared/slider-categories/slider-row";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="lg:mt-36 md:mt-32 mt-24 py-6 home  ">
      <div className="z-20 ">
        <ImageSlider slides={SliderData} />
      </div>
      <div className="mt-56 text-center">
        <h1 className="text-gray-dark text-base font-bold">
          Popular Categories
        </h1>
        <p className="text-gray-med text-base font-normal">
          Lorem ipsum dolor sit amet, consetetur<br></br> sadipscing elitr, sed
          diam nonumy eirmod
        </p>
      </div>
      <div className="mt-11 mb-80">
        <SliderRow />
      </div>
      {/* <div className="bg-gray-100 h-36 "></div> */}
    </div>
  );
};

export default Home;
