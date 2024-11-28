import React, { useEffect, useState } from "react";

import routes from "../../../routes";
import { useHistory } from "react-router-dom";

import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import { CreateAuctionBreadcrumb } from "../../../component/shared/bread-crumb/Breadcrumb";
import Stepper from "../../../component/shared/stepper/stepper-app";

import { GoPlus } from "react-icons/go";
import { Dimmer } from "semantic-ui-react";

import api from "../../../api";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";

import moment from "moment";

import { useLanguage } from "../../../context/language-context";

import useFilter from "../../../hooks/use-filter";

import { toast } from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { productDetails } from "../../../redux-store/product-details-Slice";
import {
  auctionDetails,
  type,
  duration,
  isBuyNow,
} from "../../../redux-store/auction-details-slice";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
import { MdDelete } from "react-icons/md";

const ShippingDetails = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const dispatch = useDispatch();

  const productDetailsInt = useSelector(
    (state) => state.productDetails.productDetails
  );
  const auctionDetailsInt = useSelector(
    (state) => state.auctionDetails.auctionDetails
  );
  const durationInt = useSelector((state) => state.auctionDetails.duration);
  const isBuyNowInt = useSelector((state) => state.auctionDetails.isBuyNow);
  const typeInt = useSelector((state) => state.auctionDetails.type);
  const deliveryPolicyInt = useSelector(
    (state) => state.auctionDetails.deliveryPolicy
  );
  const returnPolicyInt = useSelector(
    (state) => state.auctionDetails.returnPolicy
  );
  const warrantyPolicyInt = useSelector(
    (state) => state.auctionDetails.warrantyPolicy
  );

  const offerDataInt = useSelector((state) => state.auctionDetails.offerPrice);
  console.log("offer price data int : ", offerDataInt);
  const [locationId, setLocationId] = useFilter("locationId", "");

  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [locatonData, setLocationData] = useState();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    run(
      authAxios.get(api.app.location.get).then((res) => {
        setLocationData(res?.data?.data);
      })
    );
  }, [run, forceReload]);

  const {
    run: runCreatAuction,
    isLoading: isLoadingCreatAuction,
    error: errorCreatAuction,
    isError: isErrorCreatAuction,
  } = useAxios([]);

  // const selectThePaymentOption =()=>{

  //   run(
  //     authAxios.get(`${api.app.Wallet.getBalance}`)
  //     .then((response)=>{
  //       const balance = response.data
  //       alert(balance)
  //       if(balance && balance > categoryData.sellerDepositFixedAmount){
  //         dispatch(setWalletBalance({balance: balance }));
  //         setPaymentSelectModal(true)

  //       }else{
  //         alert('no wallet balance')
  //       }
  //     })

  //   )
  // }

  const creatAuction = () => {
    if (locationId) {
      const formData = new FormData();
      formData.append("product[title]", productDetailsInt.itemName);
      formData.append("product[categoryId]", productDetailsInt.category);
      if (productDetailsInt.subCategory) {
        formData.append(
          "product[subCategoryId]",
          productDetailsInt.subCategory
        );
      }
      if (productDetailsInt.brandId) {
        formData.append("product[brandId]", productDetailsInt.brandId);
      }
      if (productDetailsInt.valueRadio) {
        formData.append("product[usageStatus]", productDetailsInt.valueRadio);
      }
      if (productDetailsInt.color) {
        formData.append("product[color]", productDetailsInt.color);
      }
      if (productDetailsInt.age) {
        formData.append("product[age]", productDetailsInt.age);
      }
      if (productDetailsInt.landType) {
        formData.append("product[landType]", productDetailsInt.landType);
      }
      if (productDetailsInt.cameraType) {
        formData.append("product[cameraType]", productDetailsInt.cameraType);
      }
      if (productDetailsInt.carType) {
        formData.append("product[carType]", productDetailsInt.carType);
      }
      if (productDetailsInt.material) {
        formData.append("product[material]", productDetailsInt.material);
      }
      if (productDetailsInt.memory) {
        formData.append("product[memory]", productDetailsInt.memory);
      }
      if (productDetailsInt.model) {
        formData.append("product[model]", productDetailsInt.model);
      }
      if (productDetailsInt.processor) {
        formData.append("product[processor]", productDetailsInt.processor);
      }
      if (productDetailsInt.ramSize) {
        formData.append("product[ramSize]", productDetailsInt.ramSize);
      }
      if (productDetailsInt.releaseYear) {
        formData.append("product[releaseYear]", productDetailsInt.releaseYear);
      }
      if (productDetailsInt.screenSize) {
        formData.append("product[screenSize]", productDetailsInt.screenSize);
      }
      if (productDetailsInt.totalArea) {
        formData.append("product[totalArea]", productDetailsInt.totalArea);
      }
      if (productDetailsInt.operatingSystem) {
        formData.append(
          "product[operatingSystem]",
          productDetailsInt.operatingSystem
        );
      }
      if (productDetailsInt.regionOfManufacture) {
        formData.append(
          "product[regionOfManufacture]",
          productDetailsInt.regionOfManufacture
        );
      }
      if (productDetailsInt.numberOfFloors) {
        formData.append(
          "product[numberOfFloors]",
          productDetailsInt.numberOfFloors
        );
      }
      if (productDetailsInt.numberOfRooms) {
        formData.append(
          "product[numberOfRooms]",
          productDetailsInt.numberOfRooms
        );
      }
      if (productDetailsInt.itemDescription) {
        formData.append(
          "product[description]",
          productDetailsInt.itemDescription
        );
      }
      if (productDetailsInt.countryId) {
        formData.append("product[countryId]", productDetailsInt.countryId);
      }
      if (productDetailsInt.cityId) {
        formData.append("product[cityId]", productDetailsInt.cityId);
      }
      if (offerDataInt.IsOfferPrice) {
        formData.append("product[isOffer]", offerDataInt.IsOfferPrice);
        formData.append("product[offerAmount]", offerDataInt.offerAmount);
      }
      if (productDetailsInt?.auctionState === "DRAFTED") {
      } else {
        formData.append("images", productDetailsInt.fileOne);
        formData.append("images", productDetailsInt.fileTwo);
        formData.append("images", productDetailsInt.fileThree);
        if (productDetailsInt.fileFour) {
          formData.append("images", productDetailsInt.fileFour);
        }
        if (productDetailsInt.fileFive) {
          formData.append("images", productDetailsInt.fileFive);
        }
      }
      formData.append("startBidAmount", auctionDetailsInt.MinimumPrice);
      if (isBuyNowInt.isBuyNowAllowed) {
        formData.append("acceptedAmount", isBuyNowInt.acceptedAmount);
        formData.append("isBuyNowAllowed", isBuyNowInt.isBuyNowAllowed);
      }
      if (typeInt.type === "SCHEDULED") {
        const date = moment(
          typeInt.date + " " + typeInt.from,
          "DD-MM-YYYY hh:mm A"
        ).toLocaleString();

        formData.append("type", typeInt.type);
        formData.append("startDate", date);
      } else {
        formData.append("type", typeInt.type);
      }
      if (durationInt.durationUnit === "DAYS") {
        formData.append("durationUnit", durationInt.durationUnit);
        formData.append("durationInDays", durationInt.durationInDays);
      } else {
        formData.append("durationUnit", durationInt.durationUnit);
        formData.append("durationInHours", durationInt.durationInHours);
      }
      formData.append("locationId", locationId);
      if (deliveryPolicyInt.IsDelivery) {
        formData.append("IsDelivery", deliveryPolicyInt.IsDelivery);
        formData.append(
          "deliveryPolicyDescription",
          deliveryPolicyInt.description
        );
        formData.append(
          "numOfDaysOfExpecetdDelivery",
          deliveryPolicyInt.expectedNumOfDays
        );
        formData.append("DeliveryFees", deliveryPolicyInt.deliveryFees);
      }
      if (returnPolicyInt.IsRetrunPolicy) {
        formData.append("IsRetrunPolicy", returnPolicyInt.IsRetrunPolicy);
        formData.append("returnPolicyDescription", returnPolicyInt.description);
      }
      if (warrantyPolicyInt.IsWaranty) {
        formData.append("IsWaranty", warrantyPolicyInt.IsWaranty);
        formData.append(
          "warrantyPolicyDescription",
          warrantyPolicyInt.description
        );
      }

      if (productDetailsInt?.auctionState === "DRAFTED") {
        runCreatAuction(
          authAxios
            .put(
              api.app.auctions.setUpdatedraft(productDetailsInt?.auctionId),
              formData
            )
            .then((res) => {
              window.localStorage.setItem("auctionId", res?.data?.data.id);
              toast.success(
                selectedContent[localizationKeys.yourAuctionIsCreatedSuccess]
              );
              history.push(routes.app.createAuction.paymentDetails);
              dispatch(productDetails({}));
              dispatch(auctionDetails({}));
              dispatch(type({}));
              dispatch(duration({}));
              dispatch(isBuyNow({}));
            })
            .catch((err) => {
              toast.error(selectedContent[localizationKeys.oops]);
            })
        );
      } else {
        console.log("form data form create acuction", formData);
        runCreatAuction(
          authAxios
            .post(api.app.auctions.default, formData)
            .then((res) => {
              window.localStorage.setItem("auctionId", res?.data?.data.id);
              toast.success(
                selectedContent[localizationKeys.yourAuctionIsCreatedSuccess]
              );
              history.push(routes.app.createAuction.paymentDetails);
              dispatch(productDetails({}));
              dispatch(auctionDetails({}));
              dispatch(type({}));
              dispatch(duration({}));
              dispatch(isBuyNow({}));
            })
            .catch((err) => {

              console.log('auction create error***>',err);
              toast.error(
                // err?.response?.data?.message.map((e) => e) ||
                //   err?.message.map((e) => e) ||
                selectedContent[localizationKeys.oops]
              );
            })
        );
      }
    } else {
      toast.error(
        selectedContent[
          localizationKeys
            .makeSureThatYouChooseTheAuctionLocationOrCreateAnotherOne
        ]
      );
    }
  };

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading || isLoadingCreatAuction}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in mx-5 ">
        <div className=" max-w-[1366px] mx-auto h-14 my-7 py-4 sm:block hidden ">
          <CreateAuctionBreadcrumb />
        </div>
        <div className="flex justify-center">
          <Stepper />
        </div>
        <div className=" max-w-[1366px] mx-auto ">
          <h1 className="font-bold text-base text-black pt-6">
            {selectedContent[localizationKeys.locationDetails]}
          </h1>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mx-auto pt-6">
            {locatonData?.map((e) => (
              <LocationDetailsCard
                key={e?.id}
                Id={e?.id}
                AddressLable={e?.addressLabel}
                Address={e?.address}
                Country={lang === "en" ? e?.country?.nameEn : e?.country.nameAn}
                City={lang === "en" ? e?.city?.nameEn : e?.city.nameAn}
                PostalCode={e?.zipCode}
                isMain={e?.isMain}
                onReload={onReload}
              />
            ))}
            <button
              onClick={() => setOpen(true)}
              className="border-gray-med border-[1px] border-dashed w-[136px] h-[48px] rounded-lg text-base font-normal text-gray-med flex justify-center gap-x-2 "
            >
              <GoPlus className="my-auto" size={16} />
              <p className="my-auto">
                {selectedContent[localizationKeys.addAddress]}
              </p>
            </button>
          </div>
          {/* <button
          onClick={() => history.push(routes.createAuction.paymentDetails)}
        >
          go to paymentDetails
        </button> */}
          {/* buttons */}
          <div className=" flex justify-end  mt-28">
            <button
              className="bg-primary hover:bg-primary-dark text-white sm:w-[304px] w-full h-[48px] rounded-lg  sm:mt-8 mt-2 font-normal text-base rtl:font-serifAR ltr:font-serifEN mb-5"
              // onClick={creatAuction}
              onClick={creatAuction}
              loading={isLoadingCreatAuction}
            >
              {selectedContent[localizationKeys.createAuction]}
            </button>
          </div>
        </div>
        <AddLocationModel
          open={open}
          setOpen={setOpen}
          TextButton={selectedContent[localizationKeys.add]}
          onReload={onReload}
        />
      </div>
    </>
  );
};

export const LocationDetailsCard = ({
  AddressLable,
  Address,
  Country,
  City,
  PostalCode,
  Id,
  isMain,
  onReload,
}) => {
  const [locationId, setLocationId] = useFilter("locationId", "");
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const { run: runDelete } = useAxios();

  const handleDelete = (e) => {
    e.stopPropagation();

    if (!Id) {
      console.error("Invalid location ID");
      toast.error("Invalid location ID");
      return;
    }

    if (isMain) {
      toast.error(selectedContent[localizationKeys.cannotDeleteMainAddress]);
      return;
    }

    if (
      window.confirm(selectedContent[localizationKeys.confirmDeleteAddress])
    ) {
      runDelete(
        authAxios
          .delete(api.app.location.delete(Id))
          .then((response) => {
            console.log("Delete response:", response);
            toast.success(
              selectedContent[localizationKeys.addressDeletedSuccessfully]
            );
            onReload();
          })
          .catch((error) => {
            toast.error(
              error.response?.data?.message.en ||
                selectedContent[localizationKeys.errorDeletingAddress]
            );
          })
      );
    }
  };

  return (
    <div
      onClick={() => {
        setLocationId(Id);
      }}
      className={`${
        locationId === `${Id}` ? "border-primary" : "border-gray-med"
      } border-[1px] rounded-lg h-[120px] w-full p-5 cursor-pointer relative`}
    >
      <h1 className="text-gray-dark text-sm">{AddressLable}</h1>
      <p className="text-gray-med text-sm pt-2">{Address}</p>
      <p className="text-gray-med text-sm pt-1">
        {City}, {Country}
      </p>
      <p className="text-gray-med text-sm pt-1">{PostalCode}</p>

      {!isMain && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700"
          title={selectedContent[localizationKeys.deleteAddress]}
        >
          <MdDelete size={20} />
        </button>
      )}
    </div>
  );
};

export default ShippingDetails;
