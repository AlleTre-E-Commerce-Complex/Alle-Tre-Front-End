import React from "react";
import { Dimmer, Modal } from "semantic-ui-react";
import { useLanguage } from ".././../../context/language-context";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";
import api from "../../../api";
import { toast } from "react-toastify";
import { authAxios } from "../../../config/axios-config";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import LoadingTest3arbon from "../lotties-file/loading-test-3arbon";

export function DeleteAccountModal({ open, onClose }) {
  const { run: runDeleteProfile, isLoading: isLoadingProfile } = useAxios([]);
  const { logout } = useAuthState();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const handleUpdateUserBlockStatus = () => {
    // currentStatus = false means we want to toggle it to true (Blocked)
    const currentStatus = false;
    runDeleteProfile(
      authAxios
        .patch(`${api.app.updateUserBlockStatus(currentStatus)}`)
        .then((res) => {
          if (res?.data?.success) {
            toast.success("Deletion success");
            logout();
            onClose();
          } else {
            toast.error(`Deletion failed`);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Deletion failed");
        })
    );
  };

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/40 dark:bg-black/60 backdrop-blur-md transition-all duration-500"
        active={isLoadingProfile}
      >
        <div className="animate-premium-loader">
          <LoadingTest3arbon />
        </div>
      </Dimmer>
      <Modal
        className="sm:w-[450px] w-[90%] h-auto bg-transparent scale-in"
        onClose={onClose}
        open={open}
      >
        <div className="relative overflow-hidden sm:w-[500px] w-full h-auto border border-gray-100 dark:border-white/10 rounded-xl bg-background shadow-2xl transition-all duration-300">
          {/* Subtle decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red/5 dark:bg-red/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative px-8 pt-8 pb-10">
            <div className="flex flex-col items-center">
              <h1 className="text-primary dark:text-white font-bold text-2xl text-center mb-3">
                {selectedContent[localizationKeys.confirmDeletion]}
              </h1>
              <div className="w-16 h-16 bg-red/10 dark:bg-red/20 rounded-xl flex items-center justify-center mb-6 animate-bounce-subtle">
                <svg
                  className="w-8 h-8 text-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              
              <p className="text-primary dark:text-gray-dark text-center text-base leading-relaxed font-medium">
                {
                  selectedContent[
                    localizationKeys
                      .areYouSureYouWantToDeleteYourAccountThisActionCannotBeUndoneAndYouWillLoseAllYourData
                  ]
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <button
                onClick={onClose}
                className="order-2 sm:order-1 flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95"
              >
                {selectedContent[localizationKeys.cancel]}
              </button>
              
              <button
                onClick={handleUpdateUserBlockStatus}
                disabled={isLoadingProfile}
                className="order-1 sm:order-2 flex-1 px-6 py-3 rounded-xl bg-red hover:bg-red-dark text-white font-bold shadow-lg shadow-red/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoadingProfile ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{selectedContent[localizationKeys.deleting]}</span>
                  </span>
                ) : (
                  selectedContent[localizationKeys.delete]
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
