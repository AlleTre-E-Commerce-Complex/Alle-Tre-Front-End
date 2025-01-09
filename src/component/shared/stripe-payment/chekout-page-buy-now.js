

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import StepperApp from "../stepper/stepper-app";
import { AuctionHomeDetailsBreadcrumb } from "../bread-crumb/Breadcrumb";
import { Dimmer, Loader } from "semantic-ui-react";
import useAxios from "../../../hooks/use-axios";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import emtyPhotosIcon from "../../../../src/assets/icons/emty-photos-icon.svg";
import AuctionsStatus from "../status/auctions-status";
import { formatCurrency } from "../../../utils/format-currency";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { truncateString } from "../../../utils/truncate-string";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import CheckoutFormBuyNow from "./checkout-form-buy-now";
import moment from "moment";
import routes from "../../../routes";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import PaymentSelection from "../PaymentSelection/PaymentSelection";
import WalletPaymentBuyNow from "../WalletPayment/WalletPaymentBuyNow";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

export default function CheckoutPageBuyNow() {
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const buyNowValue = useSelector((state) => state?.bidAmount?.buyNow);

  const { auctionId } = useParams();

  const [clientSecret, setClientSecret] = useState("");
  const [pendingAuctionData, setPendingAuctionData] = useState("");
  const [walletBalance,setWalletBalance] = useState(0)
  const [isWalletPayment,setIsWalletPayment] = useState(null)
  const [showWalletPaymentMethod,setShowWalletPaymentMethod] = useState(null)
  const [showStripePayment,setShowStripePayment] = useState(null)
  const [showPaymentSelecton,setShwoPaymentSelection] = useState(null)
  const { run, isLoading } = useAxios([]);
  const { run: runPendingAuctionData, isLoading: isLoadingPendingAuctionData } = useAxios([]);


  //==============================================================

  useEffect(() => {
    runPendingAuctionData(
      authAxios
        .get(api.app.auctions.getUserAuctionsDetails(auctionId))
        .then(async (res) => {
          setPendingAuctionData(res?.data?.data);
          const auctionData = res?.data?.data 
          const amountToPay = auctionData.acceptedAmount 
        
          if(auctionData){
            const pendingPeymentData = 
              await authAxios.get(`${api.app.auctions.isPendingPayment(
                auctionId,'BUY_NOW_PURCHASE')}`)
            console.log('pending payment data :',pendingPeymentData)
            if(!pendingPeymentData?.data?.isPendingPaymentData){
              run(
                authAxios.get(`${api.app.Wallet.getBalance}`)
                .then((response)=>{ 
                  
                  const balance = response.data
                  
                  if(balance && Number(balance) >= Number(amountToPay)){
                    setWalletBalance(balance)
                    setShwoPaymentSelection(true)
                  }else{
                      stripePaymentApiCall()
                        
                  }
                })
                
              )
            }else{
              stripePaymentApiCall()
            }
           
          }
        })
    );
  }, [auctionId, buyNowValue, run,lang, runPendingAuctionData]);

  
  const stripePaymentApiCall = () =>{
    run(
      authAxios
        .post(api.app.auctions.buyNow(auctionId))
        .then((res) => {
          setClientSecret(res?.data?.data.clientSecret);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message[lang]);
        })
    );
  }

  //==============================================================
  const handleSubmitPayment = ()=>{
    if(isWalletPayment=== null){
      toast.error('Plese Select a payment method')
      return
    }
    setShwoPaymentSelection(false)
    if(!isWalletPayment){
      setShowStripePayment(true)
      setShowWalletPaymentMethod(false)
      // run(
      //   authAxios
      //     .post(api.app.auctions.buyNow(auctionId))
      //     .then((res) => {
      //       setClientSecret(res?.data?.data.clientSecret);
      //     })
      //     .catch((err) => {
      //       toast.error(err?.response?.data?.message[lang]);
      //     })
      // );
      stripePaymentApiCall()
    }else{
      setShowStripePayment(false)
      setShowWalletPaymentMethod(true)
    }
  }
  //==============================================================


  const appearance = {
    theme: "flat",
  };
  const options = {
    clientSecret,
    appearance,
  };

  const baseValue = Number(buyNowValue ?? pendingAuctionData?.acceptedAmount);
const payingAmount = baseValue + (baseValue * 0.5) / 100;


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
        <div className="flex justify-center">
          <StepperApp />
        </div>
        <div className="max-w-[1366px] mx-auto ">
          <div>
            <h1 className="font-bold text-base text-black">
              {selectedContent[localizationKeys.paymentDetails]}
            </h1>
            <p className="text-gray-dark font-normal text-base py-4">
              To successfully complete the purchase of this ad, you must pay for
              this auction
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
                  expiryDate={pendingAuctionData?.expiryDate}
                />
                <div>
                  <p className="font-bold text-base text-black flex justify-between px-4 pt-3 pb-5">
                    <h1>purchased price</h1>
                    <p>{formatCurrency(pendingAuctionData?.acceptedAmount)}</p>
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
                  <p className="flex justify-between px-4 py-1.5">
                    <h1 className="text-gray-dark font-medium text-sm">
                      Auction Starting date
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
                      Auction purchased price
                    </h1>
                    <p className="text-gray-med font-normal text-base">
                      {formatCurrency(pendingAuctionData?.acceptedAmount)}
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
            

              {walletBalance ?showPaymentSelecton &&  <PaymentSelection 
                isWalletPayment={isWalletPayment}
                setIsWalletPayment={setIsWalletPayment}
                handleSubmitPayment={handleSubmitPayment}
              /> :
              clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutFormBuyNow
                    payDeposite
                    auctionId={auctionId}
                    payPrice={payingAmount}
                  />
                </Elements>
              )
              }
                 {clientSecret && showStripePayment &&  (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutFormBuyNow
                    payDeposite
                    auctionId={auctionId}
                    payPrice={payingAmount}
                  />
                </Elements>
              )}
              {showWalletPaymentMethod && 
              <WalletPaymentBuyNow
                auctionId={auctionId}
                amount={payingAmount}
                walletBalance={walletBalance}
                paymentAPI={api.app.auctions.buyNowThroughWallet(auctionId)}
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
  startDate,
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
              {selectedContent[localizationKeys.startDate]}
            </h1>
            <p className="text-gray-dark text-[10px] font-normal">
              {/* March,23 2023 */}
              {moment(startDate).format("MMMM, DD YYYY")}
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

