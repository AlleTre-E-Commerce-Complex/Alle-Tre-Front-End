import React from "react";
import { toast } from "react-hot-toast";
import { Button, Modal } from "semantic-ui-react";
import api from "../../api";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import AuctionHammer from "../shared/lotties-file/auction-hammer";
import { useParams } from "react-router-dom";
import { authAxios } from "../../config/axios-config";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import routes from "../../routes";
import { useDispatch } from "react-redux";
import { bidAmount } from "../../redux-store/bid-amount-slice";
import { formatCurrency } from "../../utils/format-currency";

const SubmitBidModel = ({
  open,
  setOpen,
  isDepostPay,
  submitBidValue,
  setSubmitBidValue,
  bidderDepositFixedAmount,
}) => {
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { auctionId } = useParams();
  const { run, isLoading } = useAxios();
  const dispatch = useDispatch();

  const handelSubmitBid = () => {
    console.log("====================================");
    console.log(isDepostPay);
    console.log("====================================");

    const body = {
      bidAmount: submitBidValue,
    };
    if (isDepostPay) {
      run(authAxios.post(api.app.auctions.submitBid(auctionId), body))
        .then((res) => {
          toast.success(
            selectedContent[localizationKeys.yourAddNewSubmitValueSuccessfully]
          );
          setOpen(false);
          setSubmitBidValue("");
        })
        .catch((err) => {
          toast.error(
            lang === "en"
              ? err.message.en || err.message
              : err.message.ar || err.message
          );
        });
    } else {
      console.log("====================================");
      console.log(submitBidValue);
      console.log("====================================");
      setOpen(false);
      dispatch(bidAmount(submitBidValue));
      history.push(routes.app.payDeposite(auctionId));
    }
  };

  return (
    <Modal
      className="w-[680px] h-[326px] rounded-2xl bg-white border-[1px] border-primary"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <div className="w-[680px] h-[326px] rounded-2xl bg-white border-[1px] border-primary px-16">
        <AuctionHammer />
        <h1 className="text-center font-bold text-black ">
          {selectedContent[localizationKeys.congratulationsOnYourFirstBid]}
        </h1>
        <p className="text-center text-gray-dark pt-5 ">
          {selectedContent[localizationKeys.YouAreAboutToPlaceBidFor]}{" "}
          {formatCurrency(submitBidValue)}{" "}
          {
            selectedContent[
              localizationKeys.InThisAuctionPleaseNoticeThatYouWillNeedToPayA
            ]
          }
          {formatCurrency(bidderDepositFixedAmount)}
          {
            selectedContent[
              localizationKeys
                .ofThePriceAsADepositOnlyOnceSoYouCanFreelyEnjoyBidding
            ]
          }
        </p>
        <div className="flex justify-end gap-x-4 pt-8">
          <button
            onClick={() => {
              setOpen(false);
              setSubmitBidValue("");
            }}
            className="underline text-primary w-[136px] h-[48px] "
          >
            {selectedContent[localizationKeys.editBid]}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-[136px] h-[48px] rounded-lg border-[1px] border-primary text-primary"
          >
            {selectedContent[localizationKeys.cancel]}
          </button>
          <Button
            loading={isLoading}
            onClick={() => handelSubmitBid()}
            className="w-[200px] h-[48px] rounded-lg bg-primary hover:bg-primary-dark text-white opacity-100 ltr:font-serifEN rtl:font-serifAR"
          >
            {`${selectedContent[localizationKeys.pay]} ${
              isDepostPay
                ? formatCurrency(submitBidValue)
                : formatCurrency(bidderDepositFixedAmount)
            } ${selectedContent[localizationKeys.deposit]} `}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default SubmitBidModel;
