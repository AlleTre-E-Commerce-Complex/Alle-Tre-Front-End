import React, { useState } from "react";
import axios from "axios";
import footerImg from "../../../../src/assets/images/footerImg2.jpg";
import { ReactComponent as AllatreLogoWhite } from "../../../../src/assets/logo/allatre-logo-white.svg";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaWhatsapp,
  FaWhatsappSquare,
  FaTelegramPlane,
} from "react-icons/fa";
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

const Footer = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { pathname } = useLocation();
  const [email, setEmail] = useState("");
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
        console.log("response of runNewSubscriber", res);
      })
      .catch((err) => {
        console.log("error of runNewSubscriber", err);
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
          className="w-full h-[209px] object-cover"
          src={footerImg}
          alt="Footer Banner"
        />
        <div className="absolute flex gap-5 bottom-5 right-4 lg:bottom-20 lg:ltr:right-24">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sm:w-[400px] w-[200px] md:h-[48px] h-[32px] rounded-lg px-4 outline-none"
            placeholder={selectedContent[localizationKeys.writeYourMail]}
          />
          <button
            onClick={HandleSubscribe}
            className="bg-primary hover:bg-primary-dark rounded-lg w-[136px] md:h-[48px] h-[32px] text-white"
          >
            {selectedContent[localizationKeys.subscribe]}
          </button>
        </div>
      </div>

      {/* Footer Content Section */}
      <div className="bg-gradient-to-t from-[#681224] to-secondary opacity-95 h-[200] overflow-hidden">
        <div className="flex flex-wrap gap-x-24 md:mx-24 mx-2 pt-[60px]">
          <AllatreLogoWhite />
          <div className="flex gap-x-20 mt-5 md:mt-0 ml-auto">
            {/* Address Section */}
            <div>
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
            </div>
          </div>
        </div>

        {/* Social Media Icons Section */}
        <div className="relative rtl:-left-[185px] h-[150px]">
          <div className="relative h-[200px]">
            <div className="absolute inset-0 flex items-center">
              <hr className="w-full border-t border-white" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="flex flex-row rounded-lg gap-x-4 sm:gap-x-8 bg-[#3c0b11] p-4 opacity-95">
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
                  { icon: FaWhatsapp, link: "https://wa.me/97172663004" },
                  {
                    icon: FaWhatsappSquare,
                    link: "https://whatsapp.com/channel/0029Valpc9dLI8YQT9VNDk1R",
                  },
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
      </div>

      <div className="bg-[#6e1f30] h-[28px] text-gray-med/50 flex justify-center items-center">
        {selectedContent[localizationKeys.allRightsReserved]}
      </div>
    </div>
  );
};

export default Footer;
