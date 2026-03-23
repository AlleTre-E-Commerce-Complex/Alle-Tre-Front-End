import React, { useEffect, useState} from "react";
import { useLanguage } from "context/language-context";
import content from "localization/content";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import routes from "../../routes";
import { RiShareForwardFill } from "react-icons/ri";
import localizationKeys from "../../localization/localization-keys";
import { formatCurrency } from "utils/format-currency";
import { BsPlayCircleFill } from "react-icons/bs";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { ShareFallBack } from "component/shared/react-share/ShareFallback";

const ProductCard = ({
  adsImg,
  title,
  price,
  city,
  country,
  id,
  createdAt,
  userId,
  usageStatus,
  category,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [preloadedVideos, setPreloadedVideos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showShareFallback, setShowShareFallback] = useState(false);

  const getDomain = () => {
    const { protocol, hostname, port } = window.location;
    return port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`;
  };
  const shareUrl = `${getDomain()}/alletre/my-product/${id}/details`;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      e.stopPropagation();
      handleNext();
    } else if (distance < -50) {
      e.stopPropagation();
      handlePrevious();
    }
  };

  const handleNext = () => {
    if (!Array.isArray(adsImg) || !adsImg.length) return;
    setIsLoading(true);
    setCurrentImageIndex((currentImageIndex + 1) % adsImg.length);
  };

  const handlePrevious = () => {
    if (!Array.isArray(adsImg) || !adsImg.length) return;
    setIsLoading(true);
    setCurrentImageIndex(
      currentImageIndex === 0 ? adsImg.length - 1 : currentImageIndex - 1,
    );
  };

  const handleImageLoad = () => setIsLoading(false);

  useEffect(() => {
    if (!Array.isArray(adsImg) || adsImg.length <= 1) return;
    const preloadVideo = (index) => {
      if (index < 0 || index >= adsImg.length) return;
      const item = adsImg[index];
      if (!item?.imagePath?.match(/\.(mp4|mov|webm|avi)$/i)) return;
      if (preloadedVideos.has(item.imageLink)) return;
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = item.imageLink;
      setPreloadedVideos((prev) => new Set([...prev, item.imageLink]));
    };
    preloadVideo((currentImageIndex + 1) % adsImg.length);
    preloadVideo(
      currentImageIndex === 0 ? adsImg.length - 1 : currentImageIndex - 1,
    );
  }, [currentImageIndex, adsImg, preloadedVideos]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          // url: `https://www.alletre.com/alletre/home/${auctionId}/details`,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing post:", error);
        setShowShareFallback(true);
      }
    } else {
      setShowShareFallback(!showShareFallback);
    }
  };

  // const getTimeDifference = (createdAt) => {
  //   const createdDate = new Date(createdAt);
  //   const today = new Date();
  //   const diffInMs = today - createdDate;

  //   // Convert milliseconds to different units
  //   const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  //   const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  //   const diffInWeeks = Math.floor(diffInDays / 7);
  //   const diffInMonths = Math.floor(diffInDays / 30);
  //   const diffInYears = Math.floor(diffInDays / 365);

  //   return {
  //     hours: diffInHours,
  //     days: diffInDays,
  //     weeks: diffInWeeks,
  //     months: diffInMonths,
  //     years: diffInYears,
  //   };
  // };

  // const getTimeDisplay = (diff) => {
  //   if (diff.years > 0) {
  //     return `${diff.years} ${diff.years === 1 ? "year" : "years"} ago`;
  //   }
  //   if (diff.months > 0) {
  //     return `${diff.months} ${diff.months === 1 ? "month" : "months"} ago`;
  //   }
  //   if (diff.weeks > 0) {
  //     return `${diff.weeks} ${diff.weeks === 1 ? "week" : "weeks"} ago`;
  //   }
  //   if (diff.days > 0) {
  //     return `${diff.days} ${diff.days === 1 ? "day" : "days"} ago`;
  //   }
  //   if (diff.hours > 0) {
  //     return `${diff.hours} ${diff.hours === 1 ? "hour" : "hours"} ago`;
  //   }
  //   return "Just now";
  // };

  // const difference = getTimeDifference(createdAt);

  const handelGoDetails = (id) => {
    history.push(routes.app.listProduct.details(id));
  };

  return (
    <div className="group w-full max-w-full h-auto flex flex-col mx-auto bg-white dark:bg-[#1a2234] border border-primary-gray-veryLight dark:border-primary-light hover:border-gray-300 dark:hover:border-yellow rounded-lg overflow-hidden transition-colors duration-200 shadow-sm hover:shadow-md">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] bg-gray-light overflow-hidden shrink-0">
        {/* Badge - Top Left */}
        <div className="absolute top-2 left-2 z-10 flex gap-1.5">
          <div className="bg-[#1e2738] text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
               {category === 3 || category === 7
                ? usageStatus === "NEW"
                  ? selectedContent[localizationKeys.sell]
                  : category === 7 ? selectedContent[localizationKeys.adoption
                    
                  ] : selectedContent[localizationKeys.rent]
                : usageStatus?.charAt(0).toUpperCase() +
                  usageStatus?.slice(1).toLowerCase()}
          </div>
        </div>

        {/* Action Icons - Top Right */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
          <div className="relative">
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="transition-transform duration-200 cursor-pointer active:scale-95 drop-shadow-md"
            >
              <RiShareForwardFill className="text-white text-base drop-shadow-lg hover:text-gray-200" />
            </div>
            {showShareFallback && (
              <div
                className="absolute right-0 top-full mt-2 p-2 bg-white border border-gray-300 rounded-lg shadow-md flex gap-2 z-[100]"
                style={{ minWidth: "180px" }}
              >
                <ShareFallBack shareUrl={shareUrl} title={title} />
              </div>
            )}
          </div>
        </div>

        {/* Image Slider */}
        <div
          className="relative w-full h-full group touch-pan-y cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => handelGoDetails(id)}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {Array.isArray(adsImg) &&
          adsImg.length > 0 &&
          adsImg[currentImageIndex]?.imageLink ? (
            <>
              {adsImg[currentImageIndex].imagePath.match(
                /\.(mp4|mov|webm|avi)$/i,
              ) ? (
                <div className="relative w-full h-full group/video">
                  <video
                    key={adsImg[currentImageIndex].imageLink}
                    onClick={() => handelGoDetails(id)}
                    className="w-full h-full object-cover cursor-pointer"
                    preload="metadata"
                    playsInline
                    muted
                    onLoadedMetadata={() => setIsLoading(false)}
                    onLoadStart={() => setIsLoading(true)}
                  >
                    <source
                      src={adsImg[currentImageIndex].imageLink}
                      type="video/mp4"
                    />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/50 transition-all duration-300 cursor-pointer z-[5]">
                    <BsPlayCircleFill className="text-white text-3xl opacity-70 group-hover/video:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ) : (
                <img
                  onClick={() => handelGoDetails(id)}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                  src={adsImg[currentImageIndex].imageLink}
                  alt={`Product ${currentImageIndex + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "fallback-image-url.jpg";
                  }}
                  onLoad={handleImageLoad}
                />
              )}

              {/* Slider Controls */}
              {adsImg.length > 1 && (
                <>
                  <div className="absolute inset-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevious();
                      }}
                      className="absolute z-[5] left-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-6 flex items-center justify-center"
                    >
                      <MdNavigateBefore className="text-white text-xl" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute z-[5] right-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-6 flex items-center justify-center"
                    >
                      <MdNavigateNext className="text-white text-xl" />
                    </button>
                  </div>
                  {/* Slider Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-[5]">
                    {adsImg.map((_, index) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`h-0.5 transition-all duration-300 cursor-pointer ${
                          index === currentImageIndex
                            ? "bg-white w-3"
                            : "bg-white/50 w-1.5 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col flex-1 pt-2 px-2.5 pb-2.5">
        {/* Usage badge */}
        {/* <span className="text-yellow text-[8px] uppercase font-bold tracking-widest mb-0.5">
             {category === 3 || category === 7
                ? usageStatus === "NEW"
                  ? selectedContent[localizationKeys.sell]
                  : category === 7 ? selectedContent[localizationKeys.adoption
                    
                  ] : selectedContent[localizationKeys.rent]
                : usageStatus?.charAt(0).toUpperCase() +
                  usageStatus?.slice(1).toLowerCase()}
        </span> */}

        {/* Title */}
        <h2
          onClick={() => handelGoDetails(id)}
          className="text-xs sm:text-[13px] font-semibold text-[#1e2738] dark:text-gray-100 mb-1.5 line-clamp-2 cursor-pointer hover:text-yellow transition-colors leading-snug"
        >
          {title}
        </h2>

        {/* Meta: location */}
        <div className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500 text-[8px] font-medium mb-2 uppercase tracking-wide">
          <div className="flex items-center gap-1">
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>
              {city}, {country}
            </span>
          </div>
        </div>

        {/* Pricing & Button */}
        <div className="mt-auto flex justify-between items-end gap-1 pt-1.5 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col pb-0.5 min-w-0">
            <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
              {selectedContent[localizationKeys.price]}
            </p>
            <p className="text-xs sm:text-sm text-gray-800 dark:text-white font-bold leading-none tracking-tight truncate">
              {formatCurrency(price)}
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handelGoDetails(id);
              }}
              className="bg-[#1e2738] dark:bg-yellow hover:bg-[#2c3e50] dark:hover:bg-yellow-dark dark:text-black text-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider transition-colors duration-200"
            >
            {selectedContent[localizationKeys.viewDetails]}   
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
