import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { AuctionHomeDetailsBreadcrumb } from "../bread-crumb/Breadcrumb";
import { Dimmer, Loader } from "semantic-ui-react";
import useAxios from "../../../hooks/use-axios";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import moment from "moment";
import emtyPhotosIcon from "../../../../src/assets/icons/emty-photos-icon.svg";
import AuctionsStatus from "../status/auctions-status";
import { formatCurrency } from "../../../utils/format-currency";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { truncateString } from "../../../utils/truncate-string";
import { ReactComponent as MoneyINHand } from "../../../../src/assets/icons/money-in-hand-icon.svg";
import { ReactComponent as CircleCloseIcon } from "../../../../src/assets/icons/circle-close-icon.svg";
import CheckoutFormPayDeposite from "./checkout-form-pay-deposite";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
import routes from "../../../routes";
import PaymentSelection from "../PaymentSelection/PaymentSelection";
import WalletPaymentForBiddingDeoposit from "../WalletPayment/WalletPaymentForBiddingDeoposit";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

export default function CheckoutPagePayDeposite() {
  //pay deposite of bidder
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const history = useHistory();

  const bidAmountValue = useSelector((state) => state?.bidAmount?.bidAmount);

  const { auctionId } = useParams();

  const [clientSecret, setClientSecret] = useState("");
  const [hiddenMess, setHiddenMess] = useState(false);
  const [pendingAuctionData, setPendingAuctionData] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [isWalletPayment, setIsWalletPayment] = useState(null);
  const [showWalletPaymentMethod, setShowWalletPaymentMethod] = useState(null);
  const [showStripePayment, setShowStripePayment] = useState(null);
  const [showPaymentSelecton, setShwoPaymentSelection] = useState(null);

  const { run, isLoading } = useAxios([]);
  const { run: runPendingAuctionData, isLoading: isLoadingPendingAuctionData } =
    useAxios([]);

  const appearance = {
    theme: "flat",
  };
  const options = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    runPendingAuctionData(
      authAxios
        .get(api.app.auctions.getUserAuctionsDetails(auctionId))
        .then(async (res) => {
          setPendingAuctionData(res?.data?.data);
          const auctionData = res?.data?.data;
          const amountToPay =
            auctionData.product.category.bidderDepositFixedAmount;
          if (auctionData) {
            const pendingPeymentData = await authAxios.get(
              `${api.app.auctions.isPendingPayment(
                auctionId,
                "BIDDER_DEPOSIT"
              )}`
            );
            if (!pendingPeymentData?.data?.isPendingPaymentData) {
              run(
                authAxios
                  .get(`${api.app.Wallet.getBalance}`)
                  .then((response) => {
                    console.log('response',response)
                    const balance = response.data;
                    console.log('balance',balance)
                    console.log('amountToPay',amountToPay)
                    if (balance && Number(balance) >= Number(amountToPay)) {
                      setWalletBalance(balance);
                      setShwoPaymentSelection(true);
                    } else {
                      stripePaymentApiCall();
                    }
                  })
              );
            } else {
              stripePaymentApiCall();
            }
          }
        })
    );
  }, [
    auctionId,
    runPendingAuctionData,
    run,
    lang,
    bidAmountValue,
    selectedContent,
  ]);

  const handleSubmitPayment = () => {
    if (isWalletPayment === null) {
      toast.error("Plese Select a payment method");
      return;
    }
    setShwoPaymentSelection(false);
    if (!isWalletPayment) {
      setShowStripePayment(true);
      setShowWalletPaymentMethod(false);
      stripePaymentApiCall();
    } else {
      setShowStripePayment(false);
      setShowWalletPaymentMethod(true);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const stripePaymentApiCall = () => {
    const body = {
      bidAmount: bidAmountValue,
    };
    run(
      authAxios
        .post(api.app.auctions.PayDepositByBidder(auctionId), body)
        .then((res) => {
          setClientSecret(res?.data?.data.clientSecret);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message[lang] ||
              selectedContent[
                localizationKeys.somethingWentWrongPleaseTryAgainLater
              ]
          );
        })
    );
  };
  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading && isLoadingPendingAuctionData}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in ">
        <div className="max-w-[1366px] mx-auto h-14 my-7 py-4 sm:block hidden">
          <AuctionHomeDetailsBreadcrumb details={auctionId} />
        </div>
        <div className="max-w-[1366px] mx-auto ">
          <div>
            <h1 className="font-bold text-base text-black">
              {selectedContent[localizationKeys.paymentDetails]}
            </h1>
            <p className="text-gray-dark font-normal text-base py-4">
              In order to complete submitting your bid , please pay the deposite
              for the auction
            </p>
          </div>
          <div
            className={
              hiddenMess
                ? "hidden"
                : "bg-[#A2547A05] border-primary-light border-[0.5px] rounded-lg w-full h-auto pt-9 pb-7 flex gap-x-10 justify-start px-10 mt-4 mb-5 relative"
            }
          >
            <CircleCloseIcon
              onClick={() => setHiddenMess(true)}
              className="absolute right-3 -top-5 cursor-pointer"
            />
            <MoneyINHand />
            <p className="text-gray-dark my-auto">
              Please notice that The bidding deposit will be captured until the
              auction is completed within 6 days. if you wins the auction, the
              website will withdraw the deposit.
            </p>
          </div>
          <div className="flex gap-x-10 justify-between md:flex-row flex-col-reverse md:mx-0 mx-4 h-auto">
            <div className="w-full ">
              <div className="bg-gray-light rounded-2xl px-8 py-5">
                <h1 className="font-bold text-base text-black pb-4 ">
                  Ad preview
                </h1>
                <PandingRow
                  payDeposite
                  status={"ACTIVE"}
                  title={pendingAuctionData?.product?.title}
                  description={pendingAuctionData?.product?.description}
                  img={pendingAuctionData?.product?.images[0]?.imageLink}
                  startingPrice={pendingAuctionData?.startBidAmount}
                  startDate={pendingAuctionData?.startDate}
                />
                <div>
                  <p className="font-bold text-base text-black flex justify-between px-4 pt-3 pb-5">
                    <h1>
                      Auctions fees{" "}
                      <span class="text-gray-dark font-normal">
                        (Fees refunded after auction completion)
                      </span>
                    </h1>

                    <p>
                      {formatCurrency(
                        pendingAuctionData?.product?.category
                          ?.bidderDepositFixedAmount
                      )}
                    </p>
                  </p>
                  <p className="flex justify-between px-4 py-1.5">
                    <h1 className="text-gray-dark font-medium text-sm">
                      Category
                    </h1>
                    <p className="text-gray-med font-normal text-base">
                      {lang === "en"
                        ? pendingAuctionData?.product?.category?.nameEn
                        : pendingAuctionData?.product?.category?.nameAr}
                    </p>
                  </p>
                  <p className="flex justify-between px-4 py-1.5 ">
                    <h1 className="text-gray-dark font-medium text-sm">
                      Auction starting date
                    </h1>
                    <p className="text-gray-med font-normal text-base">
                      {moment(pendingAuctionData?.startDate).format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                  </p>
                  <p className="flex justify-between px-4 py-1.5">
                    <h1 className="text-gray-dark font-medium text-sm">
                      Auction Ending date
                    </h1>
                    <p className="text-gray-med font-normal text-base">
                      {moment(pendingAuctionData?.expiryDate).format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                  </p>
                  <p className="flex justify-between px-4 py-1.5">
                    <h1 className="text-gray-dark font-medium text-sm">
                      Auction starting price
                    </h1>
                    <p className="text-gray-med font-normal text-base">
                      {formatCurrency(pendingAuctionData?.startBidAmount)}
                    </p>
                  </p>
                </div>
                <p className="text-gray-med text-xs mt-11 text-center">
                  If you want to check Auctions policy you can check{" "}
                  <span
                    onClick={() => history.push(routes.app.faqs)}
                    className="text-primary underline cursor-pointer"
                  >
                    FAQs
                  </span>
                </p>
              </div>
            </div>
            <div className="w-full md:px-10 px-5 shadow-lg rounded-2xl pb-8 ">
              <h1 className="font-bold text-base text-black pt-4 pb-6">
                Payment method
              </h1>

              {walletBalance
                ? showPaymentSelecton && (
                    <PaymentSelection
                      isWalletPayment={isWalletPayment}
                      setIsWalletPayment={setIsWalletPayment}
                      handleSubmitPayment={handleSubmitPayment}
                    />
                  )
                : clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutFormPayDeposite
                        auctionId={auctionId}
                        payPrice={
                          pendingAuctionData?.product?.category
                            ?.bidderDepositFixedAmount
                        }
                      />
                    </Elements>
                  )}
              {clientSecret && showStripePayment && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutFormPayDeposite
                    auctionId={auctionId}
                    payPrice={
                      pendingAuctionData?.product?.category
                        ?.bidderDepositFixedAmount
                    }
                  />
                </Elements>
              )}
              {showWalletPaymentMethod && (
                <WalletPaymentForBiddingDeoposit
                  auctionId={auctionId}
                  amount={
                    pendingAuctionData?.product?.category
                      ?.bidderDepositFixedAmount
                  }
                  walletBalance={walletBalance}
                  paymentAPI={api.app.auctions.walletPayDepositByBidder}
                  bidAmount={bidAmountValue}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const PandingRow = ({
  title,
  description,
  img,
  startingPrice,
  startingDate,
  status,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <div className="bg-white  flex gap-x-6 p-4 rounded-lg">
      <div className="relative w-28 h-20 rounded-lg bg-[#F9F9F9] cursor-default  ">
        {img ? (
          <img
            className="w-28 h-20 object-cover rounded-lg "
            src={img ? img : emtyPhotosIcon}
            alt="img"
          />
        ) : (
          <img
            className="w-8 h-8 mx-auto mt-7 object-cover rounded-lg  "
            src={emtyPhotosIcon}
            alt="img"
          />
        )}
        <AuctionsStatus status={status} small absolute />
      </div>
      <div className="flex flex-col md:w-[400px] w-full ">
        <div>
          <h1 className="text-gray-dark text-sm font-medium">
            {truncateString(title, 80)}
          </h1>
          <p className="text-gray-med text-xs font-normal pt-1 ">
            {truncateString(description, 80)}
          </p>
        </div>
        <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5 w-full ">
          <div className="w-full">
            {status === "ACTIVE" ? (
              <h1 className="text-gray-veryLight text-[10px] font-normal">
                {selectedContent[localizationKeys.startingPrice]}
              </h1>
            ) : (
              <h1 className="text-gray-veryLight text-[10px] font-normal">
                {selectedContent[localizationKeys.endingTime]}
              </h1>
            )}
            <p className="text-gray-dark text-[10px] font-normal ">
              {formatCurrency(startingPrice)}
            </p>
          </div>
          <div className="w-full">
            <h1 className="text-gray-veryLight text-[10px] font-normal">
              {selectedContent[localizationKeys.startingDate]}
            </h1>
            <p className="text-gray-dark text-[10px] font-normal">
              {/* March,23 2023 */}
              {moment.utc(startingDate).format("MMMM, DD YYYY")}
            </p>
          </div>
          {status === "PENDING_OWNER_DEPOIST" ? (
            <button className="bg-secondary-light text-white text-xs px-2 rounded h-6 my-auto cursor-default w-full">
              {selectedContent[localizationKeys.pendingDeposit]}
            </button>
          ) : (
            <div className="w-full"></div>
          )}
        </div>
      </div>
    </div>
  );
};

// import React, { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";

// import { AuctionHomeDetailsBreadcrumb } from "../bread-crumb/Breadcrumb";
// import { Dimmer, Loader } from "semantic-ui-react";
// import useAxios from "../../../hooks/use-axios";
// import { useLanguage } from "../../../context/language-context";
// import content from "../../../localization/content";
// import localizationKeys from "../../../localization/localization-keys";
// import moment from "moment";
// import emtyPhotosIcon from "../../../../src/assets/icons/emty-photos-icon.svg";
// import AuctionsStatus from "../status/auctions-status";
// import { formatCurrency } from "../../../utils/format-currency";
// import { authAxios } from "../../../config/axios-config";
// import api from "../../../api";
// import {
//   useHistory,
//   useParams,
// } from "react-router-dom/cjs/react-router-dom.min";
// import { toast } from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { truncateString } from "../../../utils/truncate-string";
// import { ReactComponent as MoneyINHand } from "../../../../src/assets/icons/money-in-hand-icon.svg";
// import { ReactComponent as CircleCloseIcon } from "../../../../src/assets/icons/circle-close-icon.svg";
// import CheckoutFormPayDeposite from "./checkout-form-pay-deposite";
// import LodingTestAllatre from "../lotties-file/loding-test-allatre";
// import routes from "../../../routes";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

// export default function CheckoutPagePayDeposite() {
//   const [lang] = useLanguage("");
//   const selectedContent = content[lang];

//   const history = useHistory();

//   const bidAmountValue = useSelector((state) => state?.bidAmount?.bidAmount);

//   const { auctionId } = useParams();

//   const [clientSecret, setClientSecret] = useState("");
//   const [hiddenMess, setHiddenMess] = useState(false);
//   const [pendingAuctionData, setPendingAuctionData] = useState("");

//   const { run, isLoading } = useAxios([]);
//   const { run: runPendingAuctionData, isLoading: isLoadingPendingAuctionData } =
//     useAxios([]);

//   useEffect(() => {
//     const body = {
//       bidAmount: bidAmountValue,
//     };

//     run(
//       authAxios
//         .post(api.app.auctions.PayDepositByBidder(auctionId), body)
//         .then((res) => {
//           setClientSecret(res?.data?.data.clientSecret);
//         })
//         .catch((err) => {
//           toast.error(
//             err?.response?.data?.message[lang] ||
//               selectedContent[
//                 localizationKeys.somethingWentWrongPleaseTryAgainLater
//               ]
//           );
//         })
//     );
//   }, [auctionId, bidAmountValue, lang, run, selectedContent]);

//   const appearance = {
//     theme: "flat",
//   };
//   const options = {
//     clientSecret,
//     appearance,
//   };

//   useEffect(() => {
//     runPendingAuctionData(
//       authAxios
//         .get(api.app.auctions.getUserAuctionsDetails(auctionId))
//         .then((res) => {
//           setPendingAuctionData(res?.data?.data);
//         })
//     );
//   }, [auctionId, runPendingAuctionData]);

//   useEffect(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//   }, []);

//   return (
//     <>
//       <Dimmer
//         className="fixed w-full h-full top-0 bg-white/50"
//         active={isLoading && isLoadingPendingAuctionData}
//         inverted
//       >
//         {/* <Loader active /> */}
//         <LodingTestAllatre />
//       </Dimmer>
//       <div className="mt-44 animate-in ">
//         <div className="max-w-[1366px] mx-auto h-14 my-7 py-4 sm:block hidden">
//           <AuctionHomeDetailsBreadcrumb details={auctionId} />
//         </div>
//         <div className="max-w-[1366px] mx-auto ">
//           <div>
//             <h1 className="font-bold text-base text-black">
//               {selectedContent[localizationKeys.paymentDetails]}
//             </h1>
//             <p className="text-gray-dark font-normal text-base py-4">
//               In order to complete submitting your bid , please pay the deposite
//               for the auction
//             </p>
//           </div>
//           <div
//             className={
//               hiddenMess
//                 ? "hidden"
//                 : "bg-[#A2547A05] border-primary-light border-[0.5px] rounded-lg w-full h-auto pt-9 pb-7 flex gap-x-10 justify-start px-10 mt-4 mb-5 relative"
//             }
//           >
//             <CircleCloseIcon
//               onClick={() => setHiddenMess(true)}
//               className="absolute right-3 -top-5 cursor-pointer"
//             />
//             <MoneyINHand />
//             <p className="text-gray-dark my-auto">
//               Please notice that The bidding deposit will be captured until the
//               auction is completed within 6 days. if you wins the auction, the
//               website will withdraw the deposit.
//             </p>
//           </div>
//           <div className="flex gap-x-10 justify-between md:flex-row flex-col-reverse md:mx-0 mx-4 h-auto">
//             <div className="w-full ">
//               <div className="bg-gray-light rounded-2xl px-8 py-5">
//                 <h1 className="font-bold text-base text-black pb-4 ">
//                   Ad preview
//                 </h1>
//                 <PandingRow
//                   payDeposite
//                   status={"ACTIVE"}
//                   title={pendingAuctionData?.product?.title}
//                   description={pendingAuctionData?.product?.description}
//                   img={pendingAuctionData?.product?.images[0]?.imageLink}
//                   startingPrice={pendingAuctionData?.startBidAmount}
//                   startDate={pendingAuctionData?.startDate}
//                 />
//                 <div>
//                   <p className="font-bold text-base text-black flex justify-between px-4 pt-3 pb-5">
//                     <h1>Auctions fees</h1>
//                     <p>
//                       {formatCurrency(
//                         pendingAuctionData?.product?.category
//                           ?.bidderDepositFixedAmount
//                       )}
//                     </p>
//                   </p>
//                   <p className="flex justify-between px-4 py-1.5">
//                     <h1 className="text-gray-dark font-medium text-sm">
//                       Category
//                     </h1>
//                     <p className="text-gray-med font-normal text-base">
//                       {lang === "en"
//                         ? pendingAuctionData?.product?.category?.nameEn
//                         : pendingAuctionData?.product?.category?.nameAr}
//                     </p>
//                   </p>
//                   <p className="flex justify-between px-4 py-1.5 ">
//                     <h1 className="text-gray-dark font-medium text-sm">
//                       Auction starting date
//                     </h1>
//                     <p className="text-gray-med font-normal text-base">
//                       {moment(pendingAuctionData?.startDate).format(
//                         "DD/MM/YYYY"
//                       )}
//                     </p>
//                   </p>
//                   <p className="flex justify-between px-4 py-1.5">
//                     <h1 className="text-gray-dark font-medium text-sm">
//                       Auction Ending date
//                     </h1>
//                     <p className="text-gray-med font-normal text-base">
//                       {moment(pendingAuctionData?.expiryDate).format(
//                         "DD/MM/YYYY"
//                       )}
//                     </p>
//                   </p>
//                   <p className="flex justify-between px-4 py-1.5">
//                     <h1 className="text-gray-dark font-medium text-sm">
//                       Auction starting price
//                     </h1>
//                     <p className="text-gray-med font-normal text-base">
//                       {formatCurrency(pendingAuctionData?.startBidAmount)}
//                     </p>
//                   </p>
//                 </div>
//                 <p className="text-gray-med text-xs mt-11 text-center">
//                   If you want to check Auctions policy you can check{" "}
//                   <span
//                     onClick={() => history.push(routes.app.faqs)}
//                     className="text-primary underline cursor-pointer"
//                   >
//                     FAQs
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <div className="w-full md:px-10 px-5 shadow-lg rounded-2xl pb-8 ">
//               <h1 className="font-bold text-base text-black pt-4 pb-6">
//                 Payment method
//               </h1>
//               {clientSecret && (
//                 <Elements options={options} stripe={stripePromise}>
//                   <CheckoutFormPayDeposite
//                     auctionId={auctionId}
//                     payPrice={
//                       pendingAuctionData?.product?.category
//                         ?.bidderDepositFixedAmount
//                     }
//                   />
//                 </Elements>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export const PandingRow = ({
//   title,
//   description,
//   img,
//   startingPrice,
//   startingDate,
//   status,
// }) => {
//   const [lang] = useLanguage("");
//   const selectedContent = content[lang];
//   return (
//     <div className="bg-white  flex gap-x-6 p-4 rounded-lg">
//       <div className="relative w-28 h-20 rounded-lg bg-[#F9F9F9] cursor-default  ">
//         {img ? (
//           <img
//             className="w-28 h-20 object-cover rounded-lg "
//             src={img ? img : emtyPhotosIcon}
//             alt="img"
//           />
//         ) : (
//           <img
//             className="w-8 h-8 mx-auto mt-7 object-cover rounded-lg  "
//             src={emtyPhotosIcon}
//             alt="img"
//           />
//         )}
//         <AuctionsStatus status={status} small absolute />
//       </div>
//       <div className="flex flex-col md:w-[400px] w-full ">
//         <div>
//           <h1 className="text-gray-dark text-sm font-medium">
//             {truncateString(title, 80)}
//           </h1>
//           <p className="text-gray-med text-xs font-normal pt-1 ">
//             {truncateString(description, 80)}
//           </p>
//         </div>
//         <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5 w-full ">
//           <div className="w-full">
//             {status === "ACTIVE" ? (
//               <h1 className="text-gray-veryLight text-[10px] font-normal">
//                 {selectedContent[localizationKeys.startingPrice]}
//               </h1>
//             ) : (
//               <h1 className="text-gray-veryLight text-[10px] font-normal">
//                 {selectedContent[localizationKeys.endingTime]}
//               </h1>
//             )}
//             <p className="text-gray-dark text-[10px] font-normal ">
//               {formatCurrency(startingPrice)}
//             </p>
//           </div>
//           <div className="w-full">
//             <h1 className="text-gray-veryLight text-[10px] font-normal">
//               {selectedContent[localizationKeys.startingDate]}
//             </h1>
//             <p className="text-gray-dark text-[10px] font-normal">
//               {/* March,23 2023 */}
//               {moment.utc(startingDate).format("MMMM, DD YYYY")}
//             </p>
//           </div>
//           {status === "PENDING_OWNER_DEPOIST" ? (
//             <button className="bg-secondary-light text-white text-xs px-2 rounded h-6 my-auto cursor-default w-full">
//               {selectedContent[localizationKeys.pendingDeposit]}
//             </button>
//           ) : (
//             <div className="w-full"></div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
