import { useLanguage } from "context/language-context";
import useAxios from "hooks/use-axios";
import content from "localization/content";
import React, { useEffect, useState } from "react";
import { Dimmer, Modal } from "semantic-ui-react";
import LoadingTest3arbon from "../lotties-file/loading-test-3arbon";
import { authAxios } from "config/axios-config";
import EmtyWatchlist from "../../../../src/assets/icons/empty-watch-list.svg";
import localizationKeys from "../../../localization/localization-keys";
import toast from "react-hot-toast";
import { GoPlus } from "react-icons/go";
import { BsBank2 } from "react-icons/bs";
import { FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";

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
    // if (user.id <= 100 && Number(accountBalance) - Number(amount) < 100) {
    //   if (Number(accountBalance) <= 100) {
    //     toast.error(
    //       `Sorry. You can't withdraw the amount of ${amount} AED. AED 100 is reserved as a welcome bonus.`
    //     );
    //   } else {
    //     toast.error(
    //       `You can only withdraw up to ${
    //         accountBalance - 100
    //       } AED. AED 100 is reserved as a welcome bonus.`
    //     );
    //   }
    //   return;
    // }
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
            .catch((error) => {
              const errorMsg = error.response?.data?.message;
              if (errorMsg) {
                let messages = [];
                if (Array.isArray(errorMsg)) {
                  messages = errorMsg;
                } else {
                  try {
                    const parsed = JSON.parse(errorMsg);
                    if (Array.isArray(parsed)) {
                      messages = parsed;
                    } else {
                      messages = [errorMsg];
                    }
                  } catch (e) {
                    messages = [errorMsg];
                  }
                }
                messages.forEach((msg) => toast.error(msg));
              } else {
                toast.error("Failed to process withdrawal");
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
      className="w-full h-auto bg-transparent scale-in max-w-4xl mx-auto"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
        <Dimmer
          className="fixed w-full h-full top-0 z-50"
          active={isLoading}
          inverted
        >
          <LoadingTest3arbon />
        </Dimmer>
        
        <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl w-full overflow-hidden transform transition-all duration-300 max-h-[90vh] flex flex-col relative animate-fade-in-up">
          
          {/* Header section */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1f222d] flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#eac566] to-[#d4af37] flex items-center justify-center shadow-lg shadow-[#d4af37]/30 transform -rotate-3">
                <BsBank2 className="text-2xl text-gray-900" />
              </div>
              <div>
                <h1 className="text-gray-900 dark:text-white font-bold text-2xl m-0 tracking-tight">
                  {selectedContent[localizationKeys.YourBankDetails]}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Select a bank account and enter withdrawal amount
                </p>
              </div>
            </div>
            
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Available Balance</p>
              <p className="text-xl font-bold text-[#d4af37]">AED {accountBalance?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {accountData.map((data) => {
                const isSelected = selectedBankAccountId === data.id;
                return (
                  <div
                    key={data.id}
                    className={`
                      cursor-pointer rounded-2xl p-6 relative overflow-hidden transition-all duration-300 border-2 
                      ${isSelected 
                        ? "border-[#d4af37] bg-[#d4af37]/5 shadow-[0_0_20px_rgba(212,175,55,0.15)] transform -translate-y-1" 
                        : "border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1f222d] hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-lg"
                      }
                    `}
                    onClick={() => HandleSelectBankAccount(data.id)}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-[#d4af37]">
                        <FaCheckCircle className="text-xl animate-pulse-soft" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                        <BsBank2 className="text-lg" />
                      </div>
                      <h2 className={`font-bold text-lg m-0 truncate ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                        {data.bankName}
                      </h2>
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{selectedContent[localizationKeys.accountHolderName]}</span>
                        <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[60%]">{data.accountHolderName}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{selectedContent[localizationKeys.bankAccountNumber]}</span>
                        <span className="font-medium font-mono text-gray-900 dark:text-white tracking-wider">{data.accountNumber.slice(-4).padStart(data.accountNumber.length, '•')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{selectedContent[localizationKeys.IBANnumber]}</span>
                        <span className="font-medium font-mono text-gray-900 dark:text-white tracking-wider">{data.routingNumber}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <button
                onClick={handleAddNewBanck}
                className="group border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#d4af37] dark:hover:border-[#d4af37] bg-transparent hover:bg-[#d4af37]/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-[#d4af37] flex items-center justify-center transition-colors duration-300">
                  <GoPlus className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 text-2xl" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-[#d4af37] font-semibold text-base transition-colors duration-300">
                  {selectedContent[localizationKeys.addAccount]}
                </p>
              </button>
            </div>

            {!accountData.length && (
              <div className="flex flex-col justify-center items-center py-10 w-full bg-gray-50 dark:bg-[#1f222d] rounded-2xl mb-8 border border-gray-100 dark:border-gray-700">
                <div className="w-24 h-24 mb-4 opacity-60 grayscale">
                  <img src={EmtyWatchlist} alt="EmtyWatchlist" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-gray-800 dark:text-gray-200 font-bold text-lg mb-1">
                  {selectedContent[localizationKeys.ThereAreNoBankAccountAddedYet]}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-sm">
                  Please add a new bank account using the button above before proceeding with withdrawal.
                </p>
              </div>
            )}
            
            <div className="bg-gray-50 dark:bg-[#1f222d] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              <label
                htmlFor="withdrawalAmount"
                className={`text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 ${
                  lang === "ar" ? "justify-end flex-row-reverse" : "justify-start"
                }`}
              >
                <FaMoneyBillWave className="text-[#d4af37]" />
                {selectedContent[localizationKeys.EnterTheAmount]}
              </label>
              
              <div className={`relative flex items-center ${lang === "ar" ? "flex-row-reverse" : ""}`}>
                <div className={`absolute inset-y-0 ${lang === 'ar' ? 'right-0 pr-5' : 'left-0 pl-5'} flex items-center pointer-events-none`}>
                  <span className="text-gray-500 dark:text-gray-400 font-bold text-lg">AED</span>
                </div>
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  className={`
                    w-full bg-white dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-600 rounded-xl py-4 
                    text-xl font-bold text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all shadow-inner
                    ${lang === "ar" ? "pr-16 text-right" : "pl-16 text-left"}
                  `}
                  placeholder="0.00"
                  type="number"
                  min={1}
                  name="withdrawalAmount"
                  id="withdrawalAmount"
                  value={amount || ""}
                />
              </div>
              <div className={`flex justify-between items-center mt-3 ${lang === "ar" ? "flex-row-reverse" : ""}`}>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {selectedContent[localizationKeys.AmountMustBeMoreThan1AED]}
                </span>
                <span className="text-xs text-gray-400">Available: AED {accountBalance}</span>
              </div>
            </div>
          </div>
          
          {/* Footer Section */}
          <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-[#1f222d]/80 flex justify-end gap-4 rounded-b-3xl">
            <button
              onClick={() => setOpen(false)}
              className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-base bg-white dark:bg-[#1a1c23] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              {selectedContent[localizationKeys.GoBack]}
            </button>
            <button
              onClick={handleSubmit}
              className={`
                px-8 py-3 rounded-xl font-bold text-gray-900 text-base shadow-lg transition-all duration-300
                bg-gradient-to-r from-[#eac566] to-[#d4af37] hover:shadow-xl hover:shadow-[#d4af37]/40 transform hover:-translate-y-0.5
                ${!accountData.length || amount < 1 || !selectedBankAccountId ? "opacity-60 cursor-not-allowed transform-none hover:shadow-lg" : ""}
              `}
              disabled={!accountData.length || amount < 1 || !selectedBankAccountId}
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
