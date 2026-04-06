import React from "react";

import oAuthImg from "../../../src/assets/images/reset_password.png";
import oAuthFooterImg from "../../../src/assets/img/o-auth-path-footer.svg";

import { ReactComponent as AllatreLogoWhite } from "../../../src/assets/logo/3arbon-main.svg";
import { Dropdown, Tab } from "semantic-ui-react";
import ForgetPassword from "../../component/O-Auth-components/forget-password";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const ResetPasswordPage = () => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];
  const panes = [
    {
      menuItem: `${selectedContent[localizationKeys.resetPassword]}`,
      render: () => (
        <div>
          <Tab.Pane className="border-none h-full animate-in pt-2 flex justify-center ">
            <ForgetPassword />
          </Tab.Pane>
        </div>
      ),
    },
  ];
  return (
    <div className="animate-in min-h-screen bg-[#2A3A54] overflow-x-hidden">
      <div className="flex flex-col w-full h-full">
        {/* Banner Section */}
        <div className="relative w-full h-[250px] md:h-[350px]">
          <img
            className="w-full h-full object-cover opacity-90"
            src={oAuthImg}
            alt="oAuthImg"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2A3A54]"></div>
          
          <AllatreLogoWhite
            className="absolute z-10 top-1/2 left-4 md:left-20 transform -translate-y-1/2 w-32 md:w-48"
            alt="allatreLogoWhite"
          />
          
          <div className="absolute top-6 right-6 md:right-20 z-20">
            <Dropdown
              className="text-white font-bold tracking-widest text-xs uppercase"
              text={lang === "en" ? "Language" : "اللغة"}
            >
              <Dropdown.Menu className="bg-[#39485C] border-[#d4af37]/30 border shadow-2xl">
                <Dropdown.Item
                  className="text-white hover:bg-[#d4af37]/10 py-3"
                  onClick={() => setLang("en")}
                >
                  English
                </Dropdown.Item>
                <Dropdown.Item
                  className="text-white hover:bg-[#d4af37]/10 py-3 border-t border-[#d4af37]/10"
                  onClick={() => setLang("ar")}
                >
                  العربية
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative -mt-16 md:-mt-24 px-4 md:px-20 pb-20 flex flex-col items-center">
          <div className="w-full max-w-[650px]">
            <Tab
              menu={{
                secondary: true,
                pointing: true,
                className: "custom-reset-tab flex border-b border-[#39485C]!important",
              }}
              panes={panes}
            />
          </div>
        </div>

        {/* CSS for custom Tab styling since Semantic UI is hard to override with just TailWind */}
        <style>{`
          .custom-reset-tab.ui.secondary.pointing.menu {
            border-bottom: 2px solid #39485C !important;
          }
          .custom-reset-tab.ui.secondary.pointing.menu .item {
            color: #8B9BB4 !important;
            font-weight: bold !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            font-size: 14px !important;
            padding: 15px 30px !important;
            border-bottom: 2px solid transparent !important;
          }
          .custom-reset-tab.ui.secondary.pointing.menu .item.active {
            color: #d4af37 !important;
            border-color: #d4af37 !important;
          }
          .ui.segment.active.tab {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        `}</style>

        {/* Footer Image Decorative - Positioned absolute to avoid white gaps */}
        <img
          className="fixed bottom-0 left-0 w-full h-auto opacity-20 pointer-events-none -z-10"
          src={oAuthFooterImg}
          alt="oAuthFooterImg"
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
