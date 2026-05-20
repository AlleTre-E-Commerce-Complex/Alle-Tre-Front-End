import { useLanguage } from "context/language-context";
import useAxios from "hooks/use-axios";
import content from "localization/content";
import React, { useState } from "react";
import { Dimmer, Modal } from "semantic-ui-react";
import LoadingTest3arbon from "../lotties-file/loading-test-3arbon";
import { authAxios } from "config/axios-config";
import localizationKeys from "../../../localization/localization-keys";
import api from "api";
import SuccessModal from "../successModal/SuccessModal";
import toast from "react-hot-toast";
import routes from "routes";
import { BsBank2 } from "react-icons/bs";

const AddNewBankModal = ({ open, setOpen }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run, isLoading } = useAxios([]);

  const [accountHolderName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
  });

  const validateFields = () => {
    const newErrors = {};

    // Validate accountHolderName: only letters allowed
    if (!accountHolderName) {
      newErrors.accountHolderName = "Account holder name is required";
    } else if (!/^[A-Za-z\s]+$/.test(accountHolderName)) {
      newErrors.accountHolderName =
        "Account holder name should contain only letters";
    }

    // Validate bankName: cannot be empty
    if (!bankName) {
      newErrors.bankName = "Bank name is required";
    } else if (!/^[A-Za-z\s]+$/.test(bankName)) {
      newErrors.bankName = "Bank name can only contain letters and spaces";
    }

    // Validate accountNumber: must be exactly 16 digits
    if (!accountNumber) {
      newErrors.accountNumber = "Account number is required";
    } else if (!/^\d{8,}$/.test(accountNumber)) {
      newErrors.accountNumber = "Account number must be at least 8 digits";
    }

    // Validate routingNumber: must start with "AE" and be 21 characters
    if (!routingNumber) {
      newErrors.routingNumber = "Routing number is required";
    } else if (!/^AE[A-Za-z0-9]{21}$/.test(routingNumber)) {
      newErrors.routingNumber =
        'Routing number must start with "AE" followed by 21 alphanumeric characters ';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateFields()) return;

    try {
      run(
        authAxios
          .post(api.app.Wallet.addBankAccount, {
            accountHolderName,
            bankName,
            accountNumber,
            routingNumber,
          })
          .then((response) => {
            if (response.data.success) {
              setSuccessModal(true);
            } else {
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
              toast.error("Failed to add bank account");
            }
          })
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process withdrawal");
    }
  };

  if (!open) return null;

  return (
    <Modal
      className="w-full h-auto bg-transparent scale-in max-w-2xl mx-auto"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[60] p-4">
        <Dimmer
          className="fixed w-full h-full top-0 z-[70]"
          active={isLoading}
          inverted
        >
          <LoadingTest3arbon />
        </Dimmer>
        
        <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl w-full overflow-hidden transform transition-all duration-300 max-h-[90vh] flex flex-col relative animate-fade-in-up">
          
          {/* Header section */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-[#1f222d] flex items-center gap-5 sticky top-0 z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#eac566] to-[#d4af37] flex items-center justify-center shadow-lg shadow-[#d4af37]/30 transform -rotate-3">
              <BsBank2 className="text-2xl text-gray-900" />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white font-bold text-2xl m-0 tracking-tight">
                {selectedContent[localizationKeys.AddNewBankAccount]}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Enter your bank details carefully to ensure smooth withdrawals
              </p>
            </div>
          </div>

          <form id="withdrawal-form" className="flex flex-col flex-1 overflow-hidden" onSubmit={handleSubmit}>
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              
              <div className="flex flex-col gap-2">
                <label htmlFor="accountHolderName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {selectedContent[localizationKeys.accountHolderName]}
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  value={accountHolderName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className={`
                    w-full bg-gray-50 dark:bg-[#1f222d] border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 
                    text-base font-medium text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all shadow-inner
                    ${errors.accountHolderName ? 'border-red-500 focus:ring-red-500' : ''}
                  `}
                  placeholder="e.g. John Doe"
                />
                {errors.accountHolderName && (
                  <span className="text-red-500 text-xs font-medium mt-1">{errors.accountHolderName}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="bankName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {selectedContent[localizationKeys.bankName]}
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={`
                    w-full bg-gray-50 dark:bg-[#1f222d] border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 
                    text-base font-medium text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all shadow-inner
                    ${errors.bankName ? 'border-red-500 focus:ring-red-500' : ''}
                  `}
                  placeholder="e.g. Emirates NBD"
                />
                {errors.bankName && (
                  <span className="text-red-500 text-xs font-medium mt-1">{errors.bankName}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="accountNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {selectedContent[localizationKeys.bankAccountNumber]}
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className={`
                    w-full bg-gray-50 dark:bg-[#1f222d] border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 
                    text-base font-medium text-gray-900 dark:text-white font-mono tracking-widest
                    focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all shadow-inner
                    ${errors.accountNumber ? 'border-red-500 focus:ring-red-500' : ''}
                  `}
                  placeholder="0000000000000000"
                />
                {errors.accountNumber && (
                  <span className="text-red-500 text-xs font-medium mt-1">{errors.accountNumber}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="routingNumber" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {selectedContent[localizationKeys.IBANnumber]}
                </label>
                <input
                  type="text"
                  id="routingNumber"
                  name="routingNumber"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  className={`
                    w-full bg-gray-50 dark:bg-[#1f222d] border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 
                    text-base font-medium text-gray-900 dark:text-white font-mono tracking-widest uppercase
                    focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all shadow-inner
                    ${errors.routingNumber ? 'border-red-500 focus:ring-red-500' : ''}
                  `}
                  placeholder="AE0000000000000000000"
                />
                {errors.routingNumber && (
                  <span className="text-red-500 text-xs font-medium mt-1">{errors.routingNumber}</span>
                )}
              </div>
            </div>

            {/* Footer Section */}
            <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-[#1f222d]/80 flex justify-end gap-4 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-base bg-white dark:bg-[#1a1c23] hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
              >
                {selectedContent[localizationKeys.cancel]}
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl font-bold text-gray-900 text-base shadow-lg transition-all duration-300 bg-gradient-to-r from-[#eac566] to-[#d4af37] hover:shadow-xl hover:shadow-[#d4af37]/40 transform hover:-translate-y-0.5"
              >
                {selectedContent[localizationKeys.AddAccount]}
              </button>
            </div>
          </form>
        </div>
        
        {successModal && (
          <SuccessModal
            open={successModal}
            setOpen={setSuccessModal}
            message={"Success! You have successfully added your bank account!"}
            returnUrl={routes.app.profile.wallet}
            isAddAccount={true}
            closeAddNewBankAccountModal={setOpen}
          />
        )}
      </div>
    </Modal>
  );
};

export default React.memo(AddNewBankModal);
