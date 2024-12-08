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

const AppLayouts = () => {
  const [sid, SetSid] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  // const [auctionIdLocal, setAuctionId] = useLocalStorage("auctionId", "");
  useEffect(() => {
    const hasSeenRewardModal = sessionStorage.getItem("hasSeenRewardModal");
    console.log("hasSeenRewardModal***>", hasSeenRewardModal);
    if (!hasSeenRewardModal) {
      setShowRewardModal(true);
      sessionStorage.setItem("hasSeenRewardModal", "true"); // Mark as shown
    }
  }, []);
  const socketauctionId = useSelector(
    (state) => state?.socketAuctionId?.socketAuctionId
  );
  const { user } = useAuthState();
  const history = useHistory();
  const dispatch = useDispatch();

  const handelOnSell = () => {
    if (user) {
      history.push(routes.app.createAuction.productDetails);
    } else dispatch(Open());
  };
  return (
    <div className=" p-0 m-0 border-none border-0 scrollbar-hide  ">
      <SocketProvider auctionId={socketauctionId}>
        <Header SetSid={SetSid} sid={sid} />
        <Sidebar SetSid={SetSid} sid={sid} />
        {showRewardModal && (
          <RewardModal
            open={showRewardModal}
            setOpen={setShowRewardModal}
            user={user}
          />
        )}
        <div className="p-0 m-0 border-none min-h-screen ">
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
          {/* <SocketProvider> */}
          <Switch>
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

            <Route path={routes.app.buyNow()} component={BuyNowPaymentPage} />
            <Route path={routes.app.payDeposite()} component={PayDeposite} />

            <Route
              path={routes.app.homeDetails()}
              component={HomeAuctionDetails}
            />

            <Route path={routes.app.home} component={Home} />
            <Route path={routes.app.categories()} component={Categories} />
            <Route path={routes.app.faqs} component={FAQs} />
            <Route path={routes.app.support} component={Support} />
          </Switch>
          {/* </SocketProvider> */}
        </div>
        <Footer />
        {currentPath === routes.app.home && (
          <button
            onClick={handelOnSell}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-pink-700 to-[#681224] text-white hover:from-gray-600 hover:to-gray-800 font-semibold rounded-lg w-40 h-12 flex items-center justify-center shadow-2xl hover:shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out md:hidden z-[9999]"
          >
            {selectedContent[localizationKeys.createAuction]}
          </button>
        )}
      </SocketProvider>
    </div>
  );
};

export default AppLayouts;
