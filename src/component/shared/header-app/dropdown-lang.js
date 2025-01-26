import { useLanguage } from "../../../context/language-context";
import En from "../../../../src/assets/icons/En_icon.png";
import Ar from "../../../../src/assets/icons/Ar_icon.png";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { useState } from "react";

const DropdownLang = ({ className }) => {
  const [lang, setLang] = useLanguage("");
  const [isOpen, setIsOpen] = useState(false);
  const selectedContent = content[lang];

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div
      dir="ltr"
      className={`relative flex items-center justify-center ${className}`}
    >
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <img
          src={lang === "en" ? En : Ar}
          alt={lang === "en" ? "English" : "Arabic"}
          className="w-6 h-6"
        />
        <span className="hidden sm:inline-block ml-2">
          {
            selectedContent[
              localizationKeys[lang === "en" ? "english" : "arabic"]
            ]
          }
        </span>
      </div>
      {isOpen && (
        <div
          className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-1 z-10 
                   right-0 sm:left-0 sm:right-auto w-32 lg:w-40"
          style={{
            [lang === "ar" ? "left" : "right"]: "auto",
            [lang === "en" ? "right" : "left"]: "0",
          }}
        >
          <div
            className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setLang("en");
              setIsOpen(false);
            }}
          >
            <div className="flex items-center justify-center w-6 h-6 mr-2">
              <img
                src={En}
                alt="English"
                className="w-full h-full object-contain"
              />
            </div>
            <span>{selectedContent[localizationKeys.english]}</span>
          </div>
          <div
            className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setLang("ar");
              setIsOpen(false);
            }}
          >
            <div className="flex items-center justify-center w-6 h-6 mr-2">
              <img
                src={Ar}
                alt="Arabic"
                className="w-full h-full object-contain"
              />
            </div>
            <span>{selectedContent[localizationKeys.arabic]}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownLang;
