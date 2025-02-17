import { Modal } from "semantic-ui-react";

// import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import routes from "../../../routes";
import PaymentSucsess from "../lotties-file/payment-sucsess";
import { useEffect } from "react";
import localizationKeys from "../../../localization/localization-keys";
// import { io } from "socket.io-client";
import { useAuthState } from "context/auth-context";
const PaymentSucsessModel = ({ open, setOpen, TextButton, onReload }) => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { pathname } = useLocation();
  const location = useLocation();
  const { user } = useAuthState();
  // Get auctionId from URL search params
  const searchParams = new URLSearchParams(location.search);
  const auctionId = searchParams.get("auctionId");

  // const bidAmountPathName = useSelector((state) => state?.bidAmount);

  useEffect(() => {
    const handlePopState = () => {
      history.go(0); // Reloads the page on back button press
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [history]);

  // const socketUrl = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
  // const socket_ = io(socketUrl, { query: { userId: user?.id } });

  return (
    <Modal
      className="sm:w-[506px] w-full h-auto bg-transparent scale-in "
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <div className="sm:w-[506px] w-full h-auto border-2 border-primary rounded-2xl bg-background pb-8 pt-2">
        <div>
          <PaymentSucsess />
        </div>
        <h1 className="text-black font-semibold text-base text-center pt-4">
          {selectedContent[localizationKeys.paymentSuccess]}
        </h1>
        <p className="text-gray-dark text-center mx-20 text-base font-normal pt-4">
          {pathname.endsWith(`${routes.app.home}/complete-pay`)
            ? selectedContent[localizationKeys.yourBidHasBeenSuccessfullyPlaced]
            : pathname.endsWith(`${routes.app.home}/buyNow`)
            ? selectedContent[
                localizationKeys.yourPurchaseHasBeenSuccessfullyCompleted
              ]
            : selectedContent[
                localizationKeys
                  .yourDepositHasBeenSuccessfullyTransferredAndYourAuctionIsActiveNow
              ]}
        </p>
        <div className="flex justify-center gap-x-10 pt-8">
          <button
            onClick={() => {
              pathname.endsWith(`${routes.app.home}/payDeposite`)
                ? history.push(routes.app.homeDetails(auctionId))
                : pathname.endsWith(`${routes.app.home}/complete-pay`)
                ? history.push(routes.app.profile.myBids.default)
                : pathname.endsWith(`${routes.app.home}/buyNow`)
                ? history.push(routes.app.profile.purchased)
                : history.push(routes.app.homeDetails(auctionId));
            }}
            className="border-primary text-primary border-[1px] w-[136px] h-[48px] rounded-lg text-base font-normal "
          >
            {pathname.endsWith(`${routes.app.home}/complete-pay`)
              ? selectedContent[localizationKeys.viewBids]
              : pathname.endsWith(`${routes.app.home}/buyNow`)
              ? selectedContent[localizationKeys.viewPurchased]
              : selectedContent[localizationKeys.viewAuction]}
          </button>
          <button
            onClick={() => history.push(`${routes.app.home}?page=1&perPage=28`)}
            className="bg-primary text-white w-[136px] h-[48px] rounded-lg text-base font-normal"
          >
            {selectedContent[localizationKeys.backToHome]}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentSucsessModel;
