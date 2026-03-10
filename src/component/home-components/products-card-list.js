import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import routes from "../../routes";
import { formatCurrency } from "../../utils/format-currency";
import { RiShareForwardFill } from "react-icons/ri";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { BsPlayCircleFill } from "react-icons/bs";
import { ShareFallBack } from "component/shared/react-share/ShareFallback";

const ProductCardList = ({
  adsImg,
  title,
  price,
  city,
  country,
  id,
  createdAt,
  usageStatus,
  userId,
  category,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [preloadedVideos, setPreloadedVideos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const [showShareFallback, setShowShareFallback] = useState(false);

  const getDomain = () => {
    const { protocol, hostname, port } = window.location;
    return port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`;
  };
  const shareUrl = `${getDomain()}/alletre/my-product/${id}/details`;

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url: shareUrl });
      } catch (error) {
        setShowShareFallback(true);
      }
    } else {
      setShowShareFallback(!showShareFallback);
    }
  };

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) handleNext();
    if (touchEnd - touchStart > 75) handlePrevious();
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

  const handelGoDetails = (id) => {
    history.push(routes.app.listProduct.details(id));
  };

  return (
    <div className="w-full mb-3">
      <div className="group w-full rounded-xl border border-primary-gray-veryLight dark:border-primary-light dark:bg-[#1a2234] bg-white hover:border-gray-300 dark:hover:border-yellow shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div
          className="flex flex-row cursor-pointer"
          onClick={() => handelGoDetails(id)}
        >
          {/* --- Image Panel --- */}
          <div className="relative w-[120px] h-[120px] sm:w-[200px] sm:h-[150px] min-w-[120px] sm:min-w-[200px] shrink-0 bg-gray-light overflow-hidden">
            {/* Badge */}
            <div className="absolute top-2.5 left-2.5 z-10">
              <div className="bg-[#1e2738] text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                VERIFIED
              </div>
            </div>

            {/* Share icon */}
            <div
              className="absolute top-2.5 right-2.5 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="transition-transform active:scale-95"
                >
                  <RiShareForwardFill className="text-white text-base drop-shadow-lg hover:text-gray-200" />
                </button>
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

            {/* Image slider */}
            <div
              className="relative w-full h-full group/img"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
                        className="w-full h-full object-cover"
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
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/50 transition-all z-[5]">
                        <BsPlayCircleFill className="text-white text-3xl opacity-70 group-hover/video:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      src={adsImg[currentImageIndex].imageLink}
                      alt={`Product ${currentImageIndex + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "fallback-image-url.jpg";
                      }}
                      onLoad={handleImageLoad}
                    />
                  )}

                  {adsImg.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevious();
                        }}
                        className="absolute z-[5] left-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 opacity-0 group-hover/img:opacity-100 transition-all h-8 w-6 flex items-center justify-center"
                      >
                        <MdNavigateBefore className="text-white text-xl" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="absolute z-[5] right-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 opacity-0 group-hover/img:opacity-100 transition-all h-8 w-6 flex items-center justify-center"
                      >
                        <MdNavigateNext className="text-white text-xl" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-[5]">
                        {adsImg.map((_, index) => (
                          <div
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                            className={`h-0.5 transition-all duration-300 cursor-pointer ${index === currentImageIndex ? "bg-white w-3" : "bg-white/50 w-1.5"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : null}
            </div>
          </div>

          {/* --- Content Panel --- */}
          <div className="flex flex-col flex-1 p-2.5 sm:p-4 min-w-0 overflow-hidden">
            {/* Usage badge */}
            <span className="text-yellow text-[8px] uppercase font-bold tracking-widest mb-1.5">
              {usageStatus
                ? usageStatus === "NEW"
                  ? "NEW EDITION"
                  : usageStatus
                : "USED"}
            </span>

            {/* Title */}
            <h2
              onClick={(e) => {
                e.stopPropagation();
                handelGoDetails(id);
              }}
              className="text-[13px] sm:text-base lg:text-lg font-bold text-[#1e2738] dark:text-white mb-1.5 sm:mb-2 line-clamp-2 hover:text-yellow transition-colors cursor-pointer leading-snug"
            >
              {title}
            </h2>

            {/* Location */}
            <div className="hidden sm:flex items-center gap-1 text-gray-400 dark:text-gray-500 text-[9px] sm:text-[10px] font-medium uppercase tracking-wide mb-3">
              <svg
                width="9"
                height="9"
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

            {/* Divider + price + button */}
            <div className="border-t border-gray-100 dark:border-gray-800 mt-auto pt-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[7px] sm:text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                    {selectedContent[localizationKeys.price]}
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-yellow leading-none">
                    {formatCurrency(price)}
                  </p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handelGoDetails(id)}
                    className="bg-[#1e2738] dark:bg-yellow hover:bg-[#2c3e50] dark:hover:bg-yellow-dark text-white dark:text-black px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors duration-200"
                  >
                    {selectedContent[localizationKeys.viewDetails]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardList;
