import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import routes from "../../routes";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";
import { RiShareForwardFill } from "react-icons/ri";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { BsPlayCircleFill } from "react-icons/bs";

const ProductCardList = ({
  adsImg,
  title,
  price,
  city,
  country,
  id,
  createdAt,
  usageStatus,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [preloadedVideos, setPreloadedVideos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();

  const getDomain = () => {
    const { protocol, hostname, port } = window.location;
    return port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`;
  };

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

  const getTimeDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffInMs = today - createdDate;

    // Convert milliseconds to different units
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    return {
      days: diffInDays,
      weeks: diffInWeeks,
      months: diffInMonths,
    };
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

  const difference = getTimeDifference(createdAt);

  const handelGoDetails = (id) => {
    history.push(routes.app.listProduct.details(id));
  };
  return (
    <div className="flex flex-wrap gap-4 ">
      <div className="flex-1 my-2 group rounded-lg border border-gray-200 hover:border-primary shadow-md hover:shadow-lg p-2 lg:p-3 flex flex-col justify-between">
        <div className="relative group">
          <div
            className={`absolute ${
              lang === "ar" ? "left-0" : "right-0"
            }  top-0 z-30  space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >
            <div
              onClick={handleShare}
              className="border-primary border-2 border-solid bg-white/90 rounded-lg w-9 h-10 md:w-11 md:h-12 hover:bg-primary group/share transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              <RiShareForwardFill className="text-primary group-hover/share:text-white transition-all duration-300 text-lg md:text-2xl " />
            </div>
          </div>
        </div>
        <div className="flex  gap-x-4" onClick={() => handelGoDetails(id)}>
          <div className="w-[103px] min-w-[80px] md:h-[112px] h-[100px] rounded-lg relative overflow-hidden bg-gray-light ">
            <div
              className="relative w-full h-full group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isLoading && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-10">
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
                      className="w-full h-full object-cover transition-transform duration-300"
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
                          className="absolute z-[5] left-2 top-1/2 -translate-y-1/2 bg-primary/60 hover:bg-primary px-0.3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 sm:block hidden"
                        >
                          <MdNavigateBefore className="flex justify-center text-white text-sm item-center" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          className="absolute z-[5] right-2 top-1/2 -translate-y-1/2 bg-primary/60 hover:bg-primary px-0.3 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-7 sm:block hidden"
                        >
                          <MdNavigateNext className="flex justify-center text-white text-sm item-center" />
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
            <div
              onClick={() => handelGoDetails(id)}
              className="price-button-list absolute  bg-[#e04868]  text-white text-[10px] top-0 w-auto px-1  h-[24px] flex justify-center items-center "
            >
              {formatCurrency(price)}
            </div>
          </div>

          <div>
            <div className="flex items-center  gap-x-2 md:gap-x-4">
              <h1
                onClick={() => handelGoDetails(id)}
                className="text-gray-dark font-medium text-sm pt-3 mb-2 min-h-[40px] ltr:pr-4 rtl:pl-4 line-clamp-2 md:line-clamp-2"
              >
                {truncateString(title, 70)}
              </h1>
              <div
                className={`state-button px-2 mt-2 py-0.5 rounded-md text-xs font-medium text-white transition-colors ${
                  usageStatus === "NEW"
                    ? "bg-primary-light hover:bg-primary bg-opacity-70"
                    : "bg-gray-dark hover:bg-gray-verydark bg-opacity-80"
                }`}
              >
                {usageStatus?.charAt(0).toUpperCase() +
                  usageStatus?.slice(1).toLowerCase()}
              </div>
            </div>
            <div className="flex md:gap-x-10 gap-x-6 mt-4">
              <div>
                <h6 className="text-gray-med font-normal md:text-[10px] text-[8px]">
                  {selectedContent[localizationKeys.lastestPrice]}
                </h6>
                <p className="text-gray-dark font-medium md:text-[10px] text-[8px]">
                  {formatCurrency(price)}
                </p>
              </div>
              <div>
                <h6 className="text-gray-med font-normal md:text-[10px] text-[8px]">
                  {selectedContent[localizationKeys.location]}
                </h6>
                <p
                  className="text-gray-dark font-medium md:text-[11px] text-[10px] mt-1"
                  onClick={() => handelGoDetails(id)}
                >
                  {city}, {country}
                </p>
              </div>
              <div>
                <h6 className="text-gray-med font-normal md:text-[11px] text-[8px]">
                  {selectedContent[localizationKeys.listed]}
                </h6>
                <p
                  className="text-gray-dark font-medium md:text-[11px] text-[8px]"
                  onClick={() => handelGoDetails(id)}
                >
                  {difference.days > 0 && `${difference.days} days ago`}
                  {difference.days === 0 &&
                    difference.weeks > 0 &&
                    `${difference.weeks} weeks ago`}
                  {difference.weeks === 0 &&
                    difference.months > 0 &&
                    `${difference.months} months ago`}
                  {difference.days === 0 &&
                    difference.weeks === 0 &&
                    difference.months === 0 &&
                    `Today`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative my-auto flex flex-col mx-2">
          <div className="flex  justify-end">
            <button
              onClick={() => handelGoDetails(id)}
              className="border-primary border-[1px] text-primary w-full md:w-[128px] h-[32px] rounded-lg"
            >
              {selectedContent[localizationKeys.buyNow]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;
