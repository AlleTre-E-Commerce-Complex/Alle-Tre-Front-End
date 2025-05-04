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
import LodingTestAllatre from "../lotties-file/loding-test-allatre";

export function DeleteAccountModal({ open, onClose }) {
  const { run: runDeleteProfile, isLoading: isLoadingProfile } = useAxios([]);
  const { logout } = useAuthState();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const handleUpdateUserBlockStatus = () => {
    const isBlocked = false;
    runDeleteProfile(
      authAxios
        .patch(`${api.app.updateUserBlockStatus(isBlocked)}`)
        .then((res) => {
          if (res?.data?.success) {
            toast.success("Deletion success");
            logout();
          } else {
            toast.error(`Deletion failed`);
          }
        })
    );
    onClose();
  };

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingProfile}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <Modal
        className="sm:w-[400px] w-full h-auto bg-transparent scale-in"
        onClose={onClose}
        open={open}
      >
        <div className="sm:w-[450px] w-full h-auto border-2 border-primary rounded-2xl bg-background pb-6 pt-4">
          <h1 className="text-primary font-semibold text-lg text-center flex items-center justify-center gap-2 mt-2">
            <svg
              className="w-6 h-6"
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
            {selectedContent[localizationKeys.confirmDeletion]}
          </h1>
          <p className="text-gray-dark text-center mx-8 text-base font-normal pt-4">
            {
              selectedContent[
                localizationKeys
                  .areYouSureYouWantToDeleteYourAccountThisActionCannotBeUndoneAndYouWillLoseAllYourData
              ]
            }
          </p>
          <div className="flex justify-center gap-x-6 pt-6">
            <button
              onClick={onClose}
              className="border-gray-400 text-gray-700 border-[1px] w-[120px] h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:border-primary hover:text-primary"
            >
              {selectedContent[localizationKeys.cancel]}
            </button>
            <button
              onClick={handleUpdateUserBlockStatus}
              disabled={isLoadingProfile}
              className="bg-primary hover:bg-primary-dark text-white w-[120px] h-[40px] rounded-lg text-base font-normal disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoadingProfile
                ? "Deleting..."
                : selectedContent[localizationKeys.deleteAccount]}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
