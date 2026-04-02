import React from "react";
import { Modal } from "semantic-ui-react";
import localizationKeys from "../../../localization/localization-keys";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";

const ConfirmationModal = ({ open, onClose, onConfirm, message, title }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <Modal
      className="sm:w-[400px] w-full h-auto bg-transparent scale-in"
      onClose={onClose}
      open={open}
    >
      <div className="sm:w-[400px] w-full h-auto border-2 border-primary rounded-2xl bg-background pb-6 pt-4">
        <h1 className="text-black dark:text-primary-veryLight font-semibold text-lg text-center">
          {title || selectedContent[localizationKeys.confirmDeleteAddressHeading]}
        </h1>
        <p className="text-gray-dark dark:text-primary-veryLight text-center mx-8 text-base font-normal pt-4">
          {message}
        </p>
        <div className="flex justify-center gap-x-6 pt-6">
          <button
            onClick={onClose}
            className="border-primary dark:border-gray-600 text-gray-700 dark:text-white border-[1px] w-[120px] h-[30px] md:h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:border-primary-dark hover:text-primary"
          >
            {selectedContent[localizationKeys.cancel]}
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white w-[120px] h-[30px] md:h-[40px] rounded-lg text-base font-normal hover:bg-red-600"
          >
            {selectedContent[localizationKeys.delete]}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
