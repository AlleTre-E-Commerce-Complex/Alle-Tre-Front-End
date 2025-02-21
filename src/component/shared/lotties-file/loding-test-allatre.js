import React, { useEffect, useState } from "react";
import loadingTest from "../../../../src/assets/images/lodingIcon.gif";

const LodingTestAllatre = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 1000);

    return () => {
      clearTimeout(fallbackTimer);
      document.body.style.overflow = "auto";
    };
  }, [isLoading]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 cursor-wait">
      <img
        src={loadingTest}
        alt="loading"
        className="cursor-wait"
        style={{ width: "550px", height: "auto" }}
      />
    </div>
  );
};

export default LodingTestAllatre;
