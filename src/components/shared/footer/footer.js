import React from "react";
import footerImg from "../../../../src/assets/img/footer-img.png";
import { ReactComponent as AllatreLogoWhite } from "../../../../src/assets/logo/allatre-logo-white.svg";
import useGetGatogry from "../../../hooks/use-get-category";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import routes from "../../../routes";

const Footer = () => {
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { pathname } = useLocation();

  return (
    <div
      className={
        pathname.startsWith(routes.app.profile.default) ? "hidden" : ""
      }
    >
      <div className="relative ">
        <img
          className="w-full h-[209px] object-cover"
          src={footerImg}
          alt="footerImg"
        />
        <div className="">
          <div className="absolute bottom-9 left-24  ">
            <h1 className="text-2xl text-white font-medium ">
              We're Always Here To Help You...
            </h1>
            <p className="text-base text-white font-normal pt-4 ">
              Subscribe Now to Get new offers and updates <br></br>Lorem ipsum
              dolor sit amet, consetetur sadipscing elitr, sed diam<br></br>
              nonumy eirmod tempor
            </p>
          </div>
          <div className="flex gap-5 absolute right-24 bottom-20">
            <input
              className="w-[400px] h-[48px] rounded-lg px-4 outline-none"
              placeholder="Write your mail..."
            />
            <button className="bg-primary hover:bg-primary-dark rounded-lg w-[136px] h-[48px] text-white ">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-t from-secondary to-[#001248] opacity-95 h-[376px] overflow-hidden">
        <div className="flex gap-x-24 mx-24 pt-[82px]">
          <AllatreLogoWhite />
          <div className="flex gap-x-14">
            <div>
              <h1 className="text-white font-bold text-base">Categories</h1>
              {GatogryOptions.map((CategoryName) => (
                <p
                  key={CategoryName?.text}
                  className="cursor-pointer font-normal text-base text-gray-med py-0.5"
                >
                  {CategoryName?.text}
                </p>
              ))}
            </div>
            <div>
              <h1 className="text-white font-bold text-base">
                Selling on Allatre
              </h1>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                Seller Center
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                Sell for charity
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                Business tools
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                Create Auction
              </p>
            </div>
            <div>
              <h1 className="text-white font-bold text-base">My Account</h1>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                I'm Bidding On
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                I've Bought
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                Bids I've Received
              </p>
              <p className="cursor-pointer font-normal text-base text-gray-med py-0.5">
                I've Sold
              </p>
            </div>
          </div>
        </div>
        <div className="relative -right-[685px]">
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
        All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
