import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { RiShareForwardFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";
import { Open } from "../../../redux-store/auth-model-slice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { IoChevronUpOutline } from "react-icons/io5";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Dimmer } from "semantic-ui-react";
import LoadingTest3arbon from "../lotties-file/loading-test-3arbon";
// import watermarkImage from "../../../../src/assets/logo/WaterMarkFinal.png";
import { ShareFallBack } from "../react-share/ShareFallback";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";
// import required modules
import { Navigation, EffectFade, Thumbs } from "swiper/modules";

const ImgSlider = ({
  images,
  auctionId,
  WatshlistState,
  onReload,
  isMyAuction,
  title,
  isListProduct,
  status,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [showShareFallback, setShowShareFallback] = useState(false);
  const getDomain = () => {
    const { protocol, hostname, port } = window.location;
    return port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`;
  };
  const shareUrl = isListProduct
    ? `${getDomain()}/my-product/${auctionId}/details`
    : `${getDomain()}/home/${auctionId}/details`;
  const [isWatshlist, setWatshlist] = useState(false);
  const swiperRef = useRef(null);
  const thumbSwiperRef = useRef(null);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const isArabic = lang === "ar";
  const { user } = useAuthState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (images && images.length > 0) setSelectedImgIndex(0);
  }, [images]);

  useEffect(() => {
    setWatshlist(WatshlistState);
  }, [WatshlistState]);

  const scrollThumbnailIntoView = useCallback(
    (index, containerId = "thumbnail-container") => {
      const container = document.getElementById(containerId);
      const thumbnail = container?.children[index];
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (!images || images.length === 0) return;
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    } else {
      setSelectedImgIndex((prev) => {
        const nextIndex = (prev + 1) % images.length;
        scrollThumbnailIntoView(nextIndex, "thumbnail-container");
        return nextIndex;
      });
    }
  }, [images, scrollThumbnailIntoView]);

  const handlePrevious = useCallback(() => {
    if (!images || images.length === 0) return;
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    } else {
      setSelectedImgIndex((prev) => {
        const nextIndex = prev === 0 ? images.length - 1 : prev - 1;
        scrollThumbnailIntoView(nextIndex, "thumbnail-container");
        return nextIndex;
      });
    }
  }, [images, scrollThumbnailIntoView]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") isArabic ? handleNext() : handlePrevious();
      if (e.key === "ArrowRight") isArabic ? handlePrevious() : handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isArabic, handleNext, handlePrevious]);

  const handleThumbnailClick = (index) => {
    setSelectedImgIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
    if (thumbSwiperRef.current) {
      thumbSwiperRef.current.slideTo(index);
    }
    scrollThumbnailIntoView(index, "thumbnail-container");
  };
  const { run, isLoading } = useAxios([]);
  const handelAddNewWatshlist = () => {
    if (user) {
      const body = isListProduct
        ? { productId: auctionId }
        : { auctionId: auctionId };
      if (!isWatshlist) {
        run(
          authAxios.post(api.app.WatchList.add, body).then((res) => {
            toast.success(
              selectedContent[
                isListProduct
                  ? localizationKeys.thisProductAddToFavouritesSuccessfully
                  : localizationKeys.thisAuctionAddToWatchListBeenSuccessfully
              ],
            );
            setWatshlist(true);
            onReload?.();
          }).catch(err => {
            const responseData = err?.response?.data;
            let errorMessage = responseData?.message || err?.message || "Something went wrong";
            if (typeof errorMessage === 'object' && errorMessage !== null) {
              errorMessage = errorMessage.en || errorMessage.message || JSON.stringify(errorMessage);
            }
            toast.error(String(errorMessage));
          }),
        );
      } else {
        run(
          authAxios.delete(api.app.WatchList.delete(auctionId, isListProduct)).then((res) => {
            toast.success(
              selectedContent[
                isListProduct
                  ? localizationKeys.thisProductRemovedFromFavouritesSuccessfully
                  : localizationKeys.thisAuctionDeleteFromWatchListBeenSuccessfully
              ],
            );
            setWatshlist(false);
            onReload?.();
          }).catch(err => {
            const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong";
            toast.error(typeof errorMessage === 'object' ? errorMessage.en || "Error" : errorMessage);
          }),
        );
      }
    } else {
      dispatch(Open());
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: "Check out this auction!",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing post:", error);
        setShowShareFallback(true); // Show fallback if native share fails
      }
    } else {
      setShowShareFallback(!showShareFallback);
    }
  };
  const isVideo = (media) => {
    return media?.imagePath?.match(/\.(mp4|mov|webm|avi)$/i);
  };
  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50 dark:bg-black/50"
        active={isLoading}
        inverted
      >
        <LoadingTest3arbon />
      </Dimmer>
      <div className="group overflow-hidden relative flex flex-col md:flex-row gap-4 h-auto">
        {/* Main Image Container */}
        <div className="relative flex-grow aspect-[16/10] md:aspect-[16/9] cursor-pointer rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
          {images && images.length > 0 && (
            <div className="relative w-full h-full">
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                dir={isArabic ? "rtl" : "ltr"}
                modules={[Navigation, EffectFade, Thumbs]}
                effect={"fade"}
                fadeEffect={{ crossFade: true }}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                onSlideChange={(swiper) => {
                  const newIndex = swiper.activeIndex;
                  setSelectedImgIndex(newIndex);
                  if (thumbSwiperRef.current) {
                    thumbSwiperRef.current.slideTo(newIndex);
                  }
                  scrollThumbnailIntoView(newIndex, "thumbnail-container");
                }}
                className="w-full h-full"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      {isVideo(image) ? (
                        <div className="relative w-full h-full bg-black">
                          <video
                            key={image?.imageLink}
                            className={`w-full h-full object-contain ${isListProduct && status === "OUT_OF_STOCK" ? "blur-[2px] grayscale-[0.5]" : ""}`}
                            controls
                            controlsList="nodownload nofullscreen"
                            autoPlay
                            muted
                            playsInline
                            loop
                            preload="auto"
                          >
                            <source src={image?.imageLink} type="video/mp4" />
                          </video>
                        </div>
                      ) : (
                        <img
                          className={`w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 ${isListProduct && status === "OUT_OF_STOCK" ? "blur-[2px] grayscale-[0.5]" : ""}`}
                          src={image?.imageLink}
                          alt={image?.description || "Product image"}
                        />
                      )}
                      {/* Watermark inside slider */}
                      {/* <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <img
                          src={watermarkImage}
                          className="opacity-20 w-1/3 h-auto"
                          alt="Watermark"
                        />
                      </div> */}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* PREMIUM LISTING Badge */}
              <div className={`absolute top-4 ${isArabic ? "right-4" : "left-4"} z-30 pointer-events-none`}>
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-[10px] md:text-xs font-bold text-yellow-500 uppercase tracking-wider">
                   {selectedContent[localizationKeys.premiumListing]}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`absolute top-4 z-40 flex items-center gap-3 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 ${
                  isArabic ? "left-4 flex-row-reverse" : "right-4"
                }`}
              >
                {!isMyAuction && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handelAddNewWatshlist();
                    }}
                    className="backdrop-blur-md bg-white/20 dark:bg-black/20 hover:bg-white dark:hover:bg-black p-2 md:p-2.5 rounded-xl border border-white/30 transition-all duration-300"
                  >
                    {isWatshlist ? (
                      <AiFillHeart className="text-red-500 text-lg md:text-xl" />
                    ) : (
                      <AiOutlineHeart className="text-white text-lg md:text-xl" />
                    )}
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="backdrop-blur-md bg-white/20 dark:bg-black/20 hover:bg-white dark:hover:bg-black p-2 md:p-2.5 rounded-xl border border-white/30 transition-all duration-300"
                  >
                    <RiShareForwardFill className="text-white text-lg md:text-xl" />
                  </button>
                  {showShareFallback && (
                    <div className={`absolute ${isArabic ? "left-0 text-right" : "right-0 text-left"} top-full mt-2 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-[100] min-w-[200px]`}>
                      <ShareFallBack shareUrl={shareUrl} title={title} />
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Navigation Buttons (Visible on hover) */}
              <div
                className={`absolute top-1/2 w-full flex ${isArabic ? "justify-between flex-row-reverse" : "justify-between"} px-4 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              >
                <button className="swiper-button-prev-custom pointer-events-auto backdrop-blur-md bg-white/80 dark:bg-black/40 p-2.5 md:p-3.5 rounded-2xl shadow-2xl border border-white/40 dark:border-white/10 hover:bg-white dark:hover:bg-primary-dark transition-all duration-300 group/navprev disabled:opacity-30">
                  <HiChevronLeft className="text-primary dark:text-yellow text-xl md:text-2xl transition-transform group-hover/navprev:scale-125" />
                </button>
                <button className="swiper-button-next-custom pointer-events-auto backdrop-blur-md bg-white/80 dark:bg-black/40 p-2.5 md:p-3.5 rounded-2xl shadow-2xl border border-white/40 dark:border-white/10 hover:bg-white dark:hover:bg-primary-dark transition-all duration-300 group/navnext disabled:opacity-30">
                  <HiChevronRight className="text-primary dark:text-yellow text-xl md:text-2xl transition-transform group-hover/navnext:scale-125" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop-only: Thumbnails on the Right (Full Scrollable Strip) */}
        <div className="hidden md:flex flex-col gap-4 w-[120px] lg:w-[150px] flex-shrink-0 lg:max-h-[600px] md:max-h-[450px] relative group/thumb">
          <div
            id="thumbnail-container"
            className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden scrollbar-hide flex-grow select-none p-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images?.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-2xl cursor-pointer overflow-hidden border-2 flex-shrink-0 transition-all duration-300 
                  ${
                    index === selectedImgIndex
                      ? "border-primary-light ring-2 ring-primary-light/20 scale-[0.98] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                onClick={() => handleThumbnailClick(index)}
              >
                {isVideo(image) ? (
                  <video
                    src={image.imageLink}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={image.imageLink}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {index === selectedImgIndex && (
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-primary-light shadow-sm" />
                )}
              </div>
            ))}
          </div>

          {/* Main Discovery Overlay (Desktop) - Persistent until Hover */}
          {images?.length > 3 && (
            <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 transition-all duration-500 rounded-2xl opacity-100 group-hover/thumb:opacity-0 group-hover/thumb:invisible">
              <div className="mt-auto mb-8 flex flex-col items-center">
                <div className="flex flex-col items-center animate-bounce mb-2">
                  <IoChevronUpOutline className="text-white text-3xl opacity-40" />
                  <IoChevronUpOutline className="text-white text-3xl -mt-4 opacity-70" />
                  <IoChevronUpOutline className="text-white text-3xl -mt-4" />
                </div>
                <p className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] mb-2 drop-shadow-sm">
                 {selectedContent[localizationKeys.scrollToViewMore]}
                </p>
                <div className="group/btn relative">
                  <div className="absolute inset-0 bg-primary-light/10 blur-xl rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl px-4 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-2xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-light animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
                    <span className="text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wider opacity-90">
                       {selectedContent[localizationKeys.viewAll]} {images.length} {selectedContent[localizationKeys.pictures]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-only: Thumbnail Layout (Swiper Slider) */}
      <div className="mt-4 md:hidden">
        <Swiper
          onSwiper={(swiper) => {
            thumbSwiperRef.current = swiper;
          }}
          dir={isArabic ? "rtl" : "ltr"}
          slidesPerView={4.2}
          spaceBetween={12}
          className="w-full"
          onSlideChange={() => {
            // Thumb Swiper index handling handled by slideTo sync
          }}
        >
          {images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                className={`relative aspect-square rounded-xl cursor-pointer overflow-hidden border-2 transition-all duration-300 
                  ${
                    index === selectedImgIndex
                      ? "border-primary-light ring-2 ring-primary-light/20"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                onClick={() => handleThumbnailClick(index)}
              >
                {isVideo(image) ? (
                  <video
                    src={image.imageLink}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={image.imageLink}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}

                {index === selectedImgIndex && (
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-primary-light shadow-sm" />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default ImgSlider;
