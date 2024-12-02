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
  const [selectedImg, setSelectedImg] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    if (images) setSelectedImg(images && images[0]?.imageLink);
  }, [images]);

  const onImageClick = (image) => {
    setSelectedImg(image?.imageLink);
    setTimeout(() => setIsClicked(false), 300);
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
            toast.success("This auction add to WatchList been successfully");
            setWatshlist(true);
            onReload();
          })
        );
      } else {
        run(
          authAxios.delete(api.app.WatchList.delete(auctionId)).then((res) => {
            toast.success(
              "This auction delete from WatchList been successfully"
            );
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
    <div className=" shadow rounded-2xl group overflow-hidden ">
      <div
        className={`w-full h-[480px] relative rounded-2xl ${
          isClicked ? "" : ""
        }`}
        onClick={() => setIsClicked(true)}
      >
        {selectedImg && (
          <div className="w-full h-full absolute rounded-2xl z-10">
            <img
              className={`absolute -z-10 w-full h-full object-contain p-2  ${
                isClicked ? "animate-in" : ""
              }`}
              src={selectedImg}
              alt=""
            />
          </div>
        )}
        <div
          onClick={() => handleShare()}
          className="absolute top-5 right-5 z-50 border-primary border-2 border-solid bg-white group/share rounded-xl md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary transition-all duration-300 cursor-pointer"
        >
          <div className="h-full w-full flex justify-center items-center">
            <RiShareForwardFill className="text-primary group-hover/share:text-white transition-all duration-300 text-2xl md:text-3xl" />
          </div>
        </div>
        <div className="w-full h-full relative top-0 left-0 hover:bg-gradient-to-t group-hover:from-[#25252562] rounded-2xl z-10 cursor-pointer ">
          <div
            className={
              isMyAuction
                ? "hidden"
                : "rounded-lg w-[38px] h-[88px] absolute top-20 right-2 md:right-5 z-50"
            }
          >
            <div
              onClick={() => handelAddNewWatshlist()}
              className="border-primary border-2 border-solid bg-white group/bookmark rounded-xl md:w-[38px] w-[28px] md:h-[44px] h-[32px] hover:bg-primary transition-all duration-300 cursor-pointer"
            >
              <div className="h-full w-full flex justify-center items-center">
                {isWatshlist ? (
                  <BsBookmarkFill className="text-primary group-hover/bookmark:text-white transition-all duration-300 text-2xl md:text-3xl" />
                ) : (
                  <BsBookmark className="text-primary group-hover/bookmark:text-white transition-all duration-300 text-2xl md:text-3xl" />
                )}
              </div>
            </div>
          </div>
          <div className="flex absolute bottom-7 ltr:md:left-4 rtl:md:right-4 ltr:left-0 rtl:right-0 z-20">
            {images?.map((image, index) => (
              <div
                className="w-full md:w-[89px] sm:h-[89px] h-[60px] rounded-2xl sm:mx-2.5 mx-1 object-contain cursor-pointer bg-background  "
                key={index}
                onClick={() => onImageClick(image)}
              >
                <img
                  className="w-full md:w-[89px] sm:h-[89px] h-[60px] object-contain rounded-2xl"
                  src={image.imageLink}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImgSlider;
