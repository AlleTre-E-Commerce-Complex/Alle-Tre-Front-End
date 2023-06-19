import React, { useEffect, useRef, useState } from "react";
import useAxios from "../../../hooks/use-axios";
import { authAxios, axios } from "../../../config/axios-config";
import api from "../../../api";
import { useAuthState } from "../../../context/auth-context";
import { useHistory, useLocation, useParams } from "react-router-dom";
import FilterSections from "../../../components/home-components/filter-sections";
import AuctionCard from "../../../components/home-components/auction-card";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";
import SubCategorySlider from "../../../components/shared/slider-categories/sub-category-slider";
import PaginationApp from "../../../components/shared/pagination/pagination-app";
import { Dimmer, Loader } from "semantic-ui-react";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import useGetGatogry from "../../../hooks/use-get-category";
import { ReactComponent as EmtyHome } from "../../../../src/assets/icons/emty-home-page.svg";
import useLocalStorage from "../../../hooks/use-localstorage";
import routes from "../../../routes";
import { Open } from "../../../redux-store/auth-model-slice";
import { useDispatch } from "react-redux";
import AddLocationModel from "../../../components/create-auction-components/add-location-model";
import localizationKeys from "../../../localization/localization-keys";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";

const Categories = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { user } = useAuthState();
  const { search } = useLocation();
  const { categoryId } = useParams();
  const myRef = useRef();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry } = useGetSubGatogry(categoryId);

  const [mainAuctions, setMainAuctions] = useState();
  const [totalPages, setTotalPages] = useState();
  const { run: runCategories, isLoading: isLoadingCategories } = useAxios([]);

  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      if (!user) {
        runCategories(
          axios.get(`${api.app.auctions.getMain}${search}`).then((res) => {
            setMainAuctions(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          })
        );
      }
    runCategories(
      authAxios.get(`${api.app.auctions.getMain}${search}`).then((res) => {
        setMainAuctions(res?.data?.data);
        setTotalPages(res?.data?.pagination?.totalPages);
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      })
    );
  }, [categoryId, runCategories, search, user]);

  const [selectedBannerLink, setSelectedBannerLink] = useState(null);

  useEffect(() => {
    if (categoryId) {
      const selectedCategory = GatogryOptions.find(
        (category) => category.value === parseInt(categoryId)
      );
      if (selectedCategory) setSelectedBannerLink(selectedCategory.bannerLink);
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
    <div className="max-w-[1440px] mx-auto mt-[132px] ">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={loadingSubGatogry || isLoadingCategories || loadingGatogry}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div>
        <img
          className="w-full h-[317px] object-cover pb-4"
          src={selectedBannerLink}
          alt=""
        />
      </div>
      <div className={SubGatogryOptions.length === 0 ? "hidden" : "h-[238px]"}>
        <SubCategorySlider SubGatogryOptions={SubGatogryOptions} />
      </div>
      <h6 className="max-w-[1440px] mx-auto pb-4 pt-2 text-gray-med text-base font-normal">
        {mainAuctions?.length} Results
      </h6>
      <div className="flex gap-3 max-w-[1440px] lg:mx-auto md:mx-12 ">
        {/* left filter sections */}
        <FilterSections myRef={myRef} categoryId={categoryId} hiddenGatogry />
        {/* right card sections */}
        {mainAuctions?.length === 0 ? (
          <div className="w-full flex justify-center items-center bg-[#E5E5E51A] rounded-2xl">
            <div className="mx-auto text-center">
              <EmtyHome className="mx-auto" />
              <p className="text-gray-dark font-normal text-base py-8">
                There are no auctions currently. You can create your own auction
                right now
              </p>
              <button
                onClick={() => handelCreatOuction()}
                className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[128px] h-[32px]"
              >
                Create Now
              </button>
            </div>
          </div>
        ) : (
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
