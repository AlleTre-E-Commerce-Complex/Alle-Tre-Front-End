import React, { useEffect, useState } from "react";

import { MdMail, MdPhotoCamera } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { RiUser3Fill } from "react-icons/ri";
import { HiLockClosed } from "react-icons/hi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { BsFillTelephoneFill, BsThreeDots } from "react-icons/bs";

import { FaApple, FaGoogle } from "react-icons/fa";
import userProfileicon from "../../../../src/assets/icons/user-Profile-icon.png";

import UploadeImgModel from "../../../component/profile-components/uploade-img-model";
import EditPasswordModel from "../../../component/profile-components/edit-password-model";
import EditUserNameModel from "../../../component/profile-components/edit-user-name-model";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import EditPhoneNumberModel from "../../../component/profile-components/edit-phone-number-model";

import useAxios from "../../../hooks/use-axios";

import { Dimmer } from "semantic-ui-react";
import { toast } from "react-hot-toast";

import api from "../../../api";
import { authAxios } from "../../../config/axios-config";
import { useLanguage } from "../../../context/language-context";

import { PofileData } from "../../../redux-store/pofile-data-slice";
import { useDispatch } from "react-redux";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
import ConfirmationModal from "../../../component/shared/delete-modal/delete-modal";
import { DeleteAccountModal } from "../../../component/shared/delete-account-modal/delete-account-modal";

const ProfileSettings = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [open, setOpen] = useState(false);
  const [pofileData, setPofileData] = useState();
  const [locationData, setLocationData] = useState();
  const [IsImgModelOpen, setImgModelOpen] = useState(false);
  // const [IsLocationModelOpen, setLocationModelOpen] = useState(false);

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
            email: res?.data?.data?.email,
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

  const handelCompleteProfle = () => {
    if (locationData.length <= 0 || pofileData?.imageLink) {
      // setImgModelOpen(true);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (window.location.hash.slice(1) === "AddressBook") {
    } else window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoadingPofile || isLoadingLocationData}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mx-4 sm:mx-0 sm:ltr:ml-4 sm:rtl:mr-4  animate-in  ">
        {/* complete profile */}

        <div
          className={`${
            locationData?.length > 0
              ? "hidden"
              : "rounded-lg drop-shadow-complete-profile shadow"
          }`}
        >
          <h1 className="text-black text-base font-medium pt-12 ltr:pl-6 rtl:pr-6">
            {
              selectedContent[
                localizationKeys.completeYourProfileToMakeYourActionsEasier
              ]
            }
          </h1>
          <p className="pt-4 text-gray-dark ltr:pl-6 rtl:pr-6  ltr:pr-14 rtl:pl-16">
            "{selectedContent[localizationKeys.completeNowMasg]}"
          </p>
          <div className="flex justify-end ltr:pr-14 rtl:pl-14 pt-8 pb-8">
            <button
              onClick={() => handelCompleteProfle()}
              className="bg-primary hover:bg-primary-dark text-white rounded-lg w-32 h-8 text-sm font-normal"
            >
              {selectedContent[localizationKeys.completeNow]}
            </button>
          </div>
        </div>
        <div className=" rounded-2xl md:px-2 px-0 pt-6">
          <div className="border border-gray-100 dark:border-gray-800/60 rounded-2xl overflow-hidden mb-8 bg-white dark:bg-primary-dark mx-2 md:mx-0 shadow-sm relative">
            {/* Banner */}
            <div className="h-32 bg-[#34415C] dark:bg-gray-900 w-full relative">
              {/* Optional Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] dark:opacity-5"></div>
            </div>
            
            <div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end">
              {/* Avatar section */}
              <div className="relative -mt-16 z-10 mx-auto md:mx-0">
                <div className="relative inline-block group">
                  <img
                    className="w-32 h-32 rounded-full object-cover border-[6px] border-white dark:border-primary-dark bg-white dark:bg-primary-dark shadow-sm group-hover:opacity-90 transition-opacity"
                    src={
                      pofileData?.imageLink ? pofileData?.imageLink : userProfileicon
                    }
                    alt="userProfileicon"
                  />
                  {/* Verified Badge */}
                  <div className="absolute bottom-2 ltr:right-2 rtl:left-2 bg-[#d6a536] text-white rounded-full flex items-center justify-center w-7 h-7 border-2 border-white dark:border-primary-dark shadow-sm z-10">
                     <IoMdCheckmarkCircle size={18} />
                  </div>
                  {/* Edit Photo Icon Overlay */}
                  <div className="absolute top-2 ltr:-right-2 rtl:-left-2 z-20">
                    <UploadeImgModel
                      onReload={onReload}
                      oldimg={pofileData?.imageLink}
                      IsImgModelOpen={IsImgModelOpen}
                      setImgModelOpen={setImgModelOpen}
                      customTrigger={
                        <button className="bg-white dark:bg-gray-800 text-[#34415C] dark:text-white hover:text-[#d6a536] dark:hover:text-[#d6a536] rounded-full p-2 border-2 border-white dark:border-primary-dark shadow-md transition-all hover:scale-110">
                          <MdPhotoCamera size={18} />
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="mt-4 md:mt-0 ltr:md:ml-6 rtl:md:mr-6 flex-grow text-center md:text-start pb-2">
                <div className="flex justify-center md:justify-start items-center">
                  <h1 className="text-[#34415C] dark:text-white text-2xl md:text-3xl font-bold">
                    {pofileData?.userName || "Abdullah Al-Mansour"}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                  <span className="bg-[#fff8e1] dark:bg-[#d6a536]/10 text-[#d6a536] text-[11px] font-bold px-3 py-1 rounded-full border border-[#fde68a] dark:border-[#d6a536]/30">
                    Verified Member
                  </span>
                  <span className="text-gray-400 text-sm font-medium">
                    Member since {pofileData?.createdAt ? new Date(pofileData?.createdAt).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : "Nov 2022"}
                  </span>
                </div>
              </div>

              {/* Stats */}
              {/* <div className="mt-8 md:mt-0 flex justify-center md:justify-end divide-x divide-gray-200 dark:divide-gray-800 rtl:divide-x-reverse pb-2">
                <div className="px-5 md:px-8 text-center">
                  <p className="text-[#34415C] dark:text-gray-100 text-2xl font-bold">{pofileData?.totalBids || 124}</p>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-1">Total Bids</p>
                </div>
                <div className="px-5 md:px-8 text-center">
                  <p className="text-[#34415C] dark:text-gray-100 text-2xl font-bold">{pofileData?.activeListings || 8}</p>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-1">Active Listings</p>
                </div>
                <div className="ltr:pl-5 md:ltr:pl-8 rtl:pr-5 md:rtl:pr-8 text-center">
                  <p className="text-[#34415C] dark:text-gray-100 text-2xl font-bold">{pofileData?.itemsSold || 42}</p>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-1">Items Sold</p>
                </div>
              </div> */}
            </div>
          </div>
          {/*  Personal Details */}
          <div className="bg-white dark:bg-primary-dark border border-gray-100 dark:border-gray-800/60 rounded-2xl shadow-sm px-6 sm:px-8 mx-2 md:mx-0">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-50 dark:border-gray-800/50">
              <h2 className="text-xl font-bold text-[#34415C] dark:text-white">
                {selectedContent[localizationKeys.personalDetails]}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 hover:bg-white dark:hover:bg-gray-800/40 hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className="w-10 h-10 rounded-full bg-[#fff8e1] dark:bg-[#d6a536]/10 text-[#d6a536] font-bold rounded-full border border-[#fde68a] dark:border-[#d6a536]/30 flex items-center justify-center">
                    <RiUser3Fill size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">{selectedContent[localizationKeys.userName]}</p>
                    <p className="text-base font-semibold text-[#34415C] dark:text-white">{pofileData?.userName}</p>
                  </div>
                </div>
                <EditUserNameModel onReload={onReload} oldName={pofileData?.userName} />
              </div>
              
              {!pofileData?.isOAuth && (
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between px-4 rounded-xl border border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 hover:bg-white dark:hover:bg-gray-800/40 hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="w-10 h-10 rounded-full bg-[#fff8e1] dark:bg-[#d6a536]/10 text-[#d6a536] font-bold rounded-full border border-[#fde68a] dark:border-[#d6a536]/30 flex items-center justify-center">
                      <HiLockClosed size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-1">{selectedContent[localizationKeys.password]}</p>
                      <p className="text-base font-semibold text-[#34415C] dark:text-white">••••••••••••</p>
                    </div>
                  </div>
                  <EditPasswordModel onReload={onReload} />
                </div>
              )}
            </div>
          </div>
          {/* Contact info */}
          <div className="bg-white dark:bg-primary-dark border border-gray-100 dark:border-gray-800/60 rounded-2xl shadow-sm px-6 sm:px-8 py-3 sm:py-4 mb-6 mx-2 md:mx-0">
            <div className="flex items-center gap-3 border-b border-gray-50 dark:border-gray-800/50">
              <h2 className="text-xl font-bold text-[#34415C] dark:text-white">
                {selectedContent[localizationKeys.contactInfo]}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 hover:bg-white dark:hover:bg-gray-800/40 hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                <div className="flex items-start sm:items-center gap-4 mb-3 sm:mb-0">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#fff8e1] dark:bg-[#d6a536]/10 text-[#d6a536] font-bold rounded-full border border-[#fde68a] dark:border-[#d6a536]/30 flex items-center justify-center">
                    <MdMail size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 font-medium mb-1">{selectedContent[localizationKeys.eMail]}</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <p className="text-base font-semibold text-[#34415C] dark:text-white break-all sm:break-normal">{pofileData?.email}</p>
                      {pofileData?.isVerified && (
                         <span className="flex-shrink-0 flex items-center gap-1 bg-[#fff8e1] dark:bg-[#d6a536]/10 text-[#d6a536] text-[11px] font-bold px-3 py-1 rounded-full border border-[#fde68a] dark:border-[#d6a536]/30">
                           <IoMdCheckmarkCircle size={14} /> {selectedContent[localizationKeys.verified]}
                         </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-800/20 hover:bg-white dark:hover:bg-gray-800/40 hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className="w-10 h-10 rounded-full bg-[#fff8e1] dark:bg-[#d6a536]/10 text-[#d6a536] font-bold rounded-full border border-[#fde68a] dark:border-[#d6a536]/30 flex items-center justify-center">
                    <BsFillTelephoneFill size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">{selectedContent[localizationKeys.phoneNumber]}</p>
                    <p className="text-base font-semibold text-[#34415C] dark:text-white">{pofileData?.phone || "No phone added"}</p>
                  </div>
                </div>
                <EditPhoneNumberModel onReload={onReload} oldPhoneNumber={pofileData?.phone} />
              </div>
            </div>
          </div>
          {/* O Auth */}
          <div className="bg-white dark:bg-primary-dark border border-gray-100 dark:border-gray-800/60 rounded-2xl shadow-sm p-6 sm:p-8 mb-6 mx-2 md:mx-0">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50 dark:border-gray-800/50">
              <div>
                <h2 className="text-xl font-bold text-[#34415C] dark:text-white">
                  {selectedContent[localizationKeys.loginService]}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedContent[localizationKeys.loginServiceMaseg]}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex justify-center items-center">
              <Loginbutton
                isActive={pofileData?.oAuthType === "APPLE"}
                Icon={FaApple}
                text={selectedContent[localizationKeys.connectedWithApple]}
                statusText={selectedContent[localizationKeys.connected]}
              />
              <Loginbutton
                isActive={pofileData?.oAuthType === "GOOGLE"}
                Icon={FaGoogle}
                text={selectedContent[localizationKeys.connectWithGoogle]}
                statusText={selectedContent[localizationKeys.connected]}
              />
            </div>
          </div>

          {/* Address Book */}
          <div id="AddressBook" className="bg-white dark:bg-primary-dark border border-gray-100 dark:border-gray-800/60 rounded-2xl shadow-sm p-6 sm:p-8 mb-6 mx-2 md:mx-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-50 dark:border-gray-800/50">
               <div>
                <h2 className="text-xl font-bold text-[#34415C] dark:text-white">
                  {selectedContent[localizationKeys.addAddress]}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedContent[localizationKeys.addressBookmasg]}
                </p>
              </div>
              <button
                 onClick={() => setOpen(true)}
                 className="bg-[#34415C] dark:bg-primary hover:bg-[#2a3449] dark:hover:bg-primary-dark text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
               >
                 <GoPlus size={18} />
                 <span>{selectedContent[localizationKeys.addAddress]}</span>
               </button>
               <AddLocationModel
                 open={open}
                 setOpen={setOpen}
                 TextButton={selectedContent[localizationKeys.add]}
                 onReload={onReload}
               />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-6">
              {locationData?.map((e) => {
                return (
                  <LocationDetailsCard
                    key={e?.id}
                    Id={e?.id}
                    AddressLable={e?.addressLabel}
                    Address={e?.address}
                    Country={
                      lang === "en" ? e?.country?.nameEn : e?.country.nameAr
                    }
                    City={lang === "en" ? e?.city?.nameEn : e?.city.nameAr}
                    phone={e?.phone ? e.phone : "No phone number"}
                    isMain={e?.isMain}
                    onReload={onReload}
                  />
                );
              })}
              {!locationData?.length && (
                <button
                  onClick={() => setOpen(true)}
                  className="w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#d6a536] dark:hover:border-[#d6a536] hover:bg-[#fff8e1]/30 dark:hover:bg-[#d6a536]/10 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#d6a536] transition-all"
                >
                  <GoPlus size={24} />
                  <span className="font-medium">{selectedContent[localizationKeys.addAddress]}</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 sm:p-8 mb-10 mx-2 md:mx-0">
             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
               <div>
                 <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-1">Danger Zone</h3>
                 <p className="text-sm text-red-500/80 dark:text-red-400/80">Once you delete your account, there is no going back. Please be certain.</p>
               </div>
               <DeleteAccountSection />
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Loginbutton = ({ Icon, text, isActive, statusText }) => {
  return (
    <div className={`relative flex items-center p-4 border rounded-xl transition-all duration-200 ${isActive ? 'border-green-500 bg-green-50/30 dark:bg-green-900/20 dark:border-green-800/60' : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800'}`}>
       <div className="w-10 h-10 flex-shrink-0 bg-[#fff8e1] dark:bg-[#d6a536]/10 text-[#d6a536] border border-[#fde68a] dark:border-[#d6a536]/30 rounded-full shadow-sm flex items-center justify-center ltr:mr-4 rtl:ml-4">
         {Icon && <Icon className="w-5 h-5" />}
       </div>
       <div className="flex-grow">
         <p className="text-sm font-semibold text-[#34415C] dark:text-white">{text}</p>
         <p className={`text-xs mt-0.5 ${isActive ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400'}`}>
            {isActive ? (
               <span className="flex items-center gap-1">
                 <IoMdCheckmarkCircle size={14} /> {statusText}
               </span>
            ) : 'Not connected'}
         </p>
       </div>
    </div>
  );
};

export const LocationDetailsCard = ({
  AddressLable,
  Address,
  Country,
  City,
  // PostalCode,
  phone,
  Id,
  isMain,
  onReload,
}) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { run: runDelete } = useAxios();
  const { run: runMakeDefault } = useAxios();

  const handelDelete = (id) => {
    runDelete(
      authAxios
        .delete(api.app.location.delete(id))
        .then(() => {
          toast.success(
            selectedContent[localizationKeys.addressDeletedSuccessfully]
          );
          setOpen(false);
          onReload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message?.[lang] ||
              selectedContent[localizationKeys.oops]
          );
        })
    );
  };

  const handelMakeDefault = (id) => {
    runMakeDefault(
      authAxios
        .patch(api.app.location.makeDefault(id))
        .then(() => {
          toast.success(
            selectedContent[localizationKeys.ChangedDefaultAdrress]
          );
          setOpen(false);
          onReload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message?.[lang] ||
              selectedContent[localizationKeys.oops]
          );
        })
    );
  };

  return (
    <>
      <div className="relative group border border-gray-100 dark:border-[#d4af37]/40 bg-white dark:bg-primary-dark hover:border-[#d6a536]/50 dark:hover:border-yellow hover:shadow-md rounded-xl p-5 transition-all duration-200">
        {isMain && (
           <div className="absolute -top-3 ltr:left-4 rtl:right-4 bg-[#d6a536] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
             {selectedContent[localizationKeys.default]}
           </div>
        )}
        <div className="flex justify-between items-start pt-1">
          <h1 className="text-[#34415C] dark:text-white font-bold text-base">{AddressLable}</h1>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="cursor-pointer text-gray-400 hover:text-[#d6a536] transition-colors p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <BsThreeDots size={20} />
            </button>
            
            {open && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setOpen(false)}
                />
                <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 min-w-[160px] bg-white dark:bg-[#1A1F2C] rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col">
                    {!isMain && (
                      <button
                        onClick={() => {
                          handelMakeDefault(Id);
                          setOpen(false);
                        }}
                        className="text-left ltr:text-left rtl:text-right text-sm text-gray-700 dark:text-gray-300 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#22283A] font-medium transition-colors"
                      >
                        {selectedContent[localizationKeys.makeDefault]}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditModalOpen(true);
                        setOpen(false);
                      }}
                      className="text-left ltr:text-left rtl:text-right text-sm text-gray-700 dark:text-gray-300 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#22283A] font-medium transition-colors"
                    >
                      {selectedContent[localizationKeys.edit]}
                    </button>
                    {!isMain && (
                      <button
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setOpen(false);
                        }}
                        className="text-left ltr:text-left rtl:text-right text-sm text-red-600 dark:text-red-400 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
                      >
                        {selectedContent[localizationKeys.delete]}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-gray-500 text-sm">{Address}</p>
          <p className="text-gray-500 text-sm">
            {City}, {Country}
          </p>
          <p className="text-gray-500 text-sm">{phone}</p>
        </div>

        <AddLocationModel
          open={editModalOpen}
          setOpen={setEditModalOpen}
          TextButton={selectedContent[localizationKeys.save]}
          onReload={onReload}
          isEditing={true}
          editData={{
            addressId: Id,
            addressLabel: AddressLable,
            address: Address,
            countryId: Country,
            cityId: City,
          }}
        />

        <ConfirmationModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => {
            handelDelete(Id);
            setDeleteModalOpen(false);
          }}
          message={selectedContent[localizationKeys.confirmDeleteAddress]}
        />
      </div>
    </>
  );
};

export function DeleteAccountSection() {
  const [showModal, setShowModal] = useState(false);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm "
      >
        <svg
          className="w-5 h-5 mb-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        {selectedContent[localizationKeys.deleteAccount]}
      </button>

      <DeleteAccountModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default ProfileSettings;
