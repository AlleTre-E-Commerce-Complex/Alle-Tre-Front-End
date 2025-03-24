import { useEffect, useState, useCallback } from "react";
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
import { BiSolidFilePdf } from "react-icons/bi";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";

const ImgSlider = ({
  images,
  auctionId,
  WatshlistState,
  onReload,
  isMyAuction,
  title,
  isListProduct,
  relatedDocument,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWatshlist, setWatshlist] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showPdf, setShowPdf] = useState(false);

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
    if (showPdf) {
      setShowPdf(false);
      setSelectedImgIndex(0);
    } else {
      if (selectedImgIndex === images.length - 1 && relatedDocument) {
        setShowPdf(true);
      } else {
        setSelectedImgIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }
  };

  const handlePrevious = () => {
    if (showPdf) {
      setShowPdf(false);
      setSelectedImgIndex(images.length - 1);
    } else {
      if (selectedImgIndex === 0 && relatedDocument) {
        setShowPdf(true);
      } else {
        setSelectedImgIndex((prevIndex) =>
          prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
      }
    }
  };

  const handleThumbnailClick = (index) => {
    setShowPdf(false);
    setSelectedImgIndex(index);
  };

  const handlePdfClick = () => {
    setShowPdf(true);
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
            toast.success("This auction added to WatchList successfully");
            setWatshlist(true);
            onReload();
          })
        );
      } else {
        run(
          authAxios.delete(api.app.WatchList.delete(auctionId)).then((res) => {
            toast.success("This auction removed from WatchList successfully");
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
        console.log("Post shared successfully!");
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  // Check if the current media is a video
  const isVideo = (media) => {
    return media?.imagePath?.match(/\.(mp4|mov|webm|avi)$/i);
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
        {/* Main Media Section */}
        <div className="relative w-full h-[85%] cursor-pointer">
          {showPdf && relatedDocument?.length > 0 ? (
            <div
              onClick={toggleZoom}
              className={`w-full h-full cursor-pointer relative ${
                isZoomed
                  ? "fixed inset-0 z-50 bg-white flex items-center justify-center"
                  : ""
              }`}
            >
              <iframe
                src={relatedDocument[0]?.imageLink}
                title="PDF Preview"
                className="w-full h-full rounded-lg transition-transform duration-300"
                style={{ pointerEvents: isZoomed ? "auto" : "none" }}
              />
            </div>
          ) : (
            images &&
            images?.length > 0 && (
              <div className="relative w-full h-full">
                {isVideo(images[selectedImgIndex]) ? (
                  <video
                    key={images[selectedImgIndex]?.imageLink} // Force re-render on src change
                    className="w-full h-full object-contain rounded-md shadow-lg transition-transform duration-300 ease-in-out"
                    controls
                    onLoadedData={() => setIsImageLoaded(true)}
                  >
                    <source
                      src={images[selectedImgIndex]?.imageLink}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
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
                {!isVideo(images[selectedImgIndex]) && (
                  <div
                    onClick={isImageLoaded ? toggleZoom : null}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100 cursor-pointer"
                  >
                    <span className="text-white text-sm md:text-xl font-semibold">
                      {selectedContent[localizationKeys.tapToZoom]}
                    </span>
                  </div>
                )}
              </div>
            )
          )}

          <div
            className={`absolute top-1/2 w-full flex ${
              isArabic ? "justify-between flex-row-reverse" : "justify-between"
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
            className={`absolute top-5 z-20 flex items-center ${
              isArabic ? "left-5 space-x-reverse" : "right-5"
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
            <div className="bg-opacity-70 p-2 flex gap-2 overflow-x-auto">
              {images?.map((image, index) => (
                <div
                  key={index}
                  className={`w-[70px] h-[70px] rounded-lg cursor-pointer border-2 relative ${
                    index === selectedImgIndex && !showPdf
                      ? "border-primary border-4"
                      : "border-transparent"
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  {isVideo(image) ? (
                    <video
                      src={image.imageLink}
                      className="w-full h-full object-cover rounded-lg"
                      muted
                    />
                  ) : (
                    <img
                      src={image.imageLink}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                  {index === selectedImgIndex && !showPdf && (
                    <div className="absolute inset-0 bg-gray-500/50 rounded-lg transition-all duration-300" />
                  )}
                </div>
              ))}

              {/* Related Documents Section */}
              {relatedDocument?.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="h-full w-[1px] bg-gray-300 mx-2" />
                  <div
                    onClick={handlePdfClick}
                    className={`min-w-[4rem] h-full flex items-center justify-center bg-white rounded-md cursor-pointer border-2 ${
                      showPdf
                        ? "border-primary border-4"
                        : "border-transparent hover:border-primary/50"
                    } transition-all `}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 text-red-500 flex items-center justify-center">
                        <BiSolidFilePdf className="w-8 h-8" />
                      </div>
                      <span className="text-sm mt-1 text-gray-700">
                        {" "}
                        {selectedContent[localizationKeys.document]}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isZoomed && (
          <div
            className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50"
            onClick={toggleZoom}
            style={{
              cursor: "zoom-out",
              height: "80vh",
            }}
          >
            {showPdf ? (
              <iframe
                src={relatedDocument[0]?.imageLink}
                title="PDF Preview"
                className="w-full h-full object-contain"
                style={{
                  width: "90vw",
                  height: "80vh",
                  objectFit: "contain",
                }}
              />
            ) : isVideo(images[selectedImgIndex]) ? (
              <video
                key={images[selectedImgIndex]?.imageLink} // Force re-render on src change
                className="w-full h-full object-contain"
                controls
                style={{
                  width: "90vw",
                  height: "80vh",
                  objectFit: "contain",
                }}
              >
                <source
                  src={images[selectedImgIndex]?.imageLink}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={images[selectedImgIndex]?.imageLink}
                alt=""
                className="object-contain"
                style={{
                  width: "90vw",
                  height: "80vh",
                  objectFit: "contain",
                }}
              />
            )}
            {isZoomed && showPdf && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
                className="absolute top-24 right-4 transform -translate-x-1/2 -translate-y-1/2 bg-red-700 text-white px-4 py-2 rounded-lg shadow-xl z-50 hover:bg-red-600"
              >
                {selectedContent[localizationKeys.close]}
              </button>
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
    </>
  );
};

export default ImgSlider;
