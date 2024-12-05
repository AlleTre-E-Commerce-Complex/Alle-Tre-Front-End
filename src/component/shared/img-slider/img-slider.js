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
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (images && images.length > 0) setSelectedImgIndex(0);
  }, [images]);

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

  const loginData = useSelector((state) => state?.loginDate?.loginDate);
  const [isWatshlist, setWatshlist] = useState(false);

  useEffect(() => {
    setWatshlist(WatshlistState);
  }, [WatshlistState]);

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

  return (
    <div className="shadow rounded-2xl group overflow-hidden relative flex flex-col h-[480px]">
      {/* Main Image Section */}
      <div className="relative w-full h-[85%]">
        {images && images.length > 0 && (
          <img
            className="w-full h-full object-contain"
            src={images[selectedImgIndex]?.imageLink}
            alt=""
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
        <div
          onClick={handleShare}
          className="absolute top-5 right-5 z-50 border-primary border-2 border-solid bg-white rounded-xl md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary transition-all duration-300 cursor-pointer flex items-center justify-center"
        >
          <RiShareForwardFill className="text-primary hover:text-white transition-all duration-300 text-2xl md:text-3xl" />
        </div>
        {!isMyAuction && (
          <div className="absolute top-20 right-2 md:right-5">
            <button
              onClick={handelAddNewWatshlist}
              className="border-primary border-2 border-solid bg-white rounded-xl md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              {isWatshlist ? (
                <BsBookmarkFill className="text-primary hover:text-white text-2xl md:text-3xl" />
              ) : (
                <BsBookmark className="text-primary hover:text-white text-2xl md:text-3xl" />
              )}
            </button>
          </div>
        )}
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
    </div>
  );
};

export default ImgSlider;
