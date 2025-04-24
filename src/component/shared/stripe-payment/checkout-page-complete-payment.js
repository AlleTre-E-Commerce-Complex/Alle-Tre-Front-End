import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { MyBidsBreadcrumb } from "../bread-crumb/Breadcrumb";
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
import CheckoutFromCompletePayment from "./checkout-from-complete-payment";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
import routes from "../../../routes";
import WalletPaymentForBidderFullPayment from "../WalletPayment/WalletPaymentForBidderFullPayment";
import BankTransferPayment from "../BankTransferPayment/BankTransferPayment";
import PaymentSelectionOnAuctionPurchase from "../PaymentSelection/PaymentSelectionOnAuctionPurchase";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

export default function CheckoutPageCompletePayment() {
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const completedPaymentData = useSelector(
    (state) => state?.completePayment?.completePaymentData
  );



  const { auctionId } = useParams();

  const [clientSecret, setClientSecret] = useState("");
  const [pendingAuctionData, setPendingAuctionData] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [isWalletPayment, setIsWalletPayment] = useState(null);
  const [showWalletPaymentMethod, setShowWalletPaymentMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false)
  const [isBankTransfer, setIsBankTransfer] = useState(false)
  const [showStripePayment, setShowStripePayment] = useState(null);
  const [showPaymentSelecton, setShwoPaymentSelection] = useState(true);
  const [loading,setLoading] = useState(true)
  const { run, isLoading } = useAxios([]);
  const { run: runPendingAuctionData, isLoading: isLoadingPendingAuctionData } =
    useAxios([]);

  // useEffect(() => {
    
  //   setLoading(true);
  //   runPendingAuctionData(
  //     authAxios
  //       .get(
  //         api.app.auctions.getUserAuctionsDetails(
  //           completedPaymentData?.auctionsId
  //         )
  //       )
  //       .then(async (res) => {
  //         setPendingAuctionData(res?.data?.data);
  //         const auctionData = res?.data?.data;
  //         const amountToPay = payingAmount;
  //         if (auctionData) {
  //           try {
  //             const response = await authAxios.get(`${api.app.Wallet.getBalance}`);
  //             const balance = response.data;

  //             if (balance && Number(balance) >= Number(amountToPay)) {
  //               setWalletBalance(balance);
  //             } else {
  //               stripePaymentApiCall();
  //             }
  //             setShwoPaymentSelection(true);
  //           } catch (error) {
  //             console.error("Error fetching wallet balance:", error);
  //             stripePaymentApiCall();
  //           } finally {
  //             setLoading(false);
  //           }
  //         } else {
  //           setLoading(false);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching auction details:", error);
  //         setLoading(false);
  //       })
  //   );
  // }, [
  //   completedPaymentData?.auctionsId,
  //   runPendingAuctionData,
  //   run,
  //   lang,
  //   auctionId,
  //   selectedContent,
  // ]);


useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const auctionPromise = authAxios.get(
        api.app.auctions.getUserAuctionsDetails(completedPaymentData?.auctionsId)
      );
      const walletPromise = authAxios.get(api.app.Wallet.getBalance);

      // Call both APIs in parallel
      const [auctionRes, walletRes] = await Promise.allSettled([
        auctionPromise,
        walletPromise,
      ]);

      // Handle auction data
      if (auctionRes.status === "fulfilled") {
        const auctionData = auctionRes.value?.data?.data;
        setPendingAuctionData(auctionData);
      } else {
        console.error("Error fetching auction details:", auctionRes.reason);
      }

      // Handle wallet balance
      if (walletRes.status === "fulfilled") {
        const balance = walletRes.value?.data;
        if (balance && Number(balance) >= Number(payingAmount)) {

          setWalletBalance(balance);
        } else {
          stripePaymentApiCall();
        }
      } else {
        console.error("Error fetching wallet balance:", walletRes.reason);
        stripePaymentApiCall();
      }

      setShwoPaymentSelection(true);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (completedPaymentData?.auctionsId) {
    fetchData();
  }
}, [
  completedPaymentData?.auctionsId,
  // runPendingAuctionData,
  // run,
  lang,
  auctionId,
  selectedContent,
]);

  const stripePaymentApiCall = () => {
    run(
      authAxios
        .post(
          api.app.auctions.auctionPurchaseByBidder(
            completedPaymentData?.auctionsId
          )
        )
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

  const handleSubmitPayment = () => {
    if (isWalletPayment === null && !showBankDetails) {
      toast.error("Plese Select a payment method");
      return;
    }
    setShwoPaymentSelection(false);
    if (isBankTransfer && !isWalletPayment) {
       setShowBankDetails(true);
    } else if (!isWalletPayment && !isBankTransfer) {
      setShowStripePayment(true);
      setShowWalletPaymentMethod(false);
      stripePaymentApiCall();
    } else if(isWalletPayment && !isBankTransfer) {
      setShowStripePayment(false);
      setShowWalletPaymentMethod(true);
    }
  };

  const appearance = {
    theme: "flat",
  };
  const options = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const baseValue = Number(completedPaymentData?.lastPrice);
  const auctionFee = ((baseValue * 0.5) / 100)
  const stripeFee = ((((baseValue + auctionFee) * 3) /100) + 4 )
  
  const payingAmount = !walletBalance 
  ? baseValue + auctionFee + stripeFee
  : showStripePayment 
  ? baseValue + auctionFee + stripeFee
  : baseValue + auctionFee;
  

  const winnerSecurityDeposit = Number(pendingAuctionData?.winnerSecurityDeposite?.amount)
  const totalPayingAmount = payingAmount - winnerSecurityDeposit

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={loading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in ">
        <div className=" mx-auto h-14 my-7 py-4 sm:block hidden">
          <MyBidsBreadcrumb />
        </div>
        <div className="mx-auto ">
          <div>
            <h1 className="font-bold text-base text-black">
              {selectedContent[localizationKeys.paymentDetails]}
            </h1>
            <p className="text-gray-dark font-normal text-base py-4">
              Congratulations, you won this auction. Now you have to pay for the
              auction and there is a three day grace period
            </p>
          </div>
          <div className="grid l:grid-cols-2 grid-cols-1 l:gap-x-10 gap-y-10 justify-between md:flex-row flex-col-reverse md:mx-0 mx-4 h-auto">
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
                  startingPrice={completedPaymentData?.lastPrice}
                  expiryDate={pendingAuctionData?.expiryDate}
                />
                <div>
                  <p className="font-bold text-base text-black flex justify-between px-4 pt-3 pb-5">
                    <h1>Auctions price</h1>
                    <p>{formatCurrency(completedPaymentData?.lastPrice)}</p>
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
                      Auction price
                    </h1>
                    <p className="text-gray-med font-normal text-base">
                      {formatCurrency(completedPaymentData?.lastPrice)}
                    </p>
                  </p>
                     <p className="flex justify-between px-4 py-1.5">
                      <h1 className="text-gray-dark font-medium text-sm">
                        Auction Fee
                      </h1>
                      <p className="text-gray-med font-normal text-base">
                        {formatCurrency(auctionFee)}
                      </p>
                    </p>
                  { clientSecret &&    <p className="flex justify-between px-4 py-1.5">
                      <h1 className="text-gray-dark font-medium text-sm">
                        Card Fee
                      </h1>
                      <p className="text-gray-med font-normal text-base">
                        {formatCurrency(stripeFee)}
                      </p>
                    </p>}
                    <p className="flex justify-between px-4 py-1.5">
                      <h1 className="text-gray-dark font-medium text-sm">
                        Total
                      </h1>
                      <p className="text-gray-med font-normal text-base">
                        {formatCurrency(payingAmount)}
                      </p>
                    </p>
                    <p className="flex justify-between px-4 py-1.5">
                      <h1 className="text-gray-dark font-medium text-sm">
                        Your Security Deposit
                      </h1>
                      <p className="text-gray-med font-normal text-base">
                        {formatCurrency(winnerSecurityDeposit)} -
                      </p>
                    </p>
                    <p className="flex justify-between px-4 py-1.5">
                      <h1 className="text-gray-dark font-medium text-sm">
                        All Total
                      </h1>
                      <p className="text-gray-med font-normal text-base">
                        {formatCurrency(totalPayingAmount)}
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

              {
              // walletBalance?
               showPaymentSelecton && (
                    <PaymentSelectionOnAuctionPurchase
                      isWalletPayment={isWalletPayment}
                      isLoading={loading}
                      setIsWalletPayment={setIsWalletPayment}
                      handleSubmitPayment={handleSubmitPayment}
                      walletBalance= {walletBalance}
                      isAUCTION_PURCHASE={true}
                      setIsBankTransfer={setIsBankTransfer}
                      isBankTransfer = {isBankTransfer}
                    />
                  )
                // : clientSecret && (
                //     <Elements options={options} stripe={stripePromise}>
                //       <CheckoutFromCompletePayment
                //         auctionId={completedPaymentData?.auctionsId}
                //         payPrice={totalPayingAmount}
                //       />
                //     </Elements>
                //   )
                  }
              {clientSecret && showStripePayment && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutFromCompletePayment
                    auctionId={completedPaymentData?.auctionsId}
                    payPrice={totalPayingAmount}
                  />
                </Elements>

              )}
              {showWalletPaymentMethod && (
                <WalletPaymentForBidderFullPayment
                  auctionId={completedPaymentData?.auctionsId}
                  amount={totalPayingAmount}
                  walletBalance={walletBalance}
                  //need to change the payment API
                  paymentAPI={api.app.auctions.WalletPayForBidderFullPayment(
                    completedPaymentData?.auctionsId
                  )}
                setShwoPaymentSelection={()=>setShwoPaymentSelection(true)}
                setShowWalletPaymentMethod={ ()=>(setShowWalletPaymentMethod(false))}
                />
              )}
              {showBankDetails &&
              <BankTransferPayment
                setShowBankDetails={()=>setShowBankDetails(false)}
                setShwoPaymentSelection={()=>setShwoPaymentSelection(true)}
                auctionId={completedPaymentData?.auctionsId}
                amount={totalPayingAmount}
              />
            }
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
  expiryDate,
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
                {selectedContent[localizationKeys.endingPrice]}
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
              {selectedContent[localizationKeys.endingTime]}
            </h1>
            <p className="text-gray-dark text-[10px] font-normal">
              {/* March,23 2023 */}
              {moment(expiryDate).format("MMMM, DD YYYY")}
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
