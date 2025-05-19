import React, { useEffect, useState, memo } from "react";
import { useLanguage } from "context/language-context";
import content from "localization/content";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { truncateString } from "utils/truncate-string";
import routes from "../../routes";
// import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import localizationKeys from "../../localization/localization-keys";
import { formatCurrency } from "utils/format-currency";
import { useAuthState } from "context/auth-context";
import { BsPlayCircleFill } from "react-icons/bs";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

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
  const { user } = useAuthState();
  // const { run, isLoading } = useAxios([]);
  // const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [preloadedVideos, setPreloadedVideos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const getDomain = () => {
    const { protocol, hostname, port } = window.location;
    return port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`;
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNext();
    }
    if (touchEnd - touchStart > 75) {
      handlePrevious();
    }
  };

  const handleNext = () => {
    if (!Array.isArray(adsImg) || !adsImg.length) return;
    setIsLoading(true);
    const nextIndex = (currentImageIndex + 1) % adsImg.length;
    setCurrentImageIndex(nextIndex);
  };

  const handlePrevious = () => {
    if (!Array.isArray(adsImg) || !adsImg.length) return;
    setIsLoading(true);
    const prevIndex =
      currentImageIndex === 0 ? adsImg.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

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

    const nextIndex = (currentImageIndex + 1) % adsImg.length;
    preloadVideo(nextIndex);

    const prevIndex =
      currentImageIndex === 0 ? adsImg.length - 1 : currentImageIndex - 1;
    preloadVideo(prevIndex);
  }, [currentImageIndex, adsImg, preloadedVideos]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          // url: `https://www.alletre.com/alletre/home/${auctionId}/details`,
          url: `${getDomain()}/alletre/my-product/${id}/details`,
        });
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
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
    <div>
      <div className="group w-full max-w-[240px] h-[400px] rounded-lg bg-white border border-gray-100 hover:border-primary hover:border-opacity-20 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden p-1 sm:p-2">
        <div className="relative  w-full h-[70%] bg-primary-veryLight">
          <div className="absolute right-2 top-2 z-30 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="bg-white shadow-md rounded-full w-8 h-8 hover:bg-primary group/share transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              <RiShareForwardFill className="text-primary group-hover/share:text-white transition-all duration-300 text-lg" />
            </div>
          </div>

          <div
            className="relative w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => handelGoDetails(id)}
          >
            {isLoading && (
              <div className="absolute inset-0 rflex flex-col justify-center items-center bg-black bg-opacity-50 z-10">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {Array.isArray(adsImg) &&
            adsImg.length > 0 &&
            adsImg[currentImageIndex]?.imageLink ? (
              <>
                {adsImg[currentImageIndex].imagePath.match(
                  /\.(mp4|mov|webm|avi)$/i
                ) ? (
                  <div className="relative w-full h-full group/video rounded-lg">
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
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handelGoDetails(id);
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/50 transition-all duration-300 cursor-pointer z-[5]"
                    >
                      <BsPlayCircleFill
                        onClick={(e) => {
                          e.stopPropagation();
                          handelGoDetails(id);
                        }}
                        className="text-white text-4xl opacity-70 group-hover/video:opacity-100 transition-opacity duration-300 cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    onClick={() => handelGoDetails(id)}
                    className="w-full h-full  rounded-lg object-cover transition-transform duration-300"
                    src={adsImg[currentImageIndex].imageLink}
                    alt={`Product ${currentImageIndex + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "fallback-image-url.jpg"; // You can add a fallback image URL here
                    }}
                    onLoad={handleImageLoad}
                  />
                )}

                {adsImg.length > 1 && (
                  <>
                    <div className="absolute inset-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevious();
                        }}
                        className="absolute z-[5] left-2 top-1/2 -translate-y-1/2 bg-primary/60 hover:bg-primary px-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 sm:block hidden"
                      >
                        <MdNavigateBefore className="flex justify-center text-white text-md item-center" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="absolute z-[5] right-2 top-1/2 -translate-y-1/2 bg-primary/60 hover:bg-primary px-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 sm:block hidden"
                      >
                        <MdNavigateNext className="flex justify-center text-white text-md item-center" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {adsImg.map((_, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            index === currentImageIndex
                              ? "bg-primary w-3"
                              : "bg-white/80 hover:bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : null}
          </div>
          <div className="absolute top-0 left-0 z-20 bg-gradient-to-r from-primary to-primary-light px-2 sm:px-3 py-1.5 sm:py-2 rounded-md shadow-sm backdrop-blur-sm bg-opacity-75">
            <span className="text-white font-medium text-xs sm:text-sm flex items-center">
              <span className="text-white/80 text-[10px] sm:text-xs mr-1">
                AED
              </span>
              {formatCurrency(price).replace("AED", "")}
            </span>
          </div>
        </div>
        <div className="flex flex-col h-[30%] p-3 justify-between">
          <div className="space-y-2">
            <h1
              onClick={() => handelGoDetails(id)}
              className="text-gray-800 font-medium text-base leading-tight line-clamp-2 hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              {truncateString(title, 100)}
            </h1>

            <div className="flex items-center gap-2">
              <div
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  usageStatus === "NEW"
                    ? "bg-primary-veryLight text-primary"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
               {category === 3 || category === 7
                ? usageStatus === "NEW"
                  ? selectedContent[localizationKeys.sell]
                  : category === 7 ? selectedContent[localizationKeys.adoption
                    
                  ] : selectedContent[localizationKeys.rent]
                : usageStatus?.charAt(0).toUpperCase() +
                  usageStatus?.slice(1).toLowerCase()}
              </div>
            </div>
          </div>

          <div className="mt-auto">
            {/* {user?.id === userId ? (
              <button
                onClick={() => handelGoDetails(id)}
                className="bg-primary-veryLight text-primary hover:bg-primary hover:text-white rounded-lg w-full py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1"
              >
                {selectedContent[localizationKeys.viewDetails]}
              </button>
            ) : (
              <button
                onClick={() => handelGoDetails(id)}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-full py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 shadow-sm"
              >
                {selectedContent[localizationKeys.buyNow]}
              </button>
            )} */}
            <button
              onClick={() => handelGoDetails(id)}
              className="bg-primary hover:bg-primary-dark text-white rounded-lg w-full py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 shadow-sm"
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
