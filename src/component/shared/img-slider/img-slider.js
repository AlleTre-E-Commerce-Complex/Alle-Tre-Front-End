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

const ImgSlider = ({
  images,
  auctionId,
  WatshlistState,
  onReload,
  isMyAuction,
  title,
}) => {
  const { user } = useAuthState();
  const dispatch = useDispatch();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // State to track if the image is zoomed
  const [isWatshlist, setWatshlist] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

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
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url: `${getDomain()}/alletre/home/${auctionId}/details`,
        });
        console.log("Post shared successfully!");
      } catch (error) {
        console.error("Error sharing post:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  // Function to toggle the zoom state
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="shadow rounded-2xl group overflow-hidden relative flex flex-col h-[480px]">
      {/* Main Image Section */}
      <div className="relative w-full h-[85%] cursor-pointer">
        {images && images.length > 0 && (
          <img
            className="w-full h-full object-contain"
            src={images[selectedImgIndex]?.imageLink}
            alt=""
            onLoad={() => setIsImageLoaded(true)}
            onClick={isImageLoaded ? toggleZoom : null}
          />
        )}
        <div className="absolute top-1/2 w-full flex justify-between px-2 transform -translate-y-1/2 z-20">
          <button
            onClick={handlePrevious}
            className="bg-primary/40 hover:bg-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group/btn"
          >
            <BsChevronLeft
              style={{ stroke: "currentColor", strokeWidth: 1 }}
              className="text-primary group-hover/btn:text-white text-xl transition-colors duration-300"
            />
          </button>
          <button
            onClick={handleNext}
            className="bg-primary/40 hover:bg-primary p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group/btn"
          >
            <BsChevronRight
              style={{ stroke: "currentColor", strokeWidth: 1 }}
              className="text-primary group-hover/btn:text-white text-xl transition-colors duration-300"
            />
          </button>
        </div>
        <div className="absolute top-5 right-5 z-20 flex items-center space-x-2">
          {!isMyAuction && (
            <button
              onClick={handelAddNewWatshlist}
              className="border-primary border-2 border-solid bg-white  group/watchlist rounded-xl md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              {isWatshlist ? (
                <BsBookmarkFill className="text-primary group-hover/watchlist:text-white text-2xl md:text-3xl" />
              ) : (
                <BsBookmark className="text-primary  group-hover/watchlist:text-white text-2xl md:text-3xl" />
              )}
            </button>
          )}
          <div
            onClick={handleShare}
            className="border-primary border-2 border-solid bg-white rounded-xl md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary group/share transition-all duration-300 cursor-pointer flex items-center justify-center"
          >
            <RiShareForwardFill className="text-primary group-hover/share:text-white transition-all duration-300 text-2xl md:text-3xl" />
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

      {/* Zoomed Image Overlay */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={toggleZoom}
          style={{
            cursor: "zoom-out",
            height: "80vh", // Ensure the dimmer covers the full viewport height
          }}
        >
          <img
            src={images[selectedImgIndex]?.imageLink}
            alt=""
            className="object-contain"
            style={{
              width: "90vw",
              height: "80vh",
              objectFit: "contain", // Ensures the image scales proportionally
            }}
          />
          {/* Navigation Buttons for Zoomed Image */}
          <button
            onClick={(event) => {
              event.stopPropagation(); // Prevent closing the zoom
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
              event.stopPropagation(); // Prevent closing the zoom
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
