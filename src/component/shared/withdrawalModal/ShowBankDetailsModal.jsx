import { useLanguage } from "context/language-context";
import useAxios from "hooks/use-axios";
import content from "localization/content";
import React, { useEffect, useState } from "react";
import { Dimmer, Modal } from "semantic-ui-react";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
import { authAxios } from "config/axios-config";
import EmtyWatchlist from "../../../../src/assets/icons/empty-watch-list.svg";
import localizationKeys from "../../../localization/localization-keys";
import toast from "react-hot-toast";
import { GoPlus } from "react-icons/go";

import api from "api";
import AddNewBankModal from "./AddNewBankModal";
import { useAuthState } from "context/auth-context";

const ShowBankDetailsModal = ({
  open,
  setOpen,
  setSuccessModal,
  accountBalance,
}) => {
  const { user } = useAuthState();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run, isLoading } = useAxios([]);
  const [amount, setAmount] = useState(0);
  const [selectedBankAccountId, setBankAccountId] = useState("");
  const [accountData, setAccountData] = useState([]);
  const [openAddNewBank, setOpenAddNewBank] = useState(false);

  useEffect(() => {
    run(
      authAxios
        .get(api.app.Wallet.getAccountData)
        .then((response) => {
          if (response.data.success) {
            setAccountData(response.data.accountData);
          } else {
            toast.error("Please add new bank account.");
          }
        })
        .catch((error) => {
          toast.error(
            "Sorry, There are some internal issue, please try again later."
          );
        })
    );
  }, [openAddNewBank, run]);

  const handleSubmit = async (e) => {
    if(amount <= 1){
      toast.error(selectedContent[localizationKeys.AmountMustBeMoreThan1AED])
      return
    }
    e.preventDefault();
    if (user.id <= 100 && Number(accountBalance) - Number(amount) < 100) {
      if (Number(accountBalance) <= 100) {
        toast.error(
          `Sorry. You can't withdraw the amount of ${amount} AED. AED 100 is reserved as a welcome bonus.`
        );
      } else {
        toast.error(
          `You can only withdraw up to ${
            accountBalance - 100
          } AED. AED 100 is reserved as a welcome bonus.`
        );
      }
      return;
    }
    if (selectedBankAccountId === "") {
      toast.error("Please Select an account");
    } else if (amount === "") {
      toast.error("The withdrawal amount must not be empty");
    } else if (amount === 0) {
      toast.error(selectedContent[localizationKeys.AmountMustBeMoreThan1AED]);
    } else {
      try {
        run(
          authAxios
            .post(api.app.Wallet.withdrawalRequest, {
              amount: Number(amount),
              selectedBankAccountId,
            })
            .then((response) => {
              if (response.data.success) {
                setOpen(false);
                setSuccessModal(true);
              } else {
                // Handle error
                toast.error(response.data.message);
              }
            })
        );
      } catch (error) {
        toast.error("Failed to process withdrawal");
      }
    }
  };
  const HandleSelectBankAccount = (id) => {
    setBankAccountId(id);
  };
  const handleAddNewBanck = () => {
    setOpenAddNewBank(true);
  };

  if (!open) return null;

  return (
    <Modal
      className="md:w-[980px] w-full h-auto bg-transparent scale-in"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Dimmer
          className="fixed w-full h-full top-0 "
          active={isLoading}
          inverted
        >
          {/* <Loader active /> */}
          <LodingTestAllatre />
        </Dimmer>
        <div className="bg-white h-auto  border-2 border-primary rounded-2xl shadow-md w-full">
          <h1 className="text-black font-semibold text-lg text-center my-6">
            {selectedContent[localizationKeys.YourBankDetails]}
          </h1>
          <div className="flex flex-wrap p-6 gap-2">
            {accountData.map((data) => (
              <div
                key={data.id}
                className={`${
                  selectedBankAccountId === data.id
                    ? "border-primary"
                    : "border-gray-med"
                } 
                            cursor-pointer border p-2 rounded-md text-gray-500 transform 
                            transition-transform duration-300 `}
                onClick={() => HandleSelectBankAccount(data.id)}
              >
                <h1>
                  {selectedContent[localizationKeys.accountHolderName]}{" "}
                  <span>{data.accountHolderName}</span>
                </h1>
                <h1>
                  {selectedContent[localizationKeys.bankName]}{" "}
                  <span>{data.bankName}</span>
                </h1>
                <h1>
                  {selectedContent[localizationKeys.bankAccountNumber]}{" "}
                  <span>{data.accountNumber}</span>
                </h1>
                <h1>
                  {selectedContent[localizationKeys.IBANnumber]}{" "}
                  <span>{data.routingNumber}</span>
                </h1>
              </div>
            ))}
            <button
              onClick={handleAddNewBanck}
              className="border-gray-med hover:border-primary border-[1px] border-dashed w-[136px] h-[48px] rounded-lg text-base font-normal text-gray-med hover:text-primary flex justify-center gap-x-2 "
            >
              <GoPlus className="my-auto" size={16} />
              <p className="my-auto">
                {selectedContent[localizationKeys.addAccount]}
              </p>
            </button>
            {!accountData.length && (
              <div className=" ifNoBankAccount flex justify-center items-center pt-12 w-full ">
                <div>
                  <img
                    className="w-28 mx-auto"
                    src={EmtyWatchlist}
                    alt="EmtyWatchlist"
                  />
                  <h1 className="text-gray-dark pt-10">
                    {
                      selectedContent[
                        localizationKeys.ThereAreNoBankAccountAddedYet
                      ]
                    }
                  </h1>
                </div>
              </div>
            )}
            <div className="w-full my-5" dir={lang === "ar" ? "rtl" : "ltr"}>
              <label
                htmlFor="withdrawalAmount"
                className={`text-lg font-semibold block ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              >
                {selectedContent[localizationKeys.EnterTheAmount]}:
              </label>
              <input
                onChange={(e) => setAmount(e.target.value)}
                className={`border w-full rounded-md  p-4 mt-2 outline-none focus:ring-2 focus:ring-primary transition ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
                placeholder={selectedContent[localizationKeys.Amount]}
                type="number"
                min={1}
                name="withdrawalAmount"
                id="withdrawalAmount"
                value={amount}
              />
              <span
                className={`text-gray-500 text-xs mt-1 block ${
                  lang === "ar" ? "text-right mr-1" : "text-left"
                }`}
              >
                {selectedContent[localizationKeys.AmountMustBeMoreThan1AED]}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-x-6 rounded-lg mb-7">
            <button
              onClick={() => setOpen(false)}
              className="border-gray-400 text-gray-700 border-[1px] w-[120px] h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:border-primary hover:text-primary"
            >
              {selectedContent[localizationKeys.GoBack]}
            </button>
            <button
              onClick={handleSubmit}
              className={`h-[40px] hover:bg-primary-dark bg-primary rounded-md text-white px-3 py-2 ${
                lang === "ar" ? "ml-6" : "mr-6"
              }`}
            >
              {selectedContent[localizationKeys.SubmitWithdrawalRequest]}
            </button>
          </div>
        </div>
        {openAddNewBank && (
          <AddNewBankModal open={openAddNewBank} setOpen={setOpenAddNewBank} />
        )}
      </div>
    </Modal>
  );
};

export default React.memo(ShowBankDetailsModal);
