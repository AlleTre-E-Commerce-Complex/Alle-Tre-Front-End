import React from "react";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "localization/localization-keys";

const PaymentSelection = ({
  isWalletPayment,
  setIsWalletPayment,
  handleSubmitPayment,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  return (
    <div className="mt-10  h-auto rounded-2xl bg-white border border-primary">
      <div className="">
        <div className="px-3 py-2 my-5 text-center font-semibold text-lg">
          <h1>
            {
              selectedContent[
                localizationKeys.WhichPaymentMethodWouldYouLikeToSelect
              ]
            }
          </h1>
        </div>
        <div className="flex justify-evenly my-5">
          <div className="">
            <input
              type="radio"
              className=" mx-2 cursor-pointer accent-primary"
              name="PaymentMethod"
              id="walletPayment"
              onChange={() => setIsWalletPayment(true)}
              checked={isWalletPayment === true}
            />
            <label htmlFor="walletPayment" className="cursor-pointer ">
              {selectedContent[localizationKeys.walletPayment]}
            </label>
          </div>
          <div className="">
            <input
              type="radio"
              className=" mx-2 cursor-pointer accent-primary"
              name="PaymentMethod"
              id="onlinePayment"
              onChange={() => setIsWalletPayment(false)}
              checked={isWalletPayment === false}
            />
            <label htmlFor="onlinePayment" className="cursor-pointer ">
              {selectedContent[localizationKeys.onlinePayment]}
            </label>
          </div>
        </div>
        <div className="mx-5 my-3">
          <button
            className="bg-primary hover:bg-primary-dark w-full border border-primary-light text-white py-2 px-3 rounded-md my-2"
            onClick={handleSubmitPayment}
          >
            {selectedContent[localizationKeys.Submit]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;
