import React from "react";
import { Modal } from "semantic-ui-react";
import localizationKeys from "../../../localization/localization-keys";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";

const ConfirmationModal = ({ open, onClose, onConfirm, message }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <Modal
      className="sm:w-[400px] w-full h-auto bg-transparent scale-in"
      onClose={onClose}
      open={open}
    >
      <div className="sm:w-[400px] w-full h-auto rounded-2xl bg-background pb-6 pt-4">
        <h1 className="text-black font-semibold text-lg text-center">
          {selectedContent[localizationKeys.confirmDeleteAddressHeading]}
        </h1>
        <p className="text-gray-dark text-center mx-8 text-base font-normal pt-4">
          {message}
        </p>
        <div className="flex justify-center gap-x-6 pt-6">
          <button
            onClick={onClose}
            className="border-gray-400 text-gray-700 border-[1px] w-[120px] h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:border-red-600 hover:text-red-600"
          >
            {selectedContent[localizationKeys.cancel]}
          </button>
          <button
            onClick={onConfirm}
            className="bg-primary text-white w-[120px] h-[40px] rounded-lg text-base font-normal"
          >
            {selectedContent[localizationKeys.delete]}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
