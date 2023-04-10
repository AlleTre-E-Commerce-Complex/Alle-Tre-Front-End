import React, { useEffect, useState } from "react";

import { MdMail } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { RiUser3Fill } from "react-icons/ri";
import { HiLockClosed } from "react-icons/hi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { BsFillTelephoneFill, BsThreeDots } from "react-icons/bs";

import appleIcon from "../../../../src/assets/icons/Apple-icon.svg";
import googleIcon from "../../../../src/assets/icons/Google-icon.svg";
import facebookIcon from "../../../../src/assets/icons/Fcaebook-icon.svg";
import userProfileicon from "../../../../src/assets/icons/user-Profile-icon.png";

import UploadeImgModel from "../../../components/profile-components/uploade-img-model";
import EditPasswordModel from "../../../components/profile-components/edit-password-model";
import EditUserNameModel from "../../../components/profile-components/edit-user-name-model";
import AddLocationModel from "../../../components/create-auction-components/add-location-model";
import EditPhoneNumberModel from "../../../components/profile-components/edit-phone-number-model";

import useFilter from "../../../hooks/use-filter";
import useAxios from "../../../hooks/use-axios";

import { Dimmer, Loader, Popup } from "semantic-ui-react";
import { toast } from "react-hot-toast";

import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import { useLanguage } from "../../../context/language-context";

import { PofileData } from "../../../redux-store/pofile-data-slice";
import { useDispatch } from "react-redux";

const ProfileSettings = () => {
  const [lang] = useLanguage();
  const [open, setOpen] = useState(false);
  const [pofileData, setPofileData] = useState();
  const [locationData, setLocationData] = useState();

  const dispatch = useDispatch();

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const { run: runPofile, isLoading: isLoadingPofile } = useAxios([]);
  useEffect(() => {
    runPofile(
      authAxios.get(api.app.profile.default).then((res) => {
        setPofileData(res?.data?.data);
        dispatch(
          PofileData({
            name: res?.data?.data?.userName,
            img: res?.data?.data?.imageLink,
          })
        );
      })
    );
  }, [runPofile, forceReload]);

  const { run: runLocationData, isLoading: isLoadingLocationData } = useAxios(
    []
  );
  useEffect(() => {
    runLocationData(
      authAxios.get(api.app.location.get).then((res) => {
        setLocationData(
          res?.data?.data?.sort((a, b) => (a.isMain ? -1 : b.isMain ? 1 : 0))
        );
      })
    );
  }, [runLocationData, forceReload]);

  useEffect(() => {
    if (window.location.hash.slice(1) === "AddressBook") {
    } else window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="ml-4 relative animate-in ">
      <Dimmer
        className="animate-pulse"
        active={isLoadingPofile || isLoadingLocationData}
        inverted
      >
        <Loader active />
      </Dimmer>
      {/* complete profile */}
      <div className="rounded-lg drop-shadow-complete-profile shadow  ">
        <h1 className="text-black text-base font-medium pt-12 pl-6">
          Complete your profile to make your actions easier
        </h1>
        <p className="pt-4 text-gray-dark pl-6 pr-14">
          "Your account currently offers access to updates, saved items, sale
          details, and other features. To bid, buy and sell with Alle-tre,
          kindly take a moment to fill out your profile information."
        </p>
        <div className="flex justify-end pr-14 pt-8 pb-8">
          <button className="bg-primary hover:bg-primary-dark text-white rounded-lg w-32 h-8 text-sm font-normal">
            Complete Now
          </button>
        </div>
      </div>
      <div className="bg-background-profile rounded-2xl md:px-20 px-10 pt-16 mt-5 ">
        <div className="flex gap-x-5 pb-8 border-b-[1px] border-gray-veryLight mx-2">
          <img
            className="w-28 h-28 rounded-full object-cover"
            src={
              pofileData?.imageLink ? pofileData?.imageLink : userProfileicon
            }
            alt="userProfileicon"
          />
          <div>
            <h1 className="text-gray-dark md:text-4xl text-2xl font-medium pt-3">
              {pofileData?.userName}
            </h1>
            <UploadeImgModel onReload={onReload} />
          </div>
        </div>
        {/*  Personal Details */}
        <div className="pt-3 border-b-[1px] border-gray-veryLight pb-8 ">
          <h1 className="text-gray-dark text-base font-semibold">
            Personal Details
          </h1>
          <div className="flex justify-between pt-9">
            <div>
              <div className="flex ">
                <p className="bg-primary-light/80 text-white w-9 h-9 rounded-full px-2.5 pt-2 mr-5">
                  <RiUser3Fill size={16} />
                </p>
                <p className="text-gray-dark text-base font-medium  ">
                  User Name
                </p>
              </div>
              <p className="text-gray-dark text-base pl-[64px] ">
                {pofileData?.userName}
              </p>
            </div>
            <div>
              <EditUserNameModel
                onReload={onReload}
                oldName={pofileData?.userName}
              />
            </div>
          </div>
          <div
            className={
              pofileData?.isOAuth ? "hidden" : "flex justify-between pt-9"
            }
          >
            <div>
              <div className="flex ">
                <p className="bg-primary-light/80 text-white w-9 h-9 rounded-full px-2.5 pt-2 mr-5">
                  <HiLockClosed size={16} />
                </p>
                <p className="text-gray-dark text-base font-medium  ">
                  Password
                </p>
              </div>
              <p className="text-gray-dark text-base pl-[64px] ">
                *************
              </p>
            </div>
            <div>
              <EditPasswordModel onReload={onReload} />
            </div>
          </div>
        </div>
        {/* Contact info */}
        <div className="pt-3 border-b-[1px] border-gray-veryLight pb-8 ">
          <h1 className="text-gray-dark text-base font-semibold">
            Contact info
          </h1>
          <div className="flex pt-9">
            <div>
              <div className="flex ">
                <p className="bg-primary-light/80 text-white w-9 h-9 rounded-full px-2.5 pt-2 mr-5">
                  <MdMail size={16} />
                </p>
                <p className="text-gray-dark text-base font-medium">E-mail</p>
              </div>
              <p className="text-gray-dark text-base pl-[64px]  ">
                {pofileData?.email}
              </p>
            </div>
            <div
              className={`${
                pofileData?.isVerified
                  ? "text-green-500"
                  : "text-gray-veryLight"
              } flex gap-x-1 md:ml-[210px] ml-auto`}
            >
              <IoMdCheckmarkCircle size={16} className="mt-0.5" />
              <p className="text-base font-normal">Verified</p>
            </div>
          </div>
          <div className="flex justify-between pt-9">
            <div>
              <div className="flex ">
                <p className="bg-primary-light/80 text-white w-9 h-9 rounded-full px-2.5 pt-2 mr-5">
                  <BsFillTelephoneFill size={16} />
                </p>
                <p className="text-gray-dark text-base font-medium">
                  Phone Number
                </p>
              </div>
              <p className="text-gray-dark text-base pl-[64px]">
                {pofileData?.phone}
              </p>
            </div>
            <div>
              <EditPhoneNumberModel
                onReload={onReload}
                oldPhoneNumber={pofileData?.phone}
              />
            </div>
          </div>
        </div>
        {/* O Auth */}
        <div className="pt-3 border-b-[1px] border-gray-veryLight pb-8">
          <h1 className="text-gray-dark text-base font-semibold">
            Login service
          </h1>
          <p className="text-gray-dark text-base font-normal pt-2">
            Your Alla-tre account does not have an external login service.
            Connect accounts now for quick & secure access.
          </p>
          <div>
            <div className="md:flex block mt-8">
              <Loginbutton
                isActive={pofileData?.oAuthType === "APPLE" ? true : false}
                logo={appleIcon}
                text="Connected with Apple"
              />
              <div
                className={`${
                  pofileData?.oAuthType === "APPLE"
                    ? "text-green-500"
                    : "text-gray-veryLight"
                } md:flex hidden gap-x-1 ml-[71px] my-auto `}
              >
                <IoMdCheckmarkCircle size={16} className="mt-0.5" />
                <p className="text-base font-normal">Connected</p>
              </div>
            </div>
            <div className="md:flex block ">
              <Loginbutton
                isActive={pofileData?.oAuthType === "GOOGLE" ? true : false}
                logo={googleIcon}
                text="Connect with Google"
              />
              <div
                className={`${
                  pofileData?.oAuthType === "GOOGLE"
                    ? "text-green-500"
                    : "text-gray-veryLight"
                } md:flex hidden  gap-x-1 ml-[71px] my-auto`}
              >
                <IoMdCheckmarkCircle size={16} className="mt-0.5" />
                <p className="text-base font-normal">Connected</p>
              </div>
            </div>
            <div className="md:flex block ">
              <Loginbutton
                isActive={pofileData?.oAuthType === "FACEBOOK" ? true : false}
                logo={facebookIcon}
                text="Connect with Facebook"
              />
              <div
                className={`${
                  pofileData?.oAuthType === "FACEBOOK"
                    ? "text-green-500"
                    : "text-gray-veryLight"
                } md:flex hidden gap-x-1 ml-[71px] my-auto`}
              >
                <IoMdCheckmarkCircle size={16} className="mt-0.5" />
                <p className="text-base font-normal">Connected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Book */}
        <div id="AddressBook" className="pt-3  pb-20 mb-10 ">
          <h1 className="text-gray-dark text-base font-semibold">
            Address Book
          </h1>
          <p className="text-gray-dark text-base font-normal pt-2">
            Manage your addresses for a quick and easy checkout experience
          </p>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-6">
            {locationData?.map((e) => {
              return (
                <LocationDetailsCard
                  key={e?.id}
                  Id={e?.id}
                  AddressLable={e?.addressLabel}
                  Address={e?.address}
                  Country={
                    lang === "en" ? e?.country?.nameEn : e?.country.nameAn
                  }
                  City={lang === "en" ? e?.city?.nameEn : e?.city.nameAn}
                  PostalCode={e?.zipCode}
                  isMain={e?.isMain}
                  onReload={onReload}
                />
              );
            })}
            <button
              onClick={() => setOpen(true)}
              className="border-gray-med border-[1px] border-dashed w-[136px] h-[48px] rounded-lg text-base font-normal text-gray-med flex justify-center gap-x-2 "
            >
              <GoPlus className="my-auto" size={16} />
              <p className="my-auto">Add Address</p>
            </button>
            <AddLocationModel
              open={open}
              setOpen={setOpen}
              TextButton={"Add"}
              onReload={onReload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Loginbutton = ({ logo, text, isActive }) => {
  return (
    <div>
      <button
        className={`${
          isActive ? "bg-primary/5" : ""
        } flex justify-start sm:w-[298px] w-full h-[48px] border-[1px] rounded-lg border-primary text-primary my-2 py-2 ltr:pl-[45px] rtl:pr-5`}
      >
        <img className="mx-4 mt-0.5 " src={logo} alt="logo" />
        <p className="text-lg font-medium pt-0.5 ">{text}</p>
      </button>
    </div>
  );
};

export const LocationDetailsCard = ({
  AddressLable,
  Address,
  Country,
  City,
  PostalCode,
  Id,
  key,
  isMain,
  onReload,
}) => {
  const [lang] = useLanguage();
  const [open, setOpen] = useState(false);
  const [locationId, setLocationId] = useFilter("locationId", "");
  const { run: runDelete, isLoading: isLoadingDelete } = useAxios([]);
  const handelDelete = (id) => {
    runDelete(
      authAxios
        .delete(api.app.location.delete(id))
        .then((res) => {
          toast.success(
            "The " + AddressLable + " has been delete successfully"
          );
          setOpen(false);
          onReload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message?.[lang] ||
              err?.response?.data?.message?.[0] ||
              "oops, something with wrong please make sure everything is in the right place and try again "
          );
        })
    );
  };

  const { run: runMakeDefault, isLoading: isLoadingMakeDefault } = useAxios([]);
  const handelMakeDefault = (id) => {
    runMakeDefault(
      authAxios
        .patch(api.app.location.edit(id))
        .then((res) => {
          toast.success(
            "The " + AddressLable + " has been Make Default successfully"
          );
          setOpen(false);
          onReload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message?.[lang] ||
              err?.response?.data?.message?.[0] ||
              "oops, something with wrong please make sure everything is in the right place and try again "
          );
        })
    );
  };

  return (
    <div
      key={key}
      onClick={() => {
        setLocationId(Id);
      }}
      className={`${
        locationId === `${Id}` || isMain
          ? "border-primary-dark"
          : "border-gray-med"
      } border-[1px] rounded-lg  w-full p-5 cursor-pointer`}
    >
      <div className="flex justify-between">
        <h1 className="text-gray-dark text-sm">{AddressLable}</h1>
        <Popup
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          open={open}
          className="bg-white w-auto h-auto  rounded-lg border-none  relative"
          trigger={<BsThreeDots size={20} className="text-gray-med mb-auto" />}
          on="click"
          pinned
          basic
          position="bottom right"
          content={
            isMain ? (
              <p
                onClick={() => handelDelete(Id)}
                className="text-red-500 text-center py-2 cursor-pointer  text-base font-normal ltr:font-serifEN rtl:font-serifAR px-2"
              >
                Delete
              </p>
            ) : (
              <div>
                <p
                  onClick={() => handelMakeDefault(Id)}
                  className="text-gray-med text-center py-2 cursor-pointer  border-b-[1px] text-base font-normal ltr:font-serifEN rtl:font-serifAR"
                >
                  Make Default
                </p>
                <p
                  onClick={() => handelDelete(Id)}
                  className="text-red-500 text-center py-2 cursor-pointer  text-base font-normal ltr:font-serifEN rtl:font-serifAR"
                >
                  Delete
                </p>
              </div>
            )
          }
        />
      </div>
      <p className="text-gray-med text-sm pt-2">{Address}</p>
      <p className="text-gray-med text-sm pt-1">
        {City}, {Country}
      </p>
      <div className="flex justify-between">
        <p className="text-gray-med text-sm pt-1">{PostalCode}</p>
        <p
          className={
            isMain ? "text-primary-dark underline text-sm pt-1" : "hidden"
          }
        >
          Default
        </p>
      </div>
    </div>
  );
};

export default ProfileSettings;
