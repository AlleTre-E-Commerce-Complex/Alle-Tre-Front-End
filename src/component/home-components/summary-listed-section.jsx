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
import {
  AuctionHomeDetailsBreadcrumb,
  MyBidsBreadcrumb,
} from "../../component/shared/bread-crumb/Breadcrumb";
import AuctionDetailsTabs from "component/auctions-details-components/auction-details-tabs";

const SummaryListedSection = () => {
  const [listedProductsData, setListedProductsData] = useState({});
  const [mainLocation, setMainLocation] = useState()
  console.log("listedPdroduct", listedProductsData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { pathname } = useLocation();
  const { productId } = useParams();
  const [activeIndexTab, setActiveIndexTab] = useState(0);
  const { run, isLoading: isLoadingListedProduct } = useAxios([]);



  useEffect(() => {

    run(
      authAxios
        .get(`${api.app.productListing.listedProduct(productId)}`)
        .then((res) => {
          console.log('112233',res.data.data)
          setListedProductsData(res?.data?.data?.product);
          setMainLocation(res?.data?.data?.location)
        })
        .catch((error) => {
          console.log('summery listed section error:',error)
        })
    );
  }, [run, productId]);
  const lat = mainLocation?.lat;
  const lng = mainLocation?.lng;
  const mapUrl =
    mainLocation && lat !== undefined && lng !== undefined
      ? `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
          `${lat},${lng}`
        )}&key=${process.env.REACT_APP_GOOGLE_MAP_SECRET_KEY}`
      : null;

  return (
    <div>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingListedProduct}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="grid md:grid-cols-2 grid-cols-1 mt-44 animate-in mx-5 mx-auto px-4">
        <div className="w-full md:w-auto">
          <div className="px-4 mx-auto h-14 px-4 py-4 sm:block  ">
            {pathname.startsWith(routes.app.home) ? (
              <AuctionHomeDetailsBreadcrumb details={productId} />
            ) : (
              <MyBidsBreadcrumb details={productId} />
            )}
          </div>
          <ImgSlider
            images={listedProductsData?.images}
            auctionId={listedProductsData?.id}
            isMyAuction={true}
            isListProduct={true}
          />
        </div>
        <div className="ltr:sm:ml-12 rtl:sm:mr-12 ltr:ml-4 rtl:mr-4 mt-10 md:mt-0 md:order-none order-last">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 pt-8">
            {listedProductsData.title}
          </h1>
          {/* Description */}
          <div className="pt-8 overflow-clip">
            <h3 className="text-gray-dark text-base font-normal">
              {selectedContent[localizationKeys.description]}
            </h3>
            <p className="text-gray-dark text-2xl font-normal pt-4 pb-6">
              {truncateString(listedProductsData.description, 250)}
            </p>

            <HashLink
              className="underline text-gray-dark text-sm font-normal cursor-pointer pt-6"
              smooth
              to={`${pathname}#itemDescription`}
              onClick={() => setActiveIndexTab(0)}
            >
              {selectedContent[localizationKeys.viewDetails]}
            </HashLink>
          </div>
          {/* Category sections */}
          <div className="pt-6 mb-8 flex flex-wrap gap-4">
            <div>
              <span className="text-sm text-gray-500 mb-2">
                {selectedContent[localizationKeys.category]}
              </span>
              <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                {lang === "en"
                  ? listedProductsData?.category?.nameEn
                  : listedProductsData?.category?.nameAr}
              </div>
            </div>
            {(listedProductsData?.subCategory?.nameEn ||
              listedProductsData?.subCategory?.nameAr) && (
              <div>
                <span className="text-sm text-gray-500 mb-2">
                  {selectedContent[localizationKeys.subCategory]}
                </span>
                <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                  {lang === "en"
                    ? listedProductsData?.subCategory?.nameEn
                    : listedProductsData?.subCategory?.nameAr}
                </div>
              </div>
            )}
          </div>

          {/* Prices  sections */}
          <div className="pt-6  gap-6">
            <div className="space-y-2">
              <p className="text-gray-med text-base font-normal">
                {selectedContent[localizationKeys.sellingPrice]}
              </p>
              <p className="text-gray-verydark cursor-default text-2xl font-semibold">
                {formatCurrency(listedProductsData.ProductListingPrice)}
              </p>
            </div>
          </div>
          <div className="pt-6 grid md:grid-cols-2 sm:grid-cols-1 gap-6">
            <div className="space-y-2">
              <div className="text-gray-med text-base font-normal">
                {selectedContent[localizationKeys.location]}
              </div>
              <div className="text-gray-verydark cursor-default font-normal">
                {listedProductsData?.user?.locations?.find(
                  (location) => location.isMain
                ) ? (
                  <>
                    <p className="text-2xl font-semibold ">
                      {
                        listedProductsData.user.locations.find(
                          (location) => location.isMain
                        ).address
                      }
                    </p>

                    {/* <p className="text-lg font-medium text-gray-600">
                      {
                        listedProductsData.user.locations.find(
                          (location) => location.isMain
                        )?.city?.[lang === "ar" ? "nameAr" : "nameEn"]
                      }
                    </p>
                    <p className="text-lg font-medium text-gray-600 ">
                      {
                        listedProductsData.user.locations.find(
                          (location) => location.isMain
                        )?.country?.[lang === "ar" ? "nameAr" : "nameEn"]
                      }
                    </p> */}

                    {listedProductsData.user.locations.find(
                      (location) => location.isMain
                    ) ? (
                      <iframe
                        title="Google Map"
                        className="w-full h-64 mt-4 rounded-lg"
                        src={mapUrl}
                        allowFullScreen
                      />
                    ) : (
                      <p className="text-gray-600 mt-2">
                        {selectedContent[localizationKeys.locationNotAvailable]}
                      </p>
                    )}
                  </>
                ) : (
                  <p>
                    {selectedContent[localizationKeys.locationNotAvailable]}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button
              onClick={() => {
                const message = encodeURIComponent(
                  "Hello, I would like to inquire about your product listed on Alletre."
                );
                const whatsappUrl = `https://wa.me/${listedProductsData?.user?.phone}?text=${message}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="border-primary border-[1px] text-primary md:w-[120px] w-full h-[30px] md:h-[40px] rounded-lg flex items-center justify-center space-x-2 hover:border-primary-dark hover:text-primary-dark"
            >
              <FaWhatsapp />
              <span>{selectedContent[localizationKeys.chat]}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white md:w-[120px] w-full h-[30px] md:h-[40px] rounded-lg flex items-center justify-center space-x-2"
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
        </div>
      </div>
      <div className="mt-9 px-4 col-span-2">
        <AuctionDetailsTabs
          dataTabs={listedProductsData}
          activeIndexTab={activeIndexTab}
          setActiveIndexTab={setActiveIndexTab}
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
