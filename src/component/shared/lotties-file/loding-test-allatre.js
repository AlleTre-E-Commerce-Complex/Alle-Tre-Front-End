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

    // Fallback: Re-enable scrolling after a delay (e.g., 5 seconds)
    const fallbackTimer = setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 4000);

    return () => {
      clearTimeout(fallbackTimer); // Clear the fallback timer
      document.body.style.overflow = "auto"; // Ensure scrolling is re-enabled
    };
  }, [isLoading]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 cursor-wait">
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
