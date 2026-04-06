import React from "react";
import LogIn from "../../component/O-Auth-components/log-in";
import SignUp from "../../component/O-Auth-components/sign-up";
import { Dropdown } from "semantic-ui-react";
// import oAuthImg from "../../../src/assets/img/o-auth-img.png";
import oAuthFooterImg from "../../../src/assets/img/o-auth-path-footer.svg";
import allatreLogoWhite from "../../../src/assets/logo/allatre-logo-white.svg";
import { useLanguage } from "../../context/language-context";

const OAuthpage = () => {
  const [lang, setLang] = useLanguage("");
 
  const [isLoginView, setIsLoginView] = React.useState(true);

  return (
    <div className="animate-in min-h-screen bg-[#1a2639] flex flex-col relative overflow-hidden">
      <div className="w-full flex justify-between absolute top-0 left-0 p-6 z-10 hidden">
        <img
          className="w-32 md:w-40"
          src={allatreLogoWhite}
          alt="allatreLogoWhite"
        />
        <Dropdown
          className="text-lg text-gray-300"
          text={lang === "en" ? "Language" : "اللغة"}
        >
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setLang("en")}>
              English
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setLang("ar")}>
              العربية
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="flex-1 flex justify-center items-center py-10 px-4 md:px-0 relative z-20">
        <div className="w-full max-w-[824px] bg-[#2A3A54] shadow-2xl shadow-black/50 rounded-2xl border border-[#39485C] overflow-hidden">
          {isLoginView ? (
            <LogIn
              isAuthModel={false}
              onToggleView={() => setIsLoginView(false)}
            />
          ) : (
            <SignUp
              isAuthModel={false}
              onToggleView={() => setIsLoginView(true)}
            />
          )}
        </div>
      </div>

      <img
        className="w-full object-cover h-32 md:h-auto absolute bottom-0 z-0 opacity-20 pointer-events-none"
        src={oAuthFooterImg}
        alt="oAuthFooterImg"
      />
    </div>
  );
};

export default OAuthpage;
