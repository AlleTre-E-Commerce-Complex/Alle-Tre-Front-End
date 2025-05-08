import { useEffect,useRef, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";
import { Open } from "../../../redux-store/auth-model-slice";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
import watermarkImage from "../../../../src/assets/logo/WaterMarkFinal.png";

import { BsPlayFill } from 'react-icons/bs';

const ImgSlider = ({
  images,
  auctionId,
  WatshlistState,
  onReload,
  isMyAuction,
  title,
  isListProduct,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWatshlist, setWatshlist] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [isAppleDevice] = useState(() => /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent));

  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const isArabic = lang === "ar";
  const { user } = useAuthState();
  const dispatch = useDispatch();

  const toggleZoom = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsZoomed(!isZoomed);
    }, 300);
  }, [isZoomed]);

  useEffect(() => {
    if (images && images.length > 0) setSelectedImgIndex(0);
  }, [images]);

  useEffect(() => {
    // Check if it's an Apple device
    const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
    
    if (isAppleDevice && images?.[selectedImgIndex] && isVideo(images[selectedImgIndex])) {
      const mainVideo = document.querySelector('.main-video-player');
      if (mainVideo) {
        mainVideo.defaultMuted = true;
        mainVideo.muted = true;
        mainVideo.playsInline = true;
        
        // Small delay to ensure video is ready
        setTimeout(() => {
          mainVideo.play().catch(error => {
            console.log('Autoplay prevented on Apple device:', error);
          });
        }, 100);
      }
    }
  }, [selectedImgIndex, images, isVideo]);

  useEffect(() => {
    setWatshlist(WatshlistState);
  }, [WatshlistState]);

  useEffect(() => {
    const handleScroll = () => {
      if (isZoomed) {
        toggleZoom();
      }
    };

    const handleScrollEvent = () => {
      requestAnimationFrame(handleScroll);
    };

    if (isZoomed) {
      window.addEventListener("scroll", handleScrollEvent);
    } else {
      window.removeEventListener("scroll", handleScrollEvent);
    }

    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, [isZoomed, toggleZoom]);

  const handleNext = () => {
    setSelectedImgIndex((prev) => {
      const nextIndex = (prev + 1) % images.length;
      scrollThumbnailIntoView(nextIndex);
      return nextIndex;
    });
  };

  const handlePrevious = () => {
    setSelectedImgIndex((prev) => {
      const nextIndex = prev === 0 ? images.length - 1 : prev - 1;
      scrollThumbnailIntoView(nextIndex);
      return nextIndex;
    });
  };

  const scrollThumbnailIntoView = (index) => {
    const container = document.getElementById('thumbnail-container');
    const thumbnail = container?.children[index];
    if (thumbnail && container) {
      const containerWidth = container.offsetWidth;
      const thumbnailWidth = thumbnail.offsetWidth;
      const scrollPosition = container.scrollLeft;
      const thumbnailPosition = thumbnail.offsetLeft;

      const isOutOfViewRight = thumbnailPosition + thumbnailWidth > scrollPosition + containerWidth;
      const isOutOfViewLeft = thumbnailPosition < scrollPosition;

      if (isOutOfViewRight) {
        container.scrollTo({
          left: thumbnailPosition - containerWidth + thumbnailWidth + 16,
          behavior: 'smooth'
        });
      } else if (isOutOfViewLeft) {
        container.scrollTo({
          left: thumbnailPosition - 16,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleThumbnailClick = (index) => {
    setSelectedImgIndex(index);
    scrollThumbnailIntoView(index);
  };

  const { run, isLoading } = useAxios([]);
  const handelAddNewWatshlist = () => {
    if (user) {
      const body = {
        auctionId: auctionId,
      };
      if (!isWatshlist) {
        run(
          authAxios.post(api.app.WatchList.add, body).then((res) => {
            toast.success(selectedContent[localizationKeys.thisAuctionAddedToWatchListSuccessfully]);
            setWatshlist(true);
            onReload();
          })
        );
      } else {
        run(
          authAxios.delete(api.app.WatchList.delete(auctionId)).then((res) => {
            toast.success(selectedContent[localizationKeys.thisAuctionRemovedFromWatchListSuccessfully]);
            setWatshlist(false);
            onReload();
          })
        );
      }
    } else {
      dispatch(Open());
    }
  };

  const getDomain = () => {
    const { protocol, hostname, port } = window.location;
    return port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`;
  };

  const handleShare = async () => {
    const shareUrl = isListProduct
      ? `${getDomain()}/alletre/my-product/${auctionId}/details`
      : `${getDomain()}/alletre/home/${auctionId}/details`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: { title },
          text: "Check out this auction!",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const isVideo = (media) => {
    return media?.imagePath?.match(/\.(mp4|mov|webm|avi)$/i);
  };

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="shadow rounded-2xl group overflow-hidden relative flex flex-col h-[480px]">
        <div className="relative w-full h-[85%] cursor-pointer">
          {images &&
            images?.length > 0 && (
              <div className="relative w-full h-full">
                {isVideo(images[selectedImgIndex]) ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      className="main-video-player w-full h-full object-contain rounded-md shadow-lg transition-transform duration-300 ease-in-out"
                      key={images[selectedImgIndex]?.imageLink}
                      controls
                      controlsList="nodownload nofullscreen"
                      muted
                      playsInline
                      loop
                      preload="auto"
                      webkit-playsinline
                      playsinline
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    >
                      <source
                        src={images[selectedImgIndex]?.imageLink}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <img
                        src={watermarkImage}
                        className="opacity-50 w-1/3 h-auto"
                        alt="Watermark"
                      />
                    </div>

                    {/* Play button overlay for iOS */}
                    {isAppleDevice && !isPlaying && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.play()
                              .then(() => setIsPlaying(true))
                              .catch(error => console.log('Play error:', error));
                          }
                        }}
                      >
                        <div className="bg-white/80 rounded-full p-4 hover:bg-white transition-colors duration-300">
                          <BsPlayFill className="text-primary text-4xl" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    className="w-full h-full object-contain rounded-md shadow-lg transition-transform duration-300 ease-in-out"
                    src={images[selectedImgIndex]?.imageLink}
                    alt={
                      images[selectedImgIndex]?.description || "Product image"
                    }
                    onLoad={() => setIsImageLoaded(true)}
                    onClick={isImageLoaded ? toggleZoom : null}
                  />
                )}
                {/* Tap to Zoom Text */}
                <div
                  onClick={isImageLoaded ? toggleZoom : null}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100 cursor-pointer"
                >
                  <span className="text-white text-sm md:text-xl font-semibold">
                    {selectedContent[localizationKeys.tapToZoom]}
                  </span>
                </div>
              </div>
            )}

          <div
            className={`absolute top-1/2 w-full flex ${isArabic ? "justify-between flex-row-reverse" : "justify-between"
              } px-4 transform -translate-y-1/2 z-20`}
          >
            <button
              onClick={isArabic ? handleNext : handlePrevious}
              className="bg-primary/40 hover:bg-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group/btn"
            >
              <BsChevronLeft
                style={{ stroke: "currentColor", strokeWidth: 1 }}
                className="text-primary group-hover/btn:text-white text-xl transition-colors duration-300"
              />
            </button>
            <button
              onClick={isArabic ? handlePrevious : handleNext}
              className="bg-primary/40 hover:bg-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group/btn"
            >
              <BsChevronRight
                style={{ stroke: "currentColor", strokeWidth: 1 }}
                className="text-primary group-hover/btn:text-white text-xl transition-colors duration-300"
              />
            </button>
          </div>

          <div
            className={`absolute top-5 z-20 flex items-center ${isArabic ? "left-5 space-x-reverse" : "right-5"
              } space-x-2`}
          >
            {!isMyAuction && (
              <button
                onClick={handelAddNewWatshlist}
                className="border-primary border-2 border-solid bg-white group/watchlist rounded-lg md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                {isWatshlist ? (
                  <BsBookmarkFill className="text-primary group-hover/watchlist:text-white text-lg md:text-xl" />
                ) : (
                  <BsBookmark className="text-primary group-hover/watchlist:text-white text-lg md:text-xl" />
                )}
              </button>
            )}
            <div
              onClick={handleShare}
              className="border-primary border-2 border-solid bg-white rounded-lg md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary group/share transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              <RiShareForwardFill className="text-primary group-hover/share:text-white transition-all duration-300 text-lg md:text-2xl" />
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="h-[18%] w-full flex justify-center items-center bg-secondary/10">
            <div className="bg-opacity-70 p-2 flex gap-2 relative w-full max-w-[90%]">
              {/* Left scroll button */}
              {images?.length > 8 && (
                <button
                  onClick={() => {
                    const container = document.getElementById('thumbnail-container');
                    container.scrollLeft -= 200;
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Thumbnails container */}
              <div
                id="thumbnail-container"
                className="flex gap-2 overflow-x-auto scroll-smooth hide-scrollbar"
                style={{
                  scrollBehavior: 'smooth',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none'
                }}
              >
                {images?.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-[70px] h-[70px] rounded-lg cursor-pointer border-2 relative group/thumb
                      ${index === selectedImgIndex
                        ? "border-primary border-4 shadow-lg"
                        : "border-transparent hover:border-primary/50"}
                    `}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    {isVideo(image) ? (
                      <>
                        <video
                          ref={(el) => {
                            if (el) {
                              el.defaultMuted = true;
                              el.muted = true;
                              el.playsInline = true;
                            }
                          }}
                          src={image.imageLink}
                          className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${loadedImages[index] ? 'opacity-100' : 'opacity-0'}`}
                          muted
                          playsInline
                          webkit-playsinline
                          x5-playsinline
                          playsinline
                          preload="metadata"
                          onLoadedData={(e) => {
                            handleImageLoad(index);
                            e.target.play().catch(() => {});
                          }}
                        />
                        {!loadedImages[index] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <img
                          src={image.imageLink}
                          alt={`Product ${index + 1}`}
                          className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${loadedImages[index] ? 'opacity-100' : 'opacity-0'}`}
                          loading="lazy"
                          onLoad={() => handleImageLoad(index)}
                        />
                        {!loadedImages[index] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                          </div>
                        )}
                      </>
                    )}
                    {/* Image number indicator */}
                    <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                      {index + 1}
                    </div>
                    {index === selectedImgIndex && (
                      <div className="absolute inset-0 bg-gray-500/50 rounded-lg transition-all duration-300" />
                    )}
                  </div>
                ))}
              </div>

              {/* Right scroll button */}
              {images?.length > 8 && (
                <button
                  onClick={() => {
                    const container = document.getElementById('thumbnail-container');
                    container.scrollLeft += 200;
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>

          {isZoomed && (
            <div
              className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50"
              onClick={toggleZoom}
              style={{
                cursor: "zoom-out",
                height: "70vh",
              }}
            >
              {isVideo(images[selectedImgIndex]) ? (
                <div className="relative">
                  <video
                    key={images[selectedImgIndex]?.imageLink}
                    className="w-full h-full object-contain"
                    controls
                    controlsList="nodownload nofullscreen"
                    muted
                    playsInline
                    loop
                    preload="auto"
                    webkit-playsinline="true"
                    x-webkit-airplay="allow"
                    onCanPlay={(e) => {
                      const playPromise = e.target.play();
                      if (playPromise !== undefined) {
                        playPromise.catch(error => {
                          console.log('Auto-play prevented:', error);
                        });
                      }
                    }}
                    style={{
                      width: "90vw",
                      height: "70vh",
                      objectFit: "contain",
                    }}
                  >
                    <source
                      src={images[selectedImgIndex]?.imageLink}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <img
                      src={watermarkImage}
                      className="opacity-50 w-1/3 h-auto"
                      alt="Watermark"
                    />
                  </div>
                </div>
              ) : (
                <img
                  src={images[selectedImgIndex]?.imageLink}
                  alt=""
                  className="object-contain"
                  style={{
                    width: "90vw",
                    height: "70vh",
                    objectFit: "contain",
                  }}
                />
              )}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-5 bg-primary hover:bg-primary/40 p-3 rounded-full shadow-lg transition-all duration-300"
              >
                <BsChevronLeft
                  style={{ stroke: "currentColor", strokeWidth: 1 }}
                  className="text-white text-xl transition-colors duration-300"
                />
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleNext();
                }}
                className="absolute right-5 bg-primary hover:bg-primary/40 p-3 rounded-full shadow-lg transition-all duration-300"
              >
                <BsChevronRight
                  style={{ stroke: "currentColor", strokeWidth: 1 }}
                  className="text-white text-xl transition-colors duration-300"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImgSlider;
