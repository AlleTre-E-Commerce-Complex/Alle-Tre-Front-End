import React from "react";
import { toast } from "react-hot-toast";
import { Button, Modal } from "semantic-ui-react";
import api from "../../api";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import AuctionHammer from "../shared/lotties-file/auction-hammer";
import { useParams } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

const SubmitBidModel = ({ open, setOpen, submitBidValue }) => {
  const [lang] = useLanguage("");
  const { auctionsId } = useParams();
  const { run, isLoading } = useAxios();
  const handelSubmitBid = () => {
    const body = {
      bidAmount: parseInt(submitBidValue),
    };
    run(authAxios.post(api.app.auctions.submitBid(auctionsId), body))
      .then((res) => {
        toast.success(
          lang === "en" ? "Your add new submit value successfully" : ""
        );
        setOpen(false);
      })
      .catch((err) => {
        toast.error(
          lang === "en"
            ? err.message.en || err.message
            : err.message.ar || err.message
        );
      });
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
          Congratulations on your first Bid
        </h1>
        <p className="text-center text-gray-dark pt-5">
          You are about to place a bid for $230 on this auction .please notice
          that you will need to pay a 20% of the price as a deposit only once so
          you can freely enjoy bidding
        </p>
        <div className="flex justify-end gap-x-4 pt-8">
          <button
            onClick={() => setOpen(false)}
            className="underline text-primary w-[136px] h-[48px] "
          >
            Edit Bid
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-[136px] h-[48px] rounded-lg border-[1px] border-primary text-primary"
          >
            Cancel
          </button>
          <Button
            loading={isLoading}
            onClick={() => handelSubmitBid()}
            className="w-[200px] h-[48px] rounded-lg bg-primary hover:bg-primary-dark text-white opacity-100"
          >
            Pay ${submitBidValue} deposit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default SubmitBidModel;
