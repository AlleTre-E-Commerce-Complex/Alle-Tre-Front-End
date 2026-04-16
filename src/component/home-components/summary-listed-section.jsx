import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/format-currency";
import api from "api";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { IoStar, IoLocationSharp, IoCall } from "react-icons/io5";
import { FaUser, FaWhatsapp } from "react-icons/fa";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdPublishedWithChanges, MdDeleteOutline, MdOutlineEdit, MdInfoOutline } from "react-icons/md";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RiShareForwardFill } from "react-icons/ri";
import { ShareFallBack } from "../shared/react-share/ShareFallback";
// import { RiAuctionLine } from "react-icons/ri";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import ImgSlider from "component/shared/img-slider/img-slider";
import PhoneNumberModal from "component/shared/phone-number-modal/phone-number-modal";
import SilmilarProductsSlider from "component/auctions-details-components/silmilar-products-slider";
import { Dimmer, Icon, Modal } from "semantic-ui-react";
import { useChat } from "context/chat-context";
import LoadingTest3arbon from "component/shared/lotties-file/loading-test-3arbon";
import routes from "../../routes";
import { ListProductsBreadcrumb } from "../../component/shared/bread-crumb/Breadcrumb";
import AuctionDetailsTabs from "component/auctions-details-components/auction-details-tabs";
import { useAuthState } from "context/auth-context";
import { useDispatch } from "react-redux";
import { Open } from "../../redux-store/auth-model-slice";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import ConfirmationModal from "component/shared/delete-modal/delete-modal";
import CommentSection from "./comments/CommentSection";

const SummaryListedSection = () => {
  const [listedProductsData, setListedProductsData] = useState({});
  const [mainLocation, setMainLocation] = useState();

  const [difference, setDifference] = useState({
    months: 0,
    weeks: 0,
    days: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { user } = useAuthState();
  const { productId } = useParams();
  const [activeIndexTab, setActiveIndexTab] = useState(0);
  const { run, isLoading: isLoadingListedProduct } = useAxios([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showShareFallback, setShowShareFallback] = useState(false);

  const mapUrl = `https://maps.google.com/maps?q=${mainLocation?.lat},${mainLocation?.lng}&hl=es&z=14&output=embed`;
  const { startConversation, toggleWidget } = useChat();

  const handleChatClick = async () => {
    if (!user) {
      dispatch(Open());
      return;
    }
    
     // Prevent chatting with yourself
    const sellerId = listedProductsData?.user?.id || listedProductsData?.userId;
    
    if (Number(user.id) === Number(sellerId)) {
      toast.error(selectedContent[localizationKeys.youCannotChatWithYourself]);
      return;
    }

    try {
      toggleWidget(true);
      await startConversation(Number(sellerId), productId);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error(selectedContent[localizationKeys.oops]);
    }
  };

  const handleOnContact = () => {
    try {
      if (!user) {
        dispatch(Open());
        return false;
      }
      return true;
    } catch (error) {
      toast.error(selectedContent[localizationKeys.oops]);
      return false;
    }
  };

  const handleOnStatus = () => {
    history.push(routes.app.profile.myProducts.inPogress);
  };

  const handleDelete = async () => {
    try {
      const res = await authAxios.delete(
        api.app.productListing.deleteListedProduct(productId),
      );
      if (res.data.success) {
        toast.success(selectedContent[localizationKeys.successDelete]);
        history.replace(routes.app.profile.myProducts.default);
      }
    } catch (error) {
      toast.error(selectedContent[localizationKeys.oops]);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    if (productId) {
      authAxios
        .get(api.app.comments.get(productId))
        .then((res) => {
          if (res.data.success) {
            setCommentCount(res.data.data.length);
          }
        })
        .catch((err) => console.error("Error fetching initial comment count:", err));
    }
  }, [productId]);

  useEffect(() => {
    run(
      authAxios
        .get(`${api.app.productListing.listedProduct(productId)}`)
        .then((res) => {
          const createdAt = res?.data?.data?.createdAt;
          setListedProductsData({
            ...res?.data?.data?.product,
            isSaved: res?.data?.data?.isSaved,
            status: res?.data?.data?.status,
          });
          setMainLocation(res?.data?.data?.location);

          if (createdAt) {
            const now = new Date();
            const listingDate = new Date(createdAt);
            const diffInTime = now.getTime() - listingDate.getTime();
            const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
            const months = Math.floor(diffInDays / 30);
            const weeks = Math.floor((diffInDays % 30) / 7);
            const days = diffInDays % 7;
            setDifference({ months, weeks, days });
          }
        })
        .catch((error) => {
          console.log("summery listed section error:", error);
        }),
    );
  }, [run, productId]);


  const handleWhatsApp = () => {
    if (handleOnContact()) {
      const message = encodeURIComponent(
        `Hello, I'm interested in "${listedProductsData?.title}" (Ref: ${productId}) listed on 3arbon.\n\n${window.location.href}`,
      );
      const whatsappUrl = `https://wa.me/${listedProductsData?.user?.phone}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleCall = () => {
    if (handleOnContact()) {
      setIsModalOpen(true);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      dispatch(Open());
      return;
    }

    try {
      if (listedProductsData.isSaved) {
        await authAxios.delete(api.app.WatchList.delete(productId, true));
        setListedProductsData((prev) => ({ ...prev, isSaved: false }));
        toast.success(
          selectedContent[
            localizationKeys.thisProductRemovedFromFavouritesSuccessfully
          ],
        );
      } else {
        await authAxios.post(api.app.WatchList.add, { productId: productId });
        setListedProductsData((prev) => ({ ...prev, isSaved: true }));
        toast.success(
          selectedContent[
            localizationKeys.thisProductAddToFavouritesSuccessfully
          ],
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(selectedContent[localizationKeys.oops]);
    }
  };

  const getDomain = () => {
    const { protocol, hostname, port } = window.location;
    return port
      ? `${protocol}//${hostname}:${port}`
      : `${protocol}//${hostname}`;
  };

  const handleShare = async () => {
    const shareUrl = `${getDomain()}/my-product/${productId}/details`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: listedProductsData?.title || "Check out this product!",
          text: "Check out this product on 3arbon",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing post:", error);
        setShowShareFallback(true);
      }
    } else {
      setShowShareFallback(!showShareFallback);
    }
  };

  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  return (
    <div className="bg-white dark:bg-primary min-h-screen pt-32 pb-20 transition-colors duration-300">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50 dark:bg-black/50"
        active={isLoadingListedProduct}
        inverted
      >
        <LoadingTest3arbon />
      </Dimmer>

      <div className="w-full mx-auto px-4 md:px-8">
        <div className="w-full flex items-center px-4 md:px-6 shadow-sm overflow-x-auto hide-scrollbar mt-4 md:mt-8">
          <div className="min-w-max">
            <ListProductsBreadcrumb
              details={productId}
              category={
                lang === "en"
                  ? listedProductsData?.category?.nameEn
                  : listedProductsData?.category?.nameAr
              }
              categoryId={listedProductsData?.categoryId}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Content Area (Left) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="animate-in">
              <div className="mt-4 relative group">
                <ImgSlider
                  images={listedProductsData?.images}
                  auctionId={listedProductsData?.id}
                  WatshlistState={listedProductsData?.isSaved}
                  onReload={() => {
                    // Refetch data to get latest isSaved state
                    run(authAxios.get(`${api.app.productListing.listedProduct(productId)}`)).then((res) => {
                      setListedProductsData({
                        ...res?.data?.data?.product,
                        isSaved: res?.data?.data?.isSaved,
                      });
                    });
                  }}
                  isMyAuction={listedProductsData?.userId === user?.id}
                  isListProduct={true}
                  title={listedProductsData?.title}
                  status={listedProductsData?.status}
                />
              </div>
            </div>

         
            {/* Asset Specifications Section */}
            <div className="mb-8 hidden lg:block">
              <AuctionDetailsTabs
                dataTabs={listedProductsData}
                activeIndexTab={activeIndexTab}
                setActiveIndexTab={setActiveIndexTab}
                isListProduct
              />
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:col-span-4 space-y-6 sticky top-40">
            {/* Purchase Card */}
            <div className="bg-white dark:bg-primary-dark border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
              {/* Title & Location Section (Integrated from Overlay) */}
              <div className="mb-8 text-primary dark:text-white ">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary dark:text-white leading-tight mb-2">
                      {listedProductsData?.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-white/60 text-xs sm:text-sm font-medium">
                      <IoLocationSharp
                        className="text-primary dark:text-primary-light"
                        size={16}
                      />
                      <span className="dark:text-gray-300 transition-colors duration-300">
                        {
                          mainLocation?.city?.[
                            lang === "ar" ? "nameAr" : "nameEn"
                          ]
                        }
                        ,{" "}
                        {
                          mainLocation?.country?.[
                            lang === "ar" ? "nameAr" : "nameEn"
                          ]
                        }
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-center gap-2 pt-1 relative">
                    <div className="relative">
                      <button
                        onClick={handleShare}
                        className="shrink-0 p-3 bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 border border-gray-100 dark:border-white/10 shadow-lg shadow-black/5 active:scale-95 group/share"
                        title={selectedContent[localizationKeys.share]}
                      >
                        <RiShareForwardFill className="text-gray-600 dark:text-white/80 group-hover/share:text-primary dark:group-hover/share:text-yellow transition-colors text-2xl" />
                      </button>
                      {showShareFallback && (
                        <div className="absolute right-0 top-full mt-3 p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[100] min-w-[200px] animate-in">
                          <ShareFallBack
                            shareUrl={`${getDomain()}/my-product/${productId}/details`}
                            title={listedProductsData?.title}
                          />
                        </div>
                      )}
                    </div>

                    {user?.id !== listedProductsData?.userId && (
                      <button
                        onClick={handleToggleFavorite}
                        className="shrink-0 group/fav p-3 bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 border border-gray-100 dark:border-white/10 shadow-lg shadow-black/5 active:scale-95"
                        title={selectedContent[localizationKeys.watchlist]}
                      >
                        {listedProductsData?.isSaved ? (
                          <AiFillHeart className="text-red-500 text-2xl animate-in zoom-in-50 duration-300" />
                        ) : (
                          <AiOutlineHeart className="text-gray-600 dark:text-white/80 group-hover/fav:text-red-500 transition-colors text-2xl" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Listing Age Badge */}
              <div className="mb-6 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 transition-all duration-300 rounded-full px-4 py-1.5 border border-primary dark:border-white/10">
                  <BsClockHistory className="text-primary dark:text-white text-xs" />
                  <p className="text-primary dark:text-white font-bold text-[10px] uppercase tracking-wider">
                    {difference.months > 0 && `${difference.months} months ago`}
                    {difference.months === 0 &&
                      difference.weeks > 0 &&
                      `${difference.weeks} weeks ago`}
                    {difference.months === 0 &&
                      difference.weeks === 0 &&
                      difference.days > 0 &&
                      `${difference.days} days ago`}
                    {difference.months === 0 &&
                      difference.weeks === 0 &&
                      difference.days === 0 &&
                      `Listed Today`}
                  </p>
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                  {selectedContent[localizationKeys.sellingPrice]}
                </p>
                <div className="flex items-baseline gap-2 pt-1">
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary dark:text-white tracking-tight sm:tracking-tighter transition-all duration-300">
                    {formatCurrency(listedProductsData?.ProductListingPrice)}
                  </p>
                </div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-2">
                 {selectedContent[localizationKeys.inclusiveOfAllTaxes]}
                </p>
              </div>

              {/* Category Metadata */}
              <div className="py-6 border-y border-gray-50 dark:border-slate-800/50 mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                    {selectedContent[localizationKeys.category]}
                  </p>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold border border-gray-100 dark:border-slate-800 truncate">
                    {lang === "en"
                      ? listedProductsData?.category?.nameEn
                      : listedProductsData?.category?.nameAr}
                  </div>
                </div>
                {(listedProductsData?.subCategory?.nameEn ||
                  listedProductsData?.subCategory?.nameAr) && (
                  <div>
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                      {selectedContent[localizationKeys.subCategory]}
                    </p>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold border border-gray-100 dark:border-slate-800 truncate">
                      {lang === "en"
                        ? listedProductsData?.subCategory?.nameEn
                        : listedProductsData?.subCategory?.nameAr}
                    </div>
                  </div>
                )}
              </div>
              
              {user?.id === listedProductsData?.userId ? (
                <div className="space-y-4">
                  <button
                    onClick={handleOnStatus}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-black h-16 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-primary/20 active:scale-[0.98] group uppercase tracking-widest text-xs border-b-4 border-black/40 dark:border-white/10"
                  >
                    <MdPublishedWithChanges
                      size={20}
                      className="group-hover:rotate-180 transition-transform duration-500"
                    />
                    <span>
                      {selectedContent[localizationKeys.changeStatus]}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsCommentsModalOpen(true)}
                    className="w-full bg-primary dark:bg-slate-700/50 text-white border border-primary/20 dark:border-white/10 font-black h-16 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:bg-primary/90 dark:hover:bg-slate-700 active:scale-[0.98] group uppercase tracking-widest text-[10px]"
                  >
                    <Icon name="comments" className="group-hover:scale-110 transition-transform text-white dark:text-[#d4af37]" />
                    <span>{selectedContent[localizationKeys.comments]} ({commentCount})</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => {
                        history.push(routes.app.listProduct.default, {
                          productId: productId,
                          isEditing: true,
                        });
                      }}
                      className="flex-1 h-14 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300 shadow-sm border border-gray-100 dark:border-white/5 group/edit active:scale-95"
                      title={selectedContent[localizationKeys.edit]}
                    >
                      <MdOutlineEdit
                        size={22}
                        className="group-hover/edit:rotate-12 transition-transform"
                      />
                    </div>

                    <div
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex-1 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm border border-red-100 dark:border-red-900/30 group/delete active:scale-95"
                      title={selectedContent[localizationKeys.deleteProduct]}
                    >
                      <MdDeleteOutline
                        size={22}
                        className="group-hover/delete:rotate-12 transition-transform"
                      />
                    </div>
                  </div>
                </div>
                ) : listedProductsData?.status === "OUT_OF_STOCK" ? (
                  <div className="bg-red-900/20 border border-red-100 dark:border-red-800/50 h-16 rounded-2xl flex items-center justify-center gap-3 w-full transition-all group overflow-hidden relative">
                    <MdInfoOutline className="text-red-500 dark:text-red-400 text-xl animate-pulse" />
                    <span className="text-red-600 dark:text-red-400 font-bold uppercase tracking-[0.2em] text-xs">
                      {selectedContent[localizationKeys.outOfStock]}
                    </span>
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <button
                        onClick={handleWhatsApp}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black h-16 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-green-500/20 active:scale-[0.98] group uppercase tracking-widest text-sm"
                      >
                        <FaWhatsapp className="text-2xl" />
                        <span>{selectedContent[localizationKeys.chat]}</span>
                      </button>
                      <button
                        onClick={handleCall}
                        className="w-16 h-16 bg-[#1e2738] hover:bg-[#2d3a52] text-white font-black rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-[0.98] shrink-0 shadow-lg border border-white/5 group"
                      >
                        <IoCall className="text-2xl text-yellow group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleChatClick}
                        className="flex-1 bg-gradient-to-r from-yellow to-yellow-dark hover:from-yellow-dark hover:to-[#b8860b] text-primary-dark font-black h-16 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-yellow/20 active:scale-[0.98] group uppercase tracking-widest text-[10px] border-b-4 border-[#8b6508]/30 px-2 leading-tight"
                      >
                        <Icon name="chat" className="group-hover:translate-x-1 transition-transform" />
                        <span>{selectedContent[localizationKeys.chatWithSeller]}</span>
                      </button>
                      
                      <button
                        onClick={() => setIsCommentsModalOpen(true)}
                        className="flex-1 bg-primary dark:bg-slate-800/80 text-white border border-primary/10 dark:border-white/10 font-black h-16 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:bg-primary/90 dark:hover:bg-slate-700 active:scale-[0.98] group uppercase tracking-widest text-[10px] px-2 leading-tight"
                      >
                        <Icon name="comments" className="group-hover:scale-110 transition-transform text-white dark:text-[#d4af37]" />
                        <span>
                          {selectedContent[localizationKeys.comments]}
                          <span className="ml-1 opacity-70">({commentCount})</span>
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      onClick={handleOnContact}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-black h-16 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-sm"
                    >
                      {selectedContent[localizationKeys.viewContactDetails]}
                    </button>
                  </div>
                )}
            </div>
            {/* Tabs for mobile (hidden on desktop) */}
            <div className="mt-8 lg:hidden block">
              <AuctionDetailsTabs
                dataTabs={listedProductsData}
                activeIndexTab={activeIndexTab}
                setActiveIndexTab={setActiveIndexTab}
                isListProduct
              />
            </div>
            {/* Agent Sidebar Card */}
            <div className="bg-white dark:bg-primary-dark border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {listedProductsData?.user?.imageLink ? (
                        <img
                          src={listedProductsData?.user?.imageLink}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-800 p-0.5"
                          alt="Agent"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center ring-2 ring-gray-100 dark:ring-slate-800 p-0.5">
                          <div className="w-full h-full rounded-full bg-gray-200/50 dark:bg-slate-700/50 flex items-center justify-center">
                            <FaUser className="text-gray-400 dark:text-gray-500 text-xl" />
                          </div>
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-primary-dark rounded-full flex items-center justify-center p-0.5">
                        <MdOutlineVerifiedUser className="text-blue-500 w-full h-full" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">
                        {selectedContent[localizationKeys.listedBy]}
                      </p>
                      <h4 className="font-black text-gray-900 dark:text-white tracking-tight leading-none overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                        {listedProductsData?.user?.userName}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                    <IoStar className="text-yellow-500" size={12} />
                    <span className="text-[11px] font-black text-yellow-600">
                      4.9
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Interaction Section */}
            <div className="bg-white dark:bg-primary-dark border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-lg">
              <div className="text-gray-900 dark:text-white mt-2">
                {mainLocation?.address ? (
                  <div className="space-y-6">
                    {mainLocation?.lat && mainLocation?.lng ? (
                      <div className="space-y-5">
                        <iframe
                          title="Google Map"
                          className="w-full h-80 rounded-2xl border-0 shadow-inner transition-all duration-700"
                          src={mapUrl}
                          allowFullScreen
                        />
                        <button
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${mainLocation?.lat},${mainLocation?.lng}`,
                              "_blank",
                            )
                          }
                          className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group/btn"
                        >
                          <HiOutlineExternalLink
                            size={18}
                            className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                          />
                          {selectedContent[localizationKeys.getDirections]}
                        </button>
                      </div>
                    ) : null}

                    <div className="space-y-5 px-1">
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <div className="w-14 h-14 bg-primary/5 dark:bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/10 dark:border-white/5 shadow-sm">
                          <IoLocationSharp size={28} className="text-primary dark:text-primary-light" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                            {mainLocation?.address}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary/40" />
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
                              {mainLocation?.addressLabel}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/50">
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">
                            City
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {
                              mainLocation?.city?.[
                                lang === "ar" ? "nameAr" : "nameEn"
                              ]
                            }
                          </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/50">
                          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">
                            Country
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {
                              mainLocation?.country?.[
                                lang === "ar" ? "nameAr" : "nameEn"
                              ]
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                    <IoLocationSharp
                      className="mx-auto text-gray-300 mb-4"
                      size={48}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic font-medium px-8">
                      {selectedContent[localizationKeys.locationNotAvailable]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24"> 
          <SilmilarProductsSlider
            categoriesId={listedProductsData?.categoryId}
            isListProduct={true}
          />
        </div>
      </div>

      <PhoneNumberModal
        openModal={isModalOpen}
        phoneNumber={listedProductsData?.user?.phone}
        setOpen={setIsModalOpen}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={selectedContent[localizationKeys.confirmDeleteProduct]}
        message={selectedContent[localizationKeys.areYouSureYouWantToDeleteThisProduct]}
      />

      {/* Comments Modal */}
      <Modal
        open={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        className="!bg-white dark:!bg-primary !rounded-[2rem] overflow-hidden"
        size="large"
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-primary transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-primary dark:bg-[#d4af37] rounded-full" />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
              {selectedContent[localizationKeys.comments]}
              <span className="text-gray-400 dark:text-gray-500 font-bold text-lg">
                ({commentCount})
              </span>
            </h2>
          </div>
          <button 
            onClick={() => setIsCommentsModalOpen(false)}
            className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-primary dark:hover:text-[#d4af37] transition-all duration-300 hover:scale-110 active:scale-90 group"
          >
            <Icon name="close" className="!m-0 duration-300" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[70vh] overflow-y-auto hide-scrollbar p-4 sm:p-8 transition-colors duration-300 dark:bg-primary-dark">
          <CommentSection 
             productId={productId} 
             onCountChange={setCommentCount} 
             sellerId={listedProductsData?.user?.id || listedProductsData?.userId}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SummaryListedSection;
