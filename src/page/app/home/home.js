import React, { useEffect } from "react";
import ImageSlider from "../../../components/home-components/image-slider";
import { SliderData } from "../../../components/home-components/imge-data";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="mt-36 py-6 home ">
      <div className="z-20 ">
        <ImageSlider slides={SliderData} />
      </div>
      {/* <div className="bg-gray-100 h-36 "></div> */}
    </div>
  );
};

export default Home;
