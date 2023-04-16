import React, { useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import AuctionHammer from "../shared/lotties-file/auction-hammer";

const SubmitBidModel = ({ open, setOpen }) => {
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
          <button className="underline text-primary w-[136px] h-[48px] ">
            Edit Bid
          </button>
          <button className="w-[136px] h-[48px] rounded-lg border-[1px] border-primary text-primary">
            Cancel
          </button>
          <button className="w-[200px] h-[48px] rounded-lg bg-primary hover:bg-primary-dark text-white">
            Pay $200 deposit
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default SubmitBidModel;
