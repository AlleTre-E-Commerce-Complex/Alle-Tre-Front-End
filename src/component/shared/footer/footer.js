import React, { useState, useEffect } from "react";
import axios from "axios";
import footerImg from "../../../../src/assets/images/subscribeImg.png";
import footerImgAr from "../../../../src/assets/images/subscribeImgMobAr.png";
import footerMob from "../../../../src/assets/images/subscribeImgMob.png";
import footerMobAr from "../../../../src/assets/images/subscribeImgMobAr.png";
import { ReactComponent as AllatreLogoWhite } from "../../../../src/assets/logo/3arbon-main.svg";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaWhatsapp,
  FaTelegramPlane,
  FaFileAlt,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import routes from "../../../routes";
import useAxios from "hooks/use-axios";
import api from "api";
import { Dimmer } from "semantic-ui-react";
import LoadingTest3arbon from "../lotties-file/loading-test-3arbon";
import toast from "react-hot-toast";
import TermsAndConditions from "../terms-and-condition/TermsAndCondition";
import PrivacyPolicy from "../privacy-policy/privacy-policy";

const Footer = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { pathname } = useLocation();
  const [email, setEmail] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 968);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { run: runNewSubscriber, isLoading: isLoadingrunNewSubscriber } =
    useAxios([]);
  const HandleSubscribe = () => {
    runNewSubscriber(axios.post(`${api.app.subscribers.create}`, { email }))
      .then((res) => {
        if (res.data.success) {
          setEmail("");
          toast.success(
            selectedContent[localizationKeys.subscribedSuccessfully],
          );
        }
      })
      .catch((err) => {
        if (lang === "en") {
          toast.error(err.message.en || err.message[0]);
        } else {
          toast.error(err.message.ar || err.message[0]);
        }
      });
  };
  // Hide footer for non-home routes
  if (!pathname.startsWith(routes.app.home)) return null;

  return (
    <div className="bg-white dark:bg-background transition-colors duration-300">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingrunNewSubscriber}
        inverted
      >
        {/* <Loader active /> */}
        <LoadingTest3arbon />
      </Dimmer>
      {/* Banner Section */}
      <div className="relative px-2 sm:px-4 md:px-8 lg:px-12 pt-4 pb-8">
        <img
          className="w-full h-auto object-cover rounded-[27px] md:rounded-[45px] lg:rounded-[50px] shadow-lg"
          src={
            lang === "en"
              ? isMobile
                ? footerMob
                : footerImg
              : isMobile
                ? footerMobAr
                : footerImgAr
          }
          alt="Footer Banner"
        />
        <div className="absolute flex flex-col items-center sm:items-start gap-1 sm:gap-2 top-[70%] sm:top-[80%] left-1/2 sm:left-[60%] md:left-[65%] lg:left-[70%] transform -translate-x-1/2 -translate-y-1/2 w-[80%] sm:w-auto z-10">
          <div className="flex w-full shadow-xl sm:shadow-2xl border-[2px] sm:border-[3px] border-white">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-0 sm:w-[350px] md:h-[54px] h-[36px] sm:h-[44px] px-2 sm:px-6 bg-[#39485C] text-white placeholder-[#8B9BB4] focus:outline-none uppercase tracking-widest text-[9px] sm:text-xs md:text-sm border-none"
              placeholder={
                selectedContent[localizationKeys.writeYourMail] ||
                "YOUR EMAIL ADDRESS"
              }
            />
            <button
              onClick={HandleSubscribe}
              className="bg-[#d4af37] hover:bg-[#c29f2f] shrink-0 w-[90px] sm:w-[130px] md:w-[160px] md:h-[54px] h-[36px] sm:h-[44px] text-primary-dark font-bold uppercase tracking-[0.05em] sm:tracking-widest text-[9px] sm:text-xs md:text-sm transition-colors duration-300"
            >
              {selectedContent[localizationKeys.subscribe]}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Content Section */}
      <div className="bg-primary-dark min-h-[200px] overflow-hidden mt-12 md:mt-4">
        <div className="flex flex-wrap gap-x-24 md:mx-24 mx-2 pt-[30px] md:pt-[60px]">
          <AllatreLogoWhite className="hidden md:block md:w-[110px] lg:w-[130px]"/>
          <div className="flex gap-x-20 mt-5 md:mt-0 ml-auto">
            {/* Address Section */}
            <div>
              <h1 className="text-yellow font-bold text-base">
                {selectedContent[localizationKeys.address]}
              </h1>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.building]}
                <br />
                {selectedContent[localizationKeys.place]}
                <br />
                {selectedContent[localizationKeys.uae]}
              </p>
            </div>

            {/* Contact Section */}
            <div>
              <h1 className="text-yellow font-bold text-base">
                {selectedContent[localizationKeys.contactUs]}
              </h1>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.eMail]}: info3arbon@gmail.com
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.phoneNumber]}: +971 0501400414
              </p>
              <div className="mt-4">
                <a
                  href="https://firebasestorage.googleapis.com/v0/b/alletre-auctions.firebasestorage.app/o/3arbonCompany%20Profile.pdf?alt=media&token=3e2498ac-0a8c-4360-909a-78cee34ac4a2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/30  text-white px-3 py-1.5 rounded transition-all duration-300 group"
                >
                  <FaFileAlt className="text-sm" />
                  <span className="text-sm">
                    {selectedContent[localizationKeys.companyProfile]}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-black/50 rounded">
                    PDF
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Icons Section */}
        <div className="relative rtl:left-[10px] h-[100px]">
          <div className="relative h-[100px]">
            <div className="absolute inset-0 flex items-center">
              <hr className="w-full border-t border-primary-light" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="flex flex-row-reverse rtl:flex-row rounded-lg gap-x-4 sm:gap-x-8 bg-primary-dark p-4 opacity-97">
                {[
                  // {
                  //   icon: FaFacebookF,
                  //   link: "https://www.facebook.com/alletr.ae",
                  // },
                  {
                    icon: FaInstagram,
                    link: "https://www.instagram.com/3arbon.ae/",
                  },
                  // {
                  //   icon: FaYoutube,
                  //   link: "https://www.youtube.com/@Alletre_ae",
                  // },
                  {
                    icon: FaTiktok,
                    link: "https://www.tiktok.com/@3arbon.ae",
                  },
                  // {
                  //   icon: FaSnapchatGhost,
                  //   link: "https://www.snapchat.com/add/alletre",
                  // },
                  // { icon: FaWhatsapp, link: "https://wa.me/971502663180" },
                  // {
                  //   icon: FaWhatsappSquare,
                  //   link: "https://whatsapp.com/channel/0029Valpc9dLI8YQT9VNDk1R",
                  // },
                  // { icon: FaTelegramPlane, link: "http://t.me/Alletre" },
                ].map(({ icon: Icon, link }, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-primary-light hover:text-white"
                  >
                    <Icon size={25} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-white flex justify-center items-center space-x-2 pb-5">
          <TermsAndConditions isFooter={true} />
          <span className=" mt-6">|</span>
          <PrivacyPolicy isFooter={true} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
