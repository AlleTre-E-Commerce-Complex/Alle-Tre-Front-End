import React, { useState, useEffect } from "react";
import axios from "axios";
import footerImg from "../../../../src/assets/images/footerImg2.jpg";
import footerImgAr from "../../../../src/assets/images/footerImgAr2.jpg";
import footerMob from "../../../../src/assets/images/footerMob.jpg";
import footerMobAr from "../../../../src/assets/images/footerMobAr.jpg";
import { ReactComponent as AllatreLogoWhite } from "../../../../src/assets/logo/allatre-logo-white.svg";
import { FaInstagram, FaFacebookF, FaYoutube, FaTiktok, FaSnapchatGhost, FaWhatsapp,  FaTelegramPlane, FaFileAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import routes from "../../../routes";
import useAxios from "hooks/use-axios";
import api from "api";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
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
            selectedContent[localizationKeys.subscribedSuccessfully]
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
    <div className="mt-10">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingrunNewSubscriber}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      {/* Banner Section */}
      <div className="relative">
        <img
          className="w-full h-[209px] object-fill"
          src={lang === "en" ? (isMobile ? footerMob : footerImg) : (isMobile ? footerMobAr : footerImgAr)}
          alt="Footer Banner"
        />
        <div className="absolute flex gap-5 bottom-5 right-4 lg:bottom-20 lg:ltr:right-24">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sm:w-[300px] w-[200px] md:h-[48px] h-[38px] rounded-lg px-4 bg-white border rounded-lg shadow-xl"
            placeholder={selectedContent[localizationKeys.writeYourMail]}
          />
          <button
            onClick={HandleSubscribe}
            className="bg-primary hover:bg-primary-dark rounded-lg w-[136px] md:h-[48px] h-[38px] text-white"
          >
            {selectedContent[localizationKeys.subscribe]}
          </button>
        </div>
      </div>

      {/* Footer Content Section */}
      <div className="bg-gradient-to-t from-[#681224] to-secondary opacity-95 h-[200] overflow-hidden">
        <div className="flex flex-wrap gap-x-24 md:mx-24 mx-2 pt-[30px] md:pt-[60px]">

          <AllatreLogoWhite />
          <div className="flex gap-x-20 mt-5 md:mt-0 ml-auto">
            {/* Address Section */}
            <div>
              <h1 className="text-white font-bold text-base">
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
              <h1 className="text-white font-bold text-base">
                {selectedContent[localizationKeys.contactUs]}
              </h1>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.eMail]}: info@alletre.com
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.phoneNumber]}: +971 72663004
              </p>
              <div className="mt-4">
                <a
                  href="https://firebasestorage.googleapis.com/v0/b/alletre-auctions.firebasestorage.app/o/company%20profile.pdf?alt=media&token=50e5e0cd-156a-4231-8fbe-2008ec81d26c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/30  text-white px-3 py-1.5 rounded transition-all duration-300 group"
                >
                  <FaFileAlt className="text-sm" />
                  <span className="text-sm">{selectedContent[localizationKeys.companyProfile]}</span>
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
              <hr className="w-full border-t border-white" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="flex flex-row-reverse rtl:flex-row rounded-lg gap-x-4 sm:gap-x-8 bg-gradient-to-t from-[#3c0b11] to-[#1a090a] p-4 opacity-97">
                {[
                  {
                    icon: FaFacebookF,
                    link: "https://www.facebook.com/alletr.ae",
                  },
                  {
                    icon: FaInstagram,
                    link: "https://www.instagram.com/alletre.ae/",
                  },
                  {
                    icon: FaYoutube,
                    link: "https://www.youtube.com/@Alletre_ae",
                  },
                  {
                    icon: FaTiktok,
                    link: "https://www.tiktok.com/@alletre.ae",
                  },
                  {
                    icon: FaSnapchatGhost,
                    link: "https://www.snapchat.com/add/alletre",
                  },
                  { icon: FaWhatsapp, link: "https://wa.me/971502663180" },
                  // {
                  //   icon: FaWhatsappSquare,
                  //   link: "https://whatsapp.com/channel/0029Valpc9dLI8YQT9VNDk1R",
                  // },
                  { icon: FaTelegramPlane, link: "http://t.me/Alletre" },
                ].map(({ icon: Icon, link }, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-gray-500 hover:text-white"
                  >
                    <Icon size={25} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-[10x] text-gray-med/50 flex justify-center items-center space-x-2 ">
          <TermsAndConditions isFooter={true} />
          <span className=" mt-6">|</span>
          <PrivacyPolicy isFooter={true} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
