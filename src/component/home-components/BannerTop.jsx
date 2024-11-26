import React, { useState, useEffect } from "react";
import BannerTopImage1 from "../../assets/images/hero banner without button-02-1.jpg";
import BannerTopImage2 from "../../assets/images/ecommerce banner1.jpg";
import BannerTopImage3 from "../../assets/images/bannerTop-5.jpg";

const BannerTop = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("right");

  const images = [BannerTopImage1, BannerTopImage2, BannerTopImage3];
  const autoSlideInterval = 6000; // Slide every 6 seconds

  const handleSlide = (newDirection) => {
    if (animating) return;
    setDirection(newDirection);
    setAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        newDirection === "right"
          ? (prevIndex + 1) % images.length
          : (prevIndex - 1 + images.length) % images.length
      );
      setAnimating(false);
    }, 700); // Animation duration
  };

  const nextSlide = () => handleSlide("left");
  const prevSlide = () => handleSlide("right");

  useEffect(() => {
    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []); // Only runs once when the component mounts

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      handleSlide(index > currentIndex ? "right" : "left");
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative w-full mt-10 mx-auto">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-[29rem]">
        {images.map((image, index) => {
          const isActive = currentIndex === index;
          let position = isActive
            ? "translate-x-0"
            : direction === "right"
            ? "-translate-x-full"
            : "translate-x-full";

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${position} ${
                isActive ? "z-20" : "z-10"
              }`}
            >
              <img
                src={image}
                className="w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
            </div>
          );
        })}
      </div>

      {images.length > 0 && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-blue-600" : "bg-gray-400"
              }`}
              aria-current={currentIndex === index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <>
          <button
            type="button"
            className="absolute top-1/2 left-2 transform -translate-y-1/2 z-30 p-2 bg-white/50 rounded-full focus:outline-none"
            onClick={prevSlide}
          >
            <svg
              className="w-4 h-4 text-gray-800"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 14.707a1 1 0 001.414-1.414L10.414 10l3.293-3.293a1 1 0 10-1.414-1.414l-4 4a1 1 0 000 1.414l4 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            className="absolute top-1/2 right-2 transform -translate-y-1/2 z-30 p-2 bg-white/50 rounded-full focus:outline-none"
            onClick={nextSlide}
          >
            <svg
              className="w-4 h-4 text-gray-800"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414-1.414L9.586 10 6.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default BannerTop;
