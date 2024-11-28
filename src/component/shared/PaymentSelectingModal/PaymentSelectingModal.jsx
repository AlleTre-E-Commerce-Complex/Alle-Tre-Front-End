import React from "react";
import { Modal } from "semantic-ui-react";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "localization/localization-keys";
import { setWalletBalance } from "redux-store/wallet-balance-slice";
import { useDispatch } from "react-redux";

const PaymentSelectingModal = ({
  open,
  setOpen,
  isWalletPayment,
  setIsWalletPayment,
  creatAuction,
}) => {
  const dispatch = useDispatch();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const handleSubmitPayment = () => {
    if (isWalletPayment) {
      dispatch(setWalletBalance({ isWallet: true }));
      creatAuction();
    }
    setOpen(false);
  };

  return (
    <div>
      <Modal
        className="sm:w-[506px] w-full h-auto bg-transparent scale-in"
        onOpen={() => setOpen(true)}
        open={open}
      >
        <div className=" sm:w-[500px] h-auto rounded-2xl bg-white border-2 border-primary">
          <div className="bg-primary text-white text-center font-semibold py-2 text-xl">
            <h1>{selectedContent[localizationKeys.PaymentSelection]}</h1>
          </div>
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
            <div className="gap-3 flex justify-center">
              <button
                className="bg-white hover:bg-gray-100 border border-primary-light text-primary py-2 px-3 rounded-md my-2"
                onClick={() => setOpen(false)}
              >
                {selectedContent[localizationKeys.cancel]}
              </button>
              <button
                className="bg-primary hover:bg-primary-light border border-primary-light text-white py-2 px-3 rounded-md my-2"
                onClick={handleSubmitPayment}
              >
                {selectedContent[localizationKeys.Submit]}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentSelectingModal;
