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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

export default function CheckoutPageBuyNow() {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const buyNowValue = useSelector((state) => state?.bidAmount?.buyNow);

  const { auctionId } = useParams();

  const [clientSecret, setClientSecret] = useState("");
  const [pendingAuctionData, setPendingAuctionData] = useState("");

  const { run, isLoading } = useAxios([]);
  const { run: runPendingAuctionData, isLoading: isLoadingPendingAuctionData } =
    useAxios([]);

  useEffect(() => {
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
  }, [auctionId, buyNowValue, lang, run]);

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
        .then((res) => {
          setPendingAuctionData(res?.data?.data);
        })
    );
  }, [auctionId, run, runPendingAuctionData]);

  return (
    <div className="mt-44 animate-in ">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading && isLoadingPendingAuctionData}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
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
            In order to complete publishing your ad successfully, please pay the
            ad fee and start receiving bids immediately
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
                status={"PENDING_OWNER_DEPOIST"}
                title={pendingAuctionData?.product?.title}
                description={pendingAuctionData?.product?.description}
                img={pendingAuctionData?.product?.images[0]?.imageLink}
                startingPrice={pendingAuctionData?.startBidAmount}
              />
              <div>
                <p className="font-bold text-base text-black flex justify-between px-4 pt-3 pb-5">
                  <h1>Auctions fees</h1>
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
                <span className="text-primary underline cursor-pointer">
                  FAQs
                </span>
              </p>
            </div>
          </div>
          <div className="w-full md:px-10 px-5 shadow-lg rounded-2xl pb-8 ">
            <h1 className="font-bold text-base text-black pt-4 pb-6">
              Payment method
            </h1>
            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutFormBuyNow
                  payDeposite
                  auctionId={auctionId}
                  payPrice={buyNowValue}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
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
