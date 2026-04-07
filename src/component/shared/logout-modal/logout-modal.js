import React from "react";
import { Modal } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { RiLogoutCircleLine } from "react-icons/ri";

const LogoutModal = ({ open, setOpen, onLogout }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <Modal
      className="sm:w-[450px] w-full h-auto bg-transparent scale-in"
      onClose={() => setOpen(false)}
      open={open}
    >
      <div className="relative overflow-hidden sm:w-[450px] w-full h-auto border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#1A1F2C] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-primary/5 dark:bg-yellow/5 rounded-full blur-2xl"></div>

        <div className="relative flex flex-col items-center">
          {/* Icon Section */}
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-900/30">
            <RiLogoutCircleLine size={32} />
          </div>

          <h1 className="text-[#34415C] dark:text-white font-bold text-2xl text-center mb-3">
            {selectedContent[localizationKeys.confirmLogout]}
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 text-center text-base font-medium max-w-[280px] leading-relaxed">
            {selectedContent[localizationKeys.areYouSureYouWantToLogOut]}
          </p>

          <div className="flex w-full gap-4 mt-8">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-800/60 active:scale-95"
            >
              {selectedContent[localizationKeys.cancel]}
            </button>
            <button
              onClick={onLogout}
              className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-lg hover:shadow-red-600/20 active:scale-95"
            >
              {selectedContent[localizationKeys.logOut]}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
