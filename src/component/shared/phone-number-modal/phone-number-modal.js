import React from "react";
import { Modal } from "semantic-ui-react";
import localizationKeys from "../../../localization/localization-keys";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";

const PhoneNumberModal = ({ openModal, phoneNumber, setOpen }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <Modal
      open={openModal}
      onClose={() => setOpen(false)}
      className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full sm:w-96 max-w-sm transition-transform transform scale-100 duration-300 ease-in-out"
    >
      {/* Modal Content */}

      <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        {selectedContent[localizationKeys.contactNumber]}
      </h3>
      <p className="text-gray-700 mb-4 text-lg text-center">
        {selectedContent[localizationKeys.youCanConnectOn]}{" "}
        <strong className="text-primary">{phoneNumber}</strong>
      </p>
      <p className="text-gray-600 mb-6 italic text-md text-center">
      {selectedContent[localizationKeys.DontForgetToMention]}{" "}
        <strong className="text-primary">{selectedContent[localizationKeys.alletre]}</strong> {selectedContent[localizationKeys.whenYouCall]}
      </p>
      <div className="flex justify-center space-x-3 pt-6">
        <button
          onClick={() => setOpen(false)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
        >
          {selectedContent[localizationKeys.close]}
        </button>
        <a
          href={`tel:${phoneNumber}`}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          {selectedContent[localizationKeys.callNow]}
        </a>
      </div>
    </Modal>
  );
};

export default PhoneNumberModal;
