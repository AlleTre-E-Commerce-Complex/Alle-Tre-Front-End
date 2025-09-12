import { useState, useEffect } from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import routes from "../routes";

import Header from "../component/shared/header-app/header";
import FAQs from "../page/app/FAQs/FAQs";
import Categories from "../page/app/categories/categories";
import Home from "../page/app/home/home";
import Support from "../page/app/support/support";
import AuctionDetails from "../page/app/create-auction/auction-details";
import CreateAuction from "../page/app/create-auction/create-auction";
import PaymentDetails from "../page/app/create-auction/payment-details";
import ProductDetails from "../page/app/create-auction/product-details";
import ShippingDetails from "../page/app/create-auction/shipping-details";

import Sidebar from "../component/shared/side-bare/sibe-bare";
import AuthModel from "../component/shared/auth-model/auth-model";
import BuyNowPaymentPage from "../component/auctions-details-components/buy-now-payment-page";
import PayDeposite from "../component/home-components/pay-deposite";
import Footer from "../component/shared/footer/footer";
import Win from "../component/shared/lotties-file/win";
import PaymentSucsessModel from "../component/shared/payment-models/payment-sucsess-model";
// import useLocalStorage from "../hooks/use-localstorage";
import HomeAuctionDetails from "../page/app/auction-details/home-auction-details";
import ProfileAuctionDetails from "../page/app/auction-details/profile-auction-details";
import ProfileLayouts from "../page/app/profile/profile-layouts";
import { useSelector, useDispatch } from "react-redux";
import { SocketProvider } from "context/socket-context";
import localizationKeys from "../localization/localization-keys";
import { useLanguage } from "../context/language-context";
import content from "../localization/content";
import { useAuthState } from "../context/auth-context";
import { Open } from "../redux-store/auth-model-slice";
import RewardModal from "../component/shared/rewardModal/RewardModal";
import UnSubscribeModal from "component/shared/UnsubscribeModal/UnSubscribeModal";
import ListProductDetails from "page/app/ListProduct/List-product-details";
import { FaPlus } from "react-icons/fa6";
import SummaryListedSection from "component/home-components/summary-listed-section";
import UserDetailsPage from "component/profile-components/user-details-page";
import ListingProductsLocationDetails from "page/app/ListProduct/List-location-details";
import PrivacyPolicy from "../component/shared/privacy-policy/privacy-policy";

const AppLayouts = () => {
  const [sid, SetSid] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showUnSubscribeModal, setUnSubscribeModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const hasCompletedProfile = window.localStorage.getItem(
      "hasCompletedProfile"
    );
    const hasSeenRewardModal = localStorage.getItem("hasSeenRewardModal");

    if (!hasCompletedProfile && !hasSeenRewardModal) {
      setShowRewardModal(true);
      localStorage.setItem("hasSeenRewardModal", "true");
    }
  }, []);
  const search = location.search;
  const unSubscribe = new URLSearchParams(search).get("unSubscribe") === "true";
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (unSubscribe) {
      setUnSubscribeModal(true);
    }
  }, [unSubscribe]);

 useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get('isLoginModal') === 'true') {
    dispatch(Open());
    params.delete('isLoginModal');
    const newSearchParams = params.toString();
    history.replace(`${location.pathname}${newSearchParams ? `?${newSearchParams}` : ''}`);
  }
}, [location.search, location.pathname, history, dispatch]);


  const socketauctionId = useSelector(
    (state) => state?.socketAuctionId?.socketAuctionId
  );
  const { user } = useAuthState();
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleOnSell = () => {
    setIsExpanded(!isExpanded);
    if (user) {
      history.push(routes.app.createAuction.productDetails);
    } else dispatch(Open());
  };

  const handleListProduct = () => {
    setIsExpanded(!isExpanded);
    if (user) {
      history.push(routes.app.listProduct.default);
      // dispatch(productDetails({}));
    } else dispatch(Open());
  };

  return (
    <div className=" p-0 m-0 border-none border-0 scrollbar-hide  ">
      <SocketProvider auctionId={socketauctionId} userId={user?.id}>
        <Header
          SetSid={SetSid}
          setSelectedType={setSelectedType}
          onFilterClick={() => setIsFilterOpen(true)}
          isOpen={isDropdownOpen}
          onDropdownChange={setIsDropdownOpen}
        />
        <Sidebar SetSid={SetSid} sid={sid} />
        {showRewardModal && (
          <RewardModal
            open={showRewardModal}
            setOpen={setShowRewardModal}
            user={user}
          />
        )}
        {showUnSubscribeModal && (
          <UnSubscribeModal
            onClose={() => setUnSubscribeModal(false)}
            open={showUnSubscribeModal}
          />
        )}
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow">
            <Switch>
              <Route
                exact
                path={routes.app.home}
                render={(props) => (
                  <Home
                    {...props}
                    selectedType={selectedType}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    isDropdownOpen={isDropdownOpen}
                  />
                )}
              />
              <Route
                path={routes.app.profile.myBids.inPogressDetails()}
                component={HomeAuctionDetails}
              />
              <Route
                path={routes.app.profile.myBids.pendingDetails()}
                component={HomeAuctionDetails}
              />
              <Route
                path={routes.app.profile.myBids.waitingForDeliveryDetails()}
                component={HomeAuctionDetails}
              />
              <Route
                path={routes.app.profile.myBids.expiredDetails()}
                component={HomeAuctionDetails}
              />
              <Route
                path={routes.app.profile.myBids.completedDetails()}
                component={HomeAuctionDetails}
              />

              <Route
                path={routes.app.profile.myAuctions.activeDetails()}
                component={ProfileAuctionDetails}
              />
              <Route
                path={routes.app.profile.myAuctions.scheduledDetails()}
                component={ProfileAuctionDetails}
              />
              <Route
                path={routes.app.profile.myAuctions.soldDetails()}
                component={ProfileAuctionDetails}
              />
              <Route
                path={routes.app.profile.myAuctions.pendingDetails()}
                component={ProfileAuctionDetails}
              />
              <Route
                path={routes.app.profile.myAuctions.expiredDetails()}
                component={ProfileAuctionDetails}
              />

              <Route
                path={routes.app.profile.default}
                component={ProfileLayouts}
              />

              <Route
                path={routes.app.createAuction.paymentDetails}
                component={PaymentDetails}
              />
              <Route
                path={routes.app.createAuction.shippingDetails}
                component={ShippingDetails}
              />
              <Route
                path={routes.app.createAuction.auctionDetails}
                component={AuctionDetails}
              />
              <Route
                path={routes.app.createAuction.productDetails}
                component={ProductDetails}
              />
              <Route
                path={routes.app.createAuction.default}
                component={CreateAuction}
              />
              <Route
                path={routes.app.listProduct.default}
                component={ListProductDetails}
              />
              <Route
                path={routes.app.listProduct.listProductLocationDetails}
                component={ListingProductsLocationDetails}
              />
              <Route
                path={routes.app.listProduct.details()}
                component={SummaryListedSection}
              />

              <Route
                path={routes.app.listProduct.userDetails}
                component={UserDetailsPage}
              />

              <Route path={routes.app.buyNow()} component={BuyNowPaymentPage} />
              <Route path={routes.app.payDeposite()} component={PayDeposite} />

              <Route
                path={routes.app.homeDetails()}
                component={HomeAuctionDetails}
              />
              <Route path={routes.app.unSubscribeUser} component={Home} />
              {/* <Route path={routes.app.categories()} component={Categories} /> */}
              <Route
                exact
                path={routes.app.categories()}
                render={(props) => (
                  <Categories
                    {...props}
                    selectedType={selectedType}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                  />
                )}
              />
              <Route path={routes.app.faqs} component={FAQs} />
              <Route path={routes.app.support} component={Support} />
              <Route path={routes.app.privacyPolicy} component={PrivacyPolicy} />
            </Switch>
          </div>
          <Footer />
          <div className="relative z-max">
            {currentPath === routes.app.home && (
              <>
                <button
                  onClick={toggleExpand}
                  className={`fixed z-50 bottom-4 ${
                    lang === "ar" ? "left-4" : "right-4"
                  } bg-primary text-white font-semibold rounded-full w-12 h-12 flex items-center justify-center shadow-2xl transform transition-all duration-300 ease-in-out md:hidden ${
                    isExpanded
                      ? "rotate-45 bg-primary-dark"
                      : "rotate-0 bg-primary"
                  }`}
                >
                  <span
                    className="text-2xl font-bold transform transition-transform duration-300 ease-in-out"
                    style={{
                      transform: isExpanded ? "rotate(135deg)" : "rotate(0)",
                    }}
                  >
                    <FaPlus />
                  </span>
                </button>

                <div
                  className={`fixed z-50 ${
                    lang === "ar" ? "left-4" : "right-4"
                  } transition-all duration-300 ease-in-out md:hidden ${
                    isExpanded
                      ? "bottom-20 opacity-100"
                      : "bottom-4 opacity-0 pointer-events-none"
                  }`}
                >
                  <button
                    onClick={handleOnSell}
                    className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[136px] h-[48px] mb-2 ltr:font-serifEN rtl:font-serifAR shadow-lg"
                    style={{
                      transform: isExpanded
                        ? lang === "ar"
                          ? "translateY(-1px) translateX(-135px)"
                          : "translateY(-1px) translateX(135px)"
                        : "translateY(0,0)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  >
                    {selectedContent[localizationKeys.createAuction]}
                  </button>
                  <button
                    onClick={handleListProduct}
                    className="bg-primary hover:bg-primary-dark text-white rounded-lg w-[136px] h-[48px] mb-2 ltr:font-serifEN rtl:font-serifAR shadow-lg"
                    style={{
                      transform: isExpanded
                        ? lang === "ar"
                          ? "translateY(-60px) translateX(-0)"
                          : "translateY(-60px) translateX(0)"
                        : "translateY(0,0)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  >
                    {selectedContent[localizationKeys.listProduct]}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <Win />
        <AuthModel currentPAth={currentPath} />
        <PaymentSucsessModel
          open={
            pathname.length === 1 ||
            pathname.endsWith(`${routes.app.home}/paymentdetails`) ||
            pathname.endsWith(`${routes.app.home}/payDeposite`) ||
            pathname.endsWith(`${routes.app.home}/complete-pay`) ||
            pathname.endsWith(`${routes.app.home}/buyNow`)
              ? true
              : false
          }
        />
      </SocketProvider>
    </div>
  );
};

export default AppLayouts;
