import React from "react";
import ImageSlider from "../../../components/home-components/image-slider";
import { SliderData } from "../../../components/home-components/imge-data";

const Home = () => {
  return (
    <div className="mt-36 py-6 home ">
      <div className="z-20 ">
        <ImageSlider slides={SliderData} />
      </div>
    </div>
  );
};

export default Home;
