import React, { useEffect, useState } from "react";
import { ReactComponent as LoaderB } from "../../../../src/assets/logo/loaderB.svg";

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
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 dark:bg-[#09090b]/70 backdrop-blur-xl cursor-wait z-[9999]">
      <div className="relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64">
        
        {/* Soft Core Ambient Glow behind the spheres */}
        <div className="absolute inset-0 m-auto w-32 h-32 bg-[#d4af37] rounded-full blur-[50px] opacity-40 animate-[pulse_4s_ease-in-out_infinite]"></div>

        {/* Elegant Concentric Spinners */}
        
        {/* Outer Ring */}
        {/* <div className="absolute inset-2 sm:inset-4 rounded-full border-[1.5px] border-t-[#d4af37] border-r-transparent border-b-[#d4af37]/20 border-l-transparent animate-[spin_5s_linear_infinite]"></div> */}
        
        {/* Middle Ring */}
        <div className="absolute inset-6 sm:inset-8 rounded-full border-[1.5px] border-t-transparent border-r-[#d4af37]/80 border-b-transparent border-l-[#d4af37]/40 animate-[spin_3s_linear_infinite_reverse]"></div>
        
        {/* Inner Ring */}
        <div className="absolute inset-10 sm:inset-12 rounded-full border-[1.5px] border-t-[#d4af37]/60 border-r-transparent border-b-[#d4af37] border-l-transparent animate-[spin_4s_linear_infinite]"></div>

        {/* Foreground letter: "B" - Perfectly Centered with calculated visual offset */}
        {/* The SVG has baked-in empty space because it is extracted from '3arbon'. Visual center revolves at 51% rather than 50% */}
        <div className="absolute top-1/2 left-1/2 -translate-x-[51%] -translate-y-1/2 flex items-center justify-center w-60 sm:w-[200px]  z-20 pointer-events-none">
          <LoaderB className="w-full h-auto drop-shadow-[0_0_25px_rgba(212,175,55,0.6)] animate-loader-b-elegant" />
        </div>

      </div>
    </div>
  );
};

export default LodingTestAllatre;
