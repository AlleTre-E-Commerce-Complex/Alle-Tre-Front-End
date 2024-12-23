import { Dropdown } from "semantic-ui-react";
import En from "../../../../src/assets/icons/En_icon.png";
import Ar from "../../../../src/assets/icons/Ar_icon.png";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";

const DropdownLang = ({ className }) => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];
  const langOptions = [
    {
      key: "English",
      text: <span className="hidden sm:inline">{selectedContent[localizationKeys.english]}</span>,
      value: "en",
      image: <img className="w-6 h-6 mt-[.5px]" src={En} alt="en" />,
    },
    {
      key: "Arabic",
      text: <span className="hidden sm:inline">{selectedContent[localizationKeys.arabic]}</span>,
      value: "ar",
      image: <img className="w-6 h-6 mt-[.5px]" src={Ar} alt="en" />,
    },
  ];

  return (
    <div dir="ltr">
      <Dropdown
        className={`${className} `}
        inline
        options={langOptions}
        defaultValue={
          lang === "en" ? langOptions[0].value : langOptions[1].value
        }
        onChange={(e, { value }) => setLang(value)}
      />
    </div>
  );
};
export default DropdownLang;
