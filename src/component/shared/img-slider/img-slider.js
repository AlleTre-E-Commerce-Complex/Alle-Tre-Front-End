import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { RiShareForwardFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";
import { Open } from "../../../redux-store/auth-model-slice";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { MdNavigateNext } from "react-icons/md";
import { useLanguage } from "../../../context/language-context";

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
  const [isZoomed, setIsZoomed] = useState(false); // State to track if the image is zoomed
  const [isWatshlist, setWatshlist] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [lang] = useLanguage("");
  const isArabic = lang === "ar";
  const { user } = useAuthState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (images && images.length > 0) setSelectedImgIndex(0);
  }, [images]);

  useEffect(() => {
    setWatshlist(WatshlistState);
  }, [WatshlistState]);

  // New useEffect to handle scroll event when zoomed
  useEffect(() => {
    const handleScroll = () => {
      if (isZoomed) {
        toggleZoom(); // Close the zoom when scrolling
      }
    };

    const handleScrollEvent = () => {
      requestAnimationFrame(handleScroll); // Use requestAnimationFrame for better performance
    };

    if (isZoomed) {
      window.addEventListener("scroll", handleScrollEvent);
    } else {
      window.removeEventListener("scroll", handleScrollEvent);
    }

    return () => {
      window.removeEventListener("scroll", handleScrollEvent); // Cleanup on unmount
    };
  }, [isZoomed]);

  const handleNext = () => {
    setSelectedImgIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setSelectedImgIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleThumbnailClick = (index) => {
    setSelectedImgIndex(index);
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

  const toggleZoom = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsZoomed(!isZoomed);
    }, 300);
  };

  return (
    <div className="shadow rounded-2xl group overflow-hidden relative flex flex-col h-[480px]">
      {/* Main Image Section */}
      <div className="relative w-full h-[85%] cursor-pointer">
        {images && images.length > 0 && (
          <>
            <div className="relative w-full h-full">
              <img
                className="w-full h-full object-contain rounded-md shadow-lg transition-transform duration-300 ease-in-out"
                src={images[selectedImgIndex]?.imageLink}
                alt={images[selectedImgIndex]?.description || "Product image"} // descriptive and concise alt
                onLoad={() => setIsImageLoaded(true)}
                onClick={isImageLoaded ? toggleZoom : null}
              />
              {/* Tap to Zoom Text */}
              <div
                onClick={isImageLoaded ? toggleZoom : null}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100 cursor-pointer"
              >
                <span
                  onClick={isImageLoaded ? toggleZoom : null}
                  className="text-white text-sm md:text-xl font-semibold "
                >
                  Tap to Zoom
                </span>
              </div>
            </div>
          </>
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
          <div className="bg-opacity-70 p-2  flex gap-2 overflow-x-auto">
            {images?.map((image, index) => (
              <div
                key={index}
                className={`w-[70px] h-[70px] rounded-lg cursor-pointer border-2 relative ${
                  index === selectedImgIndex
                    ? "border-primary border-4"
                    : "border-transparent"
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image.imageLink}
                  alt=""
                  className="w-full h-full object-cover "
                />
                {index === selectedImgIndex && (
                  <div className="absolute inset-0 bg-gray-500/50 rounded-lg transition-all duration-300" />
                )}
              </div>
            ))}
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
  );
};

export default ImgSlider;
