import React, { useEffect, useState } from "react";

import routes from "../../../routes";
import { useHistory } from "react-router-dom";

import AddLocationModel from "../../../components/create-auction-components/add-location-model";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Stepper from "../../../components/shared/stepper/stepper-app";

import { GoPlus } from "react-icons/go";
import { Dimmer, Loader } from "semantic-ui-react";

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

const ShippingDetails = () => {
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
  const [locationId, setLocationId] = useFilter("locationId", "");

  const history = useHistory();
  const [lang] = useLanguage();
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
      formData.append("images", productDetailsInt.fileOne);
      formData.append("images", productDetailsInt.fileTwo);
      formData.append("images", productDetailsInt.fileThree);
      if (productDetailsInt.fileFour) {
        formData.append("images", productDetailsInt.fileFour);
      }
      if (productDetailsInt.fileFive) {
        formData.append("images", productDetailsInt.fileFive);
      }
      formData.append("startBidAmount", auctionDetailsInt.MinimumPrice);
      if (isBuyNowInt.isBuyNowAllowed) {
        formData.append("acceptedAmount", isBuyNowInt.acceptedAmount);
        formData.append("isBuyNowAllowed", isBuyNowInt.isBuyNowAllowed);
      }
      if (typeInt.type === "SCHEDULED") {
        const date = moment(
          typeInt.date + " " + typeInt.from,
          "DD-MM-YYYY HH:mm"
        ).toISOString();
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

      runCreatAuction(
        authAxios
          .post(api.app.auctions.default, formData)
          .then((res) => {
            toast.success("your Auction is Created success");
            history.push(routes.app.home);
            dispatch(productDetails({}));
            dispatch(auctionDetails({}));
            dispatch(type({}));
            dispatch(duration({}));
            dispatch(isBuyNow({}));
          })
          .catch((err) => {
            toast.error(
              // err?.response?.data?.message.map((e) => e) ||
              //   err?.message.map((e) => e) ||
              "oops, something with wrong please make sure everything is in the right place and try again "
            );
          })
      );
    } else {
      toast.error(
        "Make sure that you choose the auction location or create another one"
      );
    }
  };

  return (
    <div className="mt-44 animate-in mx-5 ">
      <div className=" max-w-[1366px] mx-auto h-14 my-7 py-4 sm:block hidden ">
        <CreateAuctionBreadcrumb />
      </div>
      <div className="flex justify-center">
        <Stepper />
      </div>
      <div className=" max-w-[1366px] mx-auto ">
        <h1 className="font-bold text-base text-black pt-6">
          Location Details
        </h1>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mx-auto pt-6">
          <Dimmer
            className="animate-pulse"
            active={isLoading || isLoadingCreatAuction}
            inverted
          >
            <Loader active />
          </Dimmer>
          {locatonData?.map((e) => (
            <LocationDetailsCard
              key={e?.id}
              Id={e?.id}
              AddressLable={e?.addressLabel}
              Address={e?.address}
              Country={lang === "en" ? e?.country?.nameEn : e?.country.nameAn}
              City={lang === "en" ? e?.city?.nameEn : e?.city.nameAn}
              PostalCode={e?.zipCode}
            />
          ))}
          <button
            onClick={() => setOpen(true)}
            className="border-gray-med border-[1px] border-dashed w-[136px] h-[48px] rounded-lg text-base font-normal text-gray-med flex justify-center gap-x-2 "
          >
            <GoPlus className="my-auto" size={16} />
            <p className="my-auto">Add Address</p>
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
            onClick={creatAuction}
            loading={isLoadingCreatAuction}
          >
            Creat Auction
          </button>
        </div>
      </div>
      <AddLocationModel
        open={open}
        setOpen={setOpen}
        TextButton={"Add"}
        onReload={onReload}
      />
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
}) => {
  const [locationId, setLocationId] = useFilter("locationId", "");
  return (
    <div
      key={key}
      onClick={() => {
        setLocationId(Id);
      }}
      className={`${
        locationId === `${Id}` ? "border-primary" : "border-gray-med"
      } border-[1px] rounded-lg h-[120px] w-full p-5 cursor-pointer`}
    >
      <h1 className="text-gray-dark text-sm">{AddressLable}</h1>
      <p className="text-gray-med text-sm pt-2">{Address}</p>
      <p className="text-gray-med text-sm pt-1">
        {City}, {Country}
      </p>
      <p className="text-gray-med text-sm pt-1">{PostalCode}</p>
    </div>
  );
};

export default ShippingDetails;
