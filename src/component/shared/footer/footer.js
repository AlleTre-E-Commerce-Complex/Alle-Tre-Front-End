import React from "react";
import footerImg from "../../../../src/assets/img/footer-img.png";
import { ReactComponent as AllatreLogoWhite } from "../../../../src/assets/logo/allatre-logo-white.svg";
import useGetGatogry from "../../../hooks/use-get-category";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { useLocation } from "react-router-dom";
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
              <br></br>{" "}
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
      <div className="bg-gradient-to-t from-secondary to-[#001248] opacity-95 h-[376px] overflow-hidden">
        <div className="flex flex-wrap gap-x-24 md:mx-24 mx-2 pt-[82px]">
          <AllatreLogoWhite />
          <div className="flex gap-x-14 mt-5 md:mt-0">
            <div className="">
              <h1 className="text-white font-bold text-base">
                {selectedContent[localizationKeys.categories]}
              </h1>
              {GatogryOptions.map((CategoryName,index) => (
                <p
                  key={index}
                  className="cursor-pointer font-normal text-base text-gray-med py-0.5 w-fit"
                >
                  {CategoryName?.text}
                </p>
              ))}
            </div>
            <div className="">
              <h1 className="text-white font-bold text-base">
                {selectedContent[localizationKeys.sellingOnAllatre]}
              </h1>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.sellerCenter]}
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.sellForCharity]}
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.businessTools]}
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.createAuction]}
              </p>
            </div>
            <div className="">
              <h1 className="text-white font-bold text-base">
                {selectedContent[localizationKeys.myAccount]}
              </h1>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.iamBiddingOn]}
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.iHaveBought]}
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.bidsIHaveReceived]}
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                {selectedContent[localizationKeys.iHaveSold]}
              </p>
            </div>
          </div>
        </div>
        <div className="relative ltr:-right-[685px] rtl:-left-[685px]">
          <div className="relative -rotate-90 ">
            <hr className="border-white" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 ">
              <span className="text-gray-500 flex flex-col gap-y-5 bg-gradient-to-t from-secondary to-[#001248] ">
                <FaInstagram
                  className="bg-gradient-to-t from-secondary to-[#001248] mt-2 cursor-pointer"
                  size={25}
                />
                <FaLinkedinIn
                  className="bg-gradient-to-t from-secondary to-[#001248] cursor-pointer"
                  size={25}
                />
                <FaFacebookF
                  className="bg-gradient-to-t from-secondary to-[#001248] mb-2 cursor-pointer"
                  size={25}
                />
              </span>
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
