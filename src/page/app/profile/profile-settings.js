import React, { useEffect, useState } from "react";

import { MdMail } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { RiUser3Fill } from "react-icons/ri";
import { HiLockClosed } from "react-icons/hi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { BsFillTelephoneFill, BsThreeDots } from "react-icons/bs";

import appleIcon from "../../../../src/assets/icons/Apple-icon.svg";
import googleIcon from "../../../../src/assets/icons/Google-icon.svg";
// import facebookIcon from "../../../../src/assets/icons/Fcaebook-icon.svg";
import userProfileicon from "../../../../src/assets/icons/user-Profile-icon.png";

import UploadeImgModel from "../../../component/profile-components/uploade-img-model";
import EditPasswordModel from "../../../component/profile-components/edit-password-model";
import EditUserNameModel from "../../../component/profile-components/edit-user-name-model";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import EditPhoneNumberModel from "../../../component/profile-components/edit-phone-number-model";

import useAxios from "../../../hooks/use-axios";

import { Dimmer, Popup } from "semantic-ui-react";
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
              <UploadeImgModel
                onReload={onReload}
                oldimg={pofileData?.imageLink}
                IsImgModelOpen={IsImgModelOpen}
                setImgModelOpen={setImgModelOpen}
              />
            </div>
          </div>
          {/*  Personal Details */}
          <div className="pt-3 border-b-[1px] border-gray-veryLight pb-8 ">
            <h1 className="text-gray-dark text-base font-semibold">
              {selectedContent[localizationKeys.personalDetails]}
            </h1>
            <div className="flex justify-between pt-9">
              <div>
                <div className="flex items-center">
                  <p className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center ltr:mr-5 rtl:ml-5">
                    <RiUser3Fill size={16} />
                  </p>
                  <p className="text-gray-dark text-base font-medium">
                    {selectedContent[localizationKeys.userName]}
                  </p>
                </div>

                <p className="text-gray-dark text-base ltr:pl-[64px] rtl:pr-[64px] ">
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
                  <p className="bg-primary  text-white w-9 h-9 rounded-full px-2.5 pt-2 ltr:mr-5 rtl:ml-5">
                    <HiLockClosed size={16} />
                  </p>
                  <p className="text-gray-dark text-base font-medium  ">
                    {selectedContent[localizationKeys.password]}
                  </p>
                </div>
                <p className="text-gray-dark text-base ltr:pl-[64px] rtl:pr-[64px] ">
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
              {selectedContent[localizationKeys.contactInfo]}
            </h1>
            <div className="flex pt-9">
              <div>
                <div className="flex items-center">
                  <p className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center ltr:mr-5 rtl:ml-5">
                    <MdMail size={16} />
                  </p>
                  <p className="text-gray-dark text-base font-medium">
                    {selectedContent[localizationKeys.eMail]}
                  </p>
                </div>
                <p className="text-gray-dark text-base ltr:pl-[64px] rtl:pr-[64px]  ">
                  {pofileData?.email}
                </p>
              </div>
              <div
                className={`${
                  pofileData?.isVerified
                    ? "text-green-500"
                    : "text-gray-veryLight"
                } hidden md:flex gap-x-1 ltr:md:ml-[210px] rtl:md:mr-[210px] ltr:ml-auto rtl:mr-auto`}
              >
                <IoMdCheckmarkCircle size={16} className="mt-0.5" />
                <p className="text-base font-normal">
                  {selectedContent[localizationKeys.verified]}
                </p>
              </div>
            </div>
            <div className="flex justify-between pt-9">
              <div>
                <div className="flex items-center">
                  <p className="bg-primary text-white w-9 h-9 rounded-full flex items-center justify-center ltr:mr-5 rtl:ml-5">
                    <BsFillTelephoneFill size={16} />
                  </p>
                  <p className="text-gray-dark text-base font-medium">
                    {selectedContent[localizationKeys.phoneNumber]}
                  </p>
                </div>

                <p className="text-gray-dark text-base ltr:pl-[64px] rtl:pr-[64px]">
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
              {selectedContent[localizationKeys.loginService]}
            </h1>
            <p className="text-gray-dark text-base font-normal pt-2">
              {selectedContent[localizationKeys.loginServiceMaseg]}
            </p>
            <div>
              <div className="md:flex block mt-8">
                <Loginbutton
                  isActive={pofileData?.oAuthType === "APPLE" ? true : false}
                  logo={appleIcon}
                  text={selectedContent[localizationKeys.connectedWithApple]}
                />
                <div
                  className={`${
                    pofileData?.oAuthType === "APPLE"
                      ? "text-green-500"
                      : "text-gray-veryLight"
                  } md:flex hidden gap-x-1 ltr:ml-[71px] rtl:mr-[71px] my-auto `}
                >
                  <IoMdCheckmarkCircle size={16} className="mt-0.5" />
                  <p className="text-base font-normal">
                    {selectedContent[localizationKeys.connected]}
                  </p>
                </div>
              </div>
              <div className="md:flex block ">
                <Loginbutton
                  isActive={pofileData?.oAuthType === "GOOGLE" ? true : false}
                  logo={googleIcon}
                  text={selectedContent[localizationKeys.connectWithGoogle]}
                />
                <div
                  className={`${
                    pofileData?.oAuthType === "GOOGLE"
                      ? "text-green-500"
                      : "text-gray-veryLight"
                  } md:flex hidden  gap-x-1 ltr:ml-[71px] rtl:mr-[71px] my-auto`}
                >
                  <IoMdCheckmarkCircle size={16} className="mt-0.5" />
                  <p className="text-base font-normal">
                    {selectedContent[localizationKeys.connected]}
                  </p>
                </div>
              </div>
              {/* <div className="md:flex block ">
                <Loginbutton
                  isActive={pofileData?.oAuthType === "FACEBOOK" ? true : false}
                  logo={facebookIcon}
                  text={selectedContent[localizationKeys.connectWithFacebook]}
                />
                <div
                  className={`${
                    pofileData?.oAuthType === "FACEBOOK"
                      ? "text-green-500"
                      : "text-gray-veryLight"
                  } md:flex hidden gap-x-1 ltr:ml-[71px] rtl:mr-[71px] my-auto`}
                >
                  <IoMdCheckmarkCircle size={16} className="mt-0.5" />
                  <p className="text-base font-normal">
                    {selectedContent[localizationKeys.connected]}
                  </p>
                </div>
              </div> */}
            </div>
          </div>

          {/* Address Book */}
          <div id="AddressBook" className="pt-3  pb-20 mb-10 ">
            <h1 className="text-gray-dark text-base font-semibold">
              {selectedContent[localizationKeys.addAddress]}
            </h1>
            <p className="text-gray-dark text-base font-normal pt-2">
              {selectedContent[localizationKeys.addressBookmasg]}
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
                      lang === "en" ? e?.country?.nameEn : e?.country.nameAr
                    }
                    City={lang === "en" ? e?.city?.nameEn : e?.city.nameAr}
                    phone={e?.phone ? e.phone : "No phone number"}
                    // PostalCode={e?.zipCode}
                    isMain={e?.isMain}
                    onReload={onReload}
                  />
                );
              })}
              <button
                onClick={() => setOpen(true)}
                className="border-gray-med hover:border-primary border-[1px] border-dashed w-[136px] h-[48px] rounded-lg text-base font-normal text-gray-med flex hover:text-primary justify-center gap-x-2 "
              >
                <GoPlus className="my-auto" size={16} />
                <p className="my-auto">
                  {selectedContent[localizationKeys.addAddress]}
                </p>
              </button>
              <AddLocationModel
                open={open}
                setOpen={setOpen}
                TextButton={selectedContent[localizationKeys.add]}
                onReload={onReload}
              />
            </div>
            <div className="deleteAccountSection mt-12">
              <DeleteAccountSection />
            </div>
          </div>
        </div>
      </div>
    </>
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
      <div className="border-[1px] rounded-lg w-full p-5">
        <div className="flex justify-between">
          <h1 className="text-gray-dark text-sm">{AddressLable}</h1>
          <Popup
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            open={open}
            className="bg-white w-auto h-auto rounded-lg border-none relative shadow-lg"
            trigger={
              <div className="cursor-pointer hover:text-primary">
                <BsThreeDots size={20} className="text-gray-med mb-auto" />
              </div>
            }
            on="click"
            position="bottom right"
          >
            <div className="py-2 min-w-[150px]">
              {!isMain && (
                <div
                  onClick={() => handelMakeDefault(Id)}
                  className="text-gray-700 px-4 py-2 cursor-pointer hover:bg-gray-100 text-base font-normal"
                >
                  {selectedContent[localizationKeys.makeDefault]}
                </div>
              )}
              <div
                onClick={() => {
                  setEditModalOpen(true);
                  setOpen(false);
                }}
                className="text-gray-700 px-4 py-2 cursor-pointer hover:bg-gray-100 text-base font-normal"
              >
                {selectedContent[localizationKeys.edit]}
              </div>
              {!isMain && (
                <div
                  onClick={() => {
                    setDeleteModalOpen(true);
                    setOpen(false);
                  }}
                  className="text-red-500 px-4 py-2 cursor-pointer hover:bg-gray-100 text-base font-normal"
                >
                  {selectedContent[localizationKeys.delete]}
                </div>
              )}
            </div>
          </Popup>
        </div>

        <p className="text-gray-med text-sm pt-2">{Address}</p>
        <p className="text-gray-med text-sm pt-1">
          {City}, {Country}
        </p>
        <p className="text-gray-med text-sm pt-2">{phone}</p>
        <div className="flex justify-between">
          {isMain && (
            <p className="text-primary-dark underline text-sm pt-1 ml-auto">
              {selectedContent[localizationKeys.default]}
            </p>
          )}
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
        className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5 mb-1"
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
