import AuctionCardList from "component/home-components/auction-card-list";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Dimmer } from "semantic-ui-react";
import addImage from "../../../../src/assets/icons/add-image-icon.png";
import { ReactComponent as EmtyHome } from "../../../../src/assets/icons/emty-home-page.svg";
import listicon from "../../../../src/assets/icons/list-icon.png";
import menuicon from "../../../../src/assets/icons/menu-icon.png";
import api from "../../../api";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import AuctionCard from "../../../component/home-components/auction-card";
import FilterSections from "../../../component/home-components/filter-sections";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
import PaginationApp from "../../../component/shared/pagination/pagination-app";
import SubCategorySlider from "../../../component/shared/slider-categories/sub-category-slider";
import { authAxios, axios } from "../../../config/axios-config";
import { useAuthState } from "../../../context/auth-context";
import { useLanguage } from "../../../context/language-context";
import useAxios from "../../../hooks/use-axios";
import useGetGatogry from "../../../hooks/use-get-category";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";
import useLocalStorage from "../../../hooks/use-localstorage";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { Open } from "../../../redux-store/auth-model-slice";
import routes from "../../../routes";

const Categories = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { user } = useAuthState();
  const { search } = useLocation();
  const { categoryId } = useParams();
  const myRef = useRef();
  const dispatch = useDispatch();

  const [isGrid, setIsGrid] = useState(true);
  const [open, setOpen] = useState(false);
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry } = useGetSubGatogry(categoryId);

  const [mainAuctions, setMainAuctions] = useState();
  const [totalPages, setTotalPages] = useState();
  const { run: runCategories, isLoading: isLoadingCategories } = useAxios([]);

  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      
      if (user) {
        console.log('category search when not user:',search)
        runCategories(
          authAxios.get(`${api.app.auctions.getMain}${search}`).then((res) => {
            setMainAuctions(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          })
        );
      } else {
        console.log('category search when user:',search)
        runCategories(
          axios.get(`${api.app.auctions.getMain}${search}`).then((res) => {
            setMainAuctions(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          })
        );
      }
  }, [categoryId, runCategories, search, user]);

  const [selectedCategor, SetselectedCategor] = useState([]);

  useEffect(() => {
    if (categoryId) {
      const selectedCategory = GatogryOptions.find(
        (category) => category.value === parseInt(categoryId)
      );
      if (selectedCategory) SetselectedCategor(selectedCategory);
    }
  }, [GatogryOptions, categoryId]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const [hasCompletedProfile, setHasCompletedProfile] = useLocalStorage(
    "hasCompletedProfile",
    ""
  );

  const handelCreatOuction = () => {
    if (user) {
      if (JSON.parse(hasCompletedProfile)) {
        history.push(routes.app.createAuction.productDetails);
      } else setOpen(true);
    } else dispatch(Open());
  };

  return (
    <div className="max-w-[1440px] mx-auto mt-[120px] sm:mt-[132px] ">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={loadingSubGatogry || isLoadingCategories || loadingGatogry}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="h-[320px] relative">
        <img
          className="w-full h-full object-cover pb-4"
          src={selectedCategor?.bannerLink || addImage}
          alt="bannerLink"
        />
        <div className="bg-gray/50 text-white text-5xl absolute top-0 w-full h-[305px]">
          <p className="flex justify-center items-center  h-full">
            {selectedCategor?.text}
          </p>
        </div>
      </div>
      <div className={SubGatogryOptions.length === 0 ? "hidden" : "h-[238px]"}>
        <SubCategorySlider SubGatogryOptions={SubGatogryOptions} />
      </div>
      <div className="flex justify-between max-w-[1440px] lg:mx-auto mx-2 px-2 pb-4 ">
        <div className="flex  gap-x-60">
          <h6 className=" text-gray-med text-base font-normal pt-3 ">
            {mainAuctions?.length} {selectedContent[localizationKeys.results]}
          </h6>
        </div>
        <div className={mainAuctions?.length === 0 ? "hidden" : "mt-auto"}>
          {isGrid ? (
            <button
              onClick={() => setIsGrid((p) => !p)}
              className="flex gap-x-3  h-9 text-primary-light bg-primary-light/20 rounded-lg p-2"
            >
              <img src={menuicon} alt="menuiconicon" />
              <p> {selectedContent[localizationKeys.Grid]}</p>
            </button>
          ) : (
            <button
              onClick={() => setIsGrid((p) => !p)}
              className="flex gap-x-3  h-9 text-primary-light bg-primary-light/20 rounded-lg p-2"
            >
              <img src={listicon} alt="listicon" />
              <p> {selectedContent[localizationKeys.List]}</p>
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-3 max-w-[1440px] lg:mx-auto md:mx-12 ">
        {/* left filter sections */}
        <FilterSections myRef={myRef} categoryId={categoryId} hiddenGatogry />
        {/* right card sections */}
        {mainAuctions?.length === 0 ? (
          <div className="w-full flex justify-center pt-52 bg-[#E5E5E51A] rounded-2xl">
            <div className="mx-auto text-center">
              <EmtyHome className="mx-auto " />
              <p className="text-gray-dark font-normal text-base py-8">
                {
                  selectedContent[
                    localizationKeys
                      .thereAreNoAuctionsCurrentlyMakeYourFirstAuctionRightAway
                  ]
                }
              </p>
              <button
                onClick={() => handelCreatOuction()}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[128px] h-[32px]"
              >
                {selectedContent[localizationKeys.createNow]}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {isGrid ? (
              <div className="lg:grid lg:grid-cols-4 md:flex lg:flex-nowrap md:flex-wrap gap-5 h-fit mx-auto">
                {mainAuctions?.map((e) => (
                  <AuctionCard
                    auctionId={e?.id}
                    price={e?.acceptedAmount || e?.startBidAmount}
                    title={e?.product?.title}
                    status={e?.status}
                    adsImg={e?.product?.images[0].imageLink}
                    totalBods={e?._count?.bids}
                    WatshlistState={e?.isSaved}
                    endingTime={e?.expiryDate}
                    isBuyNowAllowed={e?.isBuyNowAllowed}
                    isMyAuction={e?.isMyAuction}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full">
                {mainAuctions?.map((e) => (
                  <AuctionCardList
                    auctionId={e?.id}
                    price={e?.acceptedAmount || e?.startBidAmount}
                    title={e?.product?.title}
                    status={e?.status}
                    adsImg={e?.product?.images[0].imageLink}
                    totalBods={e?._count?.bids}
                    WatshlistState={e?.isSaved}
                    endingTime={e?.expiryDate}
                    StartDate={e?.startDate}
                    isBuyNowAllowed={e?.isBuyNowAllowed}
                    isMyAuction={e?.isMyAuction}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end ltr:mr-2 rtl:ml-2  mt-7 pb-12 max-w-[1440px] mx-auto ">
        <PaginationApp totalPages={totalPages} perPage={40} myRef={myRef} />
      </div>
      <AddLocationModel
        open={open}
        setOpen={setOpen}
        TextButton={selectedContent[localizationKeys.proceed]}
      />
    </div>
  );
};

export default Categories;
