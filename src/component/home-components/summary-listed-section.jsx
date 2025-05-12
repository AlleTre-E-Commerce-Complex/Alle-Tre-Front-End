import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/format-currency";
import { truncateString } from "../../utils/truncate-string";
import api from "api";
import { useLocation, useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { FaWhatsapp } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import ImgSlider from "component/shared/img-slider/img-slider";
// import AuctionDetailsTabs from "component/auctions-details-components/auction-details-tabs";
import PhoneNumberModal from "component/shared/phone-number-modal/phone-number-modal";
import SilmilarProductsSlider from "component/auctions-details-components/silmilar-products-slider";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "component/shared/lotties-file/loding-test-allatre";
import routes from "../../routes";
import { ListProductsBreadcrumb } from "../../component/shared/bread-crumb/Breadcrumb";
import AuctionDetailsTabs from "component/auctions-details-components/auction-details-tabs";
import { useAuthState } from "context/auth-context";
import { useDispatch } from "react-redux";
import { Open } from "../../redux-store/auth-model-slice";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";

const SummaryListedSection = () => {
  const [listedProductsData, setListedProductsData] = useState({});
  const [mainLocation, setMainLocation] = useState();
  const [date, setDate] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { user } = useAuthState();
  const { pathname } = useLocation();
  const { productId } = useParams();
  const [activeIndexTab, setActiveIndexTab] = useState(0);
  const { run, isLoading: isLoadingListedProduct } = useAxios([]);
  const dispatch = useDispatch();
  const history = useHistory();

  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -220;
    window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: "smooth",
    });
  };

  const handleOnContact = () => {
    try {
      if (!user) {
        const hasCompletedProfile = window.localStorage.getItem(
          "hasCompletedProfile"
        );
        if (hasCompletedProfile && JSON.parse(hasCompletedProfile)) {
          setOpen(true);
        } else {
          dispatch(Open());
        }
      }
    } catch (error) {
      toast.error(selectedContent[localizationKeys.oops]);
    }
  };

  const handleOnStatus = () => {
    history.push(routes.app.profile.myProducts.default);
  };

  useEffect(() => {
    run(
      authAxios
        .get(`${api.app.productListing.listedProduct(productId)}`)
        .then((res) => {
          setDate(res?.data?.data?.createdAt);
          setListedProductsData(res?.data?.data?.product);
          setMainLocation(res?.data?.data?.location);
        })
        .catch((error) => {
          console.log("summery listed section error:", error);
        })
    );
  }, [run, productId]);

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

  const handelUserDetails = () => {
    const userData = listedProductsData?.user;
    const queryParams = new URLSearchParams({
      username: userData?.userName || "",
      id: userData?.id || "",
      imageLink: userData?.imageLink || "",
      phone: userData?.phone || "",
    }).toString();
    history.push(`${routes.app.listProduct.userDetails}?${queryParams}`);
  };
  const difference = getTimeDifference(date);
  const mapUrl = ` https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
    `${mainLocation?.lat},${mainLocation?.lng}`
  )}&key=${process.env.REACT_APP_GOOGLE_MAP_SECRET_KEY}`;
  return (
    <div>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingListedProduct}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="grid md:grid-cols-2 grid-cols-1 mt-44 animate-in mx-5 px-4">
        <div className="w-full md:w-auto">
          <div className="px-4 mx-auto h-14 px-4 py-4 sm:block  ">
            <ListProductsBreadcrumb details={productId} />
          </div>
          <ImgSlider
            images={listedProductsData?.images}
            auctionId={listedProductsData?.id}
            isMyAuction={true}
            isListProduct={true}
          />
        </div>
        <div className="ltr:sm:ml-12 rtl:sm:mr-12 ltr:ml-4 rtl:mr-4 mt-10 md:mt-0 md:order-none order-last">
          <div className="flex items-center gap-x-2 md:gap-x-5 pt-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {listedProductsData?.title}
            </h1>
            <div className="flex items-center gap-2">
              <div
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  listedProductsData.usageStatus === "NEW"
                    ? "bg-primary-veryLight text-primary"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {listedProductsData.categoryId === 3
                  ? listedProductsData.usageStatus === "NEW"
                    ? selectedContent[localizationKeys.sell]
                    : selectedContent[localizationKeys.rent]
                  : listedProductsData.usageStatus?.charAt(0).toUpperCase() +
                    listedProductsData.usageStatus?.slice(1).toLowerCase()}
              </div>
            </div>
          </div>

          <div className="py-4">
            {listedProductsData?.user?.userName && (
              <div className="flex items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-2.5">
                    {selectedContent[localizationKeys.postedBy]}
                  </p>
                  <div
                    onClick={() => handelUserDetails()}
                    className="inline-flex items-center px-4 py-2.5 bg-gray-50 hover:bg-gray-300 transition-colors duration-200 text-gray-700 rounded-lg gap-2.5 cursor-pointer"
                  >
                    <FaRegUser className="text-gray-500" />
                    <span className="text-base font-medium">
                      {listedProductsData?.user?.userName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Description */}
          <div className="py-6">
            <h3 className="text-base font-medium text-gray-700 mb-3">
              {selectedContent[localizationKeys.description]}
            </h3>
            <p className="text-base text-gray-600 leading-relaxed mb-4">
              {truncateString(listedProductsData.description, 80)}
            </p>
            <HashLink
              className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium transition-colors duration-200"
              smooth
              scroll={scrollWithOffset}
              to={`${pathname}#itemDescription`}
              onClick={() => setActiveIndexTab(0)}
            >
              {selectedContent[localizationKeys.viewDetails]}
              <svg
                className={`w-4 h-4 ml-1 ${lang === "ar" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </HashLink>
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/5 hover:bg-primary/10 transition-all duration-300 rounded-full px-4 py-1.5 border border-primary/10">
            <BsClockHistory className="text-primary text-sm" />
            <p className="text-primary font-medium text-xs sm:text-sm">
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
                `Today`}
            </p>
          </div>
          {/* Category sections */}
          <div className="py-6 flex flex-wrap gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2.5">
                {selectedContent[localizationKeys.category]}
              </p>
              <div className="text-center px-4 py-2.5 bg-gray-100 hover:bg-gray-100 transition-colors duration-200 text-gray-700 rounded-lg font-medium">
                {lang === "en"
                  ? listedProductsData?.category?.nameEn
                  : listedProductsData?.category?.nameAr}
              </div>
            </div>
            {(listedProductsData?.subCategory?.nameEn ||
              listedProductsData?.subCategory?.nameAr) && (
              <div>
                <p className="text-sm text-gray-500 mb-2.5">
                  {selectedContent[localizationKeys.subCategory]}
                </p>
                <div className="text-center px-4 py-2.5 bg-gray-100 hover:bg-gray-100 transition-colors duration-200 text-gray-700 rounded-lg font-medium">
                  {lang === "en"
                    ? listedProductsData?.subCategory?.nameEn
                    : listedProductsData?.subCategory?.nameAr}
                </div>
              </div>
            )}
          </div>

          {/* Prices  sections */}
          <div className="pt-6  gap-6">
            <div className="flex items-start space-x-4 p-4 ">
              <div className="flex-1">
                <p className="text-gray-dark text-sm font-medium uppercase tracking-wide">
                  {selectedContent[localizationKeys.sellingPrice]}
                </p>
                <p className="text-gray-verydark text-2xl font-bold mt-1">
                  {formatCurrency(listedProductsData?.ProductListingPrice)}
                </p>
              </div>
            </div>
          </div>
          <div className="pt-6 grid md:grid-cols-2 sm:grid-cols-1 gap-6">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <MdLocationOn className="text-primary-600 text-2xl mt-1" />
                <div className="flex-1">
                  <div className="text-gray-dark text-sm font-medium uppercase tracking-wide">
                    {selectedContent[localizationKeys.location]}
                  </div>
                  <div className="text-gray-verydark mt-2">
                    {mainLocation?.address ? (
                      <>
                        <p className="text-xl font-semibold leading-tight">
                          {mainLocation?.address}
                        </p>

                        <div className="flex items-center space-x-1 mt-2">
                          <p className="text-base text-gray-600">
                            {
                              mainLocation?.city?.[
                                lang === "ar" ? "nameAr" : "nameEn"
                              ]
                            }
                          </p>
                          <span className="text-gray-400">&bull;</span>
                          <p className="text-base text-gray-600">
                            {
                              mainLocation?.country?.[
                                lang === "ar" ? "nameAr" : "nameEn"
                              ]
                            }
                          </p>
                        </div>

                        {
                          mainLocation?.lat && mainLocation?.lng ? (
                            <iframe
                              title="Google Map"
                              className="w-full h-64 mt-4 rounded-lg"
                              src={mapUrl}
                              allowFullScreen
                            />
                          ) : null
                          // <p className="text-gray-600 mt-2">
                          //   {selectedContent[localizationKeys.locationNotAvailable]}
                          // </p>
                        }
                      </>
                    ) : (
                      <p>
                        {selectedContent[localizationKeys.locationNotAvailable]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {user?.id === listedProductsData?.userId ? (
            <div className="pt-4 flex gap-2">
              <button
                className=" bg-primary hover:bg-primary-dark text-white md:w-[145px] w-full h-[35px] md:h-[40px] rounded-lg flex items-center justify-center space-x-2"
                onClick={handleOnStatus}
              >
                {selectedContent[localizationKeys.changeStatus]}
              </button>

              <button
                onClick={() =>
                  history.push(routes.app.createAuction.productDetails, {
                    productId: productId,
                  })
                }
                className=" bg-primary hover:bg-primary-dark text-white md:w-[145px] w-full h-[35px] md:h-[40px] rounded-lg flex items-center justify-center space-x-2"
              >
                {selectedContent[localizationKeys.convertToAuction]}
              </button>
            </div>
          ) : user ? (
            <div className="flex flex-col md:flex-row gap-4 pt-2">
              <button
                onClick={() => {
                  const message = encodeURIComponent(
                    "Hello, I would like to inquire about your product listed on Alletre."
                  );
                  const whatsappUrl = `https://wa.me/${listedProductsData?.user?.phone}?text=${message}`;
                  window.open(whatsappUrl, "_blank");
                }}
                className="border-primary border-[1px] text-primary md:w-[120px] w-full h-[35px] md:h-[40px] rounded-lg flex items-center justify-center space-x-2 hover:border-primary-dark hover:text-primary-dark"
              >
                <FaWhatsapp />
                <span>{selectedContent[localizationKeys.chat]}</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white md:w-[120px] w-full h-[35px] md:h-[40px] rounded-lg flex items-center justify-center space-x-2"
              >
                <IoCall />
                <span> {selectedContent[localizationKeys.call]}</span>
              </button>

              <PhoneNumberModal
                openModal={isModalOpen}
                phoneNumber={listedProductsData?.user?.phone}
                setOpen={setIsModalOpen}
              />
            </div>
          ) : (
            <div className="pt-4">
              <button
                onClick={handleOnContact}
                className=" bg-primary hover:bg-primary-dark text-white md:w-[145px] w-full h-[35px] md:h-[40px] rounded-lg flex items-center justify-center space-x-2"
              >
                {selectedContent[localizationKeys.viewContactDetails]}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-28 px-4">
        <AuctionDetailsTabs
          dataTabs={listedProductsData}
          activeIndexTab={activeIndexTab}
          setActiveIndexTab={setActiveIndexTab}
          isListProduct
        />
      </div>
      <div className="mt-16">
        <SilmilarProductsSlider
          categoriesId={listedProductsData?.categoryId}
          isListProduct={true}
        />
      </div>
    </div>
  );
};

export default SummaryListedSection;
