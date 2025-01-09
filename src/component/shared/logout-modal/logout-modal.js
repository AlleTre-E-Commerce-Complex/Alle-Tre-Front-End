import React from "react";
import { Modal } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

const LogoutModal = ({ open, setOpen, onLogout }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <Modal
      className="sm:w-[400px] w-full h-auto bg-transparent scale-in"
      onClose={() => setOpen(false)}
      open={open}
    >
      <div className="sm:w-[400px] w-full h-auto  rounded-2xl bg-background pb-6 pt-4">
        <h1 className="text-black font-semibold text-lg text-center">
        {selectedContent[localizationKeys.confirmLogout]}
         
        </h1>
        <p className="text-gray-dark text-center mx-8 text-base font-normal pt-4">
          {selectedContent[localizationKeys.areYouSureYouWantToLogOut]}

        </p>
        <div className="flex justify-center gap-x-6 pt-6">
          <button
            onClick={() => setOpen(false)}
            className="border-gray-400 text-gray-700 border-[1px] w-[120px] h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:border-red-600 hover:text-red-600"
          >
            {selectedContent[localizationKeys.cancel]}
          </button>
          <button
            onClick={onLogout}
            className="bg-primary text-white w-[120px] h-[40px] rounded-lg text-base font-normal"
          >
            {selectedContent[localizationKeys.logOut]}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
