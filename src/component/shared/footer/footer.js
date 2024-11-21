import React from "react";
import footerImg from "../../../../src/assets/img/footer-img.png";
import { ReactComponent as AllatreLogoWhite } from "../../../../src/assets/logo/allatre-logo-white.svg";
import useGetGatogry from "../../../hooks/use-get-category";
import {
  FaInstagram,
  FaFacebookF,
  FaFacebookSquare,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaWhatsapp,
  FaWhatsappSquare,
  FaTelegramPlane,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";
import routes from "../../../routes";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

const Footer = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { pathname } = useLocation();

  return (
    <div className={pathname.startsWith(routes.app.home) ? "" : "hidden "}>
      <div className="relative mt-10">
        <img
          className="w-full h-[209px] object-cover"
          src={footerImg}
          alt="footerImg"
        />
        <div className="">
          <div className="absolute lg:bottom-9 bottom-20 lg:ltr:left-24 ltr:left-2 lg:rtl:right-24 rtl:right-2">
            <h1 className="md:text-2xl text-base text-white font-medium ">
              {selectedContent[localizationKeys.weAreAlwaysHereToHelpYou]}
            </h1>
            <p className="md:text-base text-sm text-white font-normal pt-4 ">
              {
                selectedContent[
                  localizationKeys.subscribeNowToGetNewOffersAndUpdates
                ]
              }
              {selectedContent[localizationKeys.Bysubscribingyounevermissbeat]}
              <br></br>
              {
                selectedContent[
                  localizationKeys
                    .Stayinformedaboutourlatestproductarrivalsspecialpromotionsandseasonalsales
                ]
              }
            </p>
          </div>
          <div className="flex gap-5 absolute lg:ltr:right-24 ltr:right-2 lg:rtl:left-24 rtl:left-2 lg:bottom-20 bottom-5 ">
            <input
              className="sm:w-[400px] w-[200px] md:h-[48px] h-[32px] rounded-lg px-4 outline-none"
              placeholder={selectedContent[localizationKeys.writeYourMail]}
            />
            <button className="bg-primary hover:bg-primary-dark rounded-lg w-[136px] md:h-[48px] h-[32px] text-white ">
              {selectedContent[localizationKeys.subscribe]}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-t from-secondary to-[#001248] opacity-95 h-[200] overflow-hidden">
        <div className="flex flex-wrap gap-x-24 md:mx-24 mx-2 pt-[60px] ml-auto">
          <AllatreLogoWhite />

          <div className="flex  gap-x-20 mt-5 md:mt-0 ml-auto">
            <div className="">
              <h1 className="text-white font-bold text-base">
                {selectedContent[localizationKeys.address]}
              </h1>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                Julphar Tower, Office Number: 504,
                <br />
                Ras Al Khaimah,
                <br />
                United Arab Emirates
              </p>
            </div>
            <div className="">
              <h1 className="text-white font-bold text-base">
                {selectedContent[localizationKeys.contactUs]}
              </h1>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.eMail]}: info@alletre.com
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.phoneNumber]}: +971 72663004
              </p>
            </div>
          </div>
        </div>

        <div className="relative rtl:-left-[185px] h-[150px]">
          <div className="relative h-[200px]">
            {/* Horizontal Line */}
            <div className="absolute inset-0 flex items-center">
              <hr className="w-full border-t border-white" />
            </div>

            {/* Icons Container */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="flex flex-row gap-x-4 sm:gap-x-8 bg-transparent p-2 sm:p-4 bg-gradient-to-t from-secondary to-[#000515]">
                {/* Facebook Page */}
                <a
                  href="https://www.facebook.com/alletr.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Page"
                >
                  <FaFacebookF
                    className="cursor-pointer text-gray-500 hover:text-white"
                    size={25}
                    title="Facebook Page"
                  />
                </a>

                {/* Facebook Group */}
                <a
                  href="https://www.facebook.com/groups/423508893775890"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Group"
                >
                  <FaFacebookSquare
                    className="cursor-pointer text-gray-500 hover:text-white"
                    size={25}
                    title="Facebook Group"
                  />
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/alletr.ae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram
                    className="cursor-pointer text-gray-500 hover:text-white"
                    size={25}
                    title="Instagram"
                  />
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@Alletre_ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <FaYoutube
                    className="cursor-pointer text-gray-500 hover:text-white"
                    size={25}
                    title="YouTube"
                  />
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@alletre.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                >
                  <FaTiktok
                    className="cursor-pointer text-gray-500 hover:text-white"
                    size={25}
                    title="TikTok"
                  />
                </a>

                {/* Snapchat */}
                <a
                  href="https://www.snapchat.com/add/alletre"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Snapchat"
                >
                  <FaSnapchatGhost
                    className="cursor-pointer text-gray-500 hover:text-white"
                    size={25}
                    title="Snapchat"
                  />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/97172663004"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp
                    className="cursor-pointer text-gray-500 hover:text-white"
                    size={25}
                    title="WhatsApp"
                  />
                </a>
                {/* WhatsApp Channel */}
                <a
                  href="https://whatsapp.com/channel/0029Valpc9dLI8YQT9VNDk1R"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Channel"
                >
                  <FaWhatsappSquare
                    className="cursor-pointer text-gray-500 hover:text-white"
                    size={25}
                    title="WhatsApp Channel"
                  />
                </a>
                {/* Telegram */}
                <a
                  href="http://t.me/Alletre"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <FaTelegramPlane
                    className="cursor-pointer text-gray-500 hover:text-white"
                    size={25}
                    title="Telegram"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-secondary h-[28px] text-gray-med/50 flex justify-center items-center ">
        {selectedContent[localizationKeys.allRightsReserved]}
      </div>
    </div>
  );
};

export default Footer;
