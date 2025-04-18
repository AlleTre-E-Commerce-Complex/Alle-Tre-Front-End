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
import { useLanguage } from "../../../context/language-context";
import useFilter from "../../../hooks/use-filter";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { listingProductDetails } from "redux-store/ListingProduct-details-slice";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
import { BsThreeDots } from "react-icons/bs";
import { Popup } from "semantic-ui-react";
import ConfirmationModal from "../../../component/shared/delete-modal/delete-modal";
import { getDefaultPerPage } from "constants/pagination";

const ListingProductsLocationDetails = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const dispatch = useDispatch();

  const productDetailsInt = useSelector(
    (state) => state.listingProductDetails.listingProductDetails
  );

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
        const sortedLocations = res?.data?.data.sort((a, b) => {
          if (a.isMain && !b.isMain) return -1;
          if (!a.isMain && b.isMain) return 1;
          return 0;
        });
        setLocationData(sortedLocations);
      })
    );
  }, [run, forceReload]);

  const {
    run: runListNewProduct,
    isLoading: isLoadingListNewProduct,
    // error: errorCreatAuction,
    // error: errorCreatAuction,
    // isError: isErrorCreatAuction,
  } = useAxios([]);

  const listProduct = () => {
    if (locationId) {
      const formData = new FormData();
      formData.append("product[title]", productDetailsInt.itemName);
      formData.append(
        "product[ProductListingPrice]",
        productDetailsInt.itemPrice
      );
      formData.append("product[categoryId]", productDetailsInt.category);
      formData.append("product[locationId]", locationId);
      if (productDetailsInt.subCategory) {
        formData.append(
          "product[subCategoryId]",
          productDetailsInt.subCategory
        );
      }
      if (productDetailsInt.brand) {
        formData.append("product[brand]", productDetailsInt.brand);
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

      // Handle images properly
      if (productDetailsInt.images && Array.isArray(productDetailsInt.images)) {
        productDetailsInt.images.forEach((image, index) => {
          if (image.file) {
            formData.append("images", image.file);
          }
        });
      }

      runListNewProduct(
        authAxios
          .post(api.app.productListing.listNewProduct, formData)
          .then((res) => {
            toast.success(
              selectedContent[localizationKeys.yourProductIsSuccessfullyListed]
            );
            const perPage = getDefaultPerPage()
            history.push(`${routes.app.home}?page=1&perPage=${perPage}`);
            dispatch(listingProductDetails({}));
          })
          .catch((err) => {
            toast.error(
              selectedContent[localizationKeys.oops]
            );
          })
      );
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
        active={isLoading || isLoadingListNewProduct}
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
                Country={lang === "en" ? e?.country?.nameEn : e?.country.nameAr}
                City={lang === "en" ? e?.city?.nameEn : e?.city.nameAr}
                phone={e?.phone ? e.phone : "No phone number"}
                PostalCode={e?.zipCode}
                isMain={e?.isMain}
                onReload={onReload}
              />
            ))}
            <button
              onClick={() => setOpen(true)}
              className="border-gray-med hover:border-primary border-[1px] border-dashed w-[136px] h-[48px] rounded-lg text-base font-normal text-gray-med hover:text-primary flex justify-center gap-x-2 "
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
              onClick={listProduct}
              loading={isLoadingListNewProduct}
            >
              {selectedContent[localizationKeys.List]}
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
  key,
  Id,
  AddressLable,
  Address,
  Country,
  City,
  phone,
  PostalCode,
  isMain,
  onReload,
}) => {
  const [locationId, setLocationId] = useFilter("locationId", "");
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { run: runDelete } = useAxios();
  const { run: runMakeDefault } = useAxios();

  const handleDelete = () => {
    if (!Id) {
      toast.error(selectedContent[localizationKeys.invalidLocationId]);
      return;
    }

    if (isMain) {
      toast.error(selectedContent[localizationKeys.cannotDeleteMainAddress]);
      return;
    }

    runDelete(
      authAxios
        .delete(api.app.location.delete(Id))
        .then(() => {
          toast.success(
            selectedContent[localizationKeys.addressDeletedSuccessfully]
          );
          setOpen(false);
          onReload();
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message?.[lang] ||
              selectedContent[localizationKeys.errorDeletingAddress]
          );
        })
    );
  };

  const handleMakeDefault = (e) => {
    e.stopPropagation();
    runMakeDefault(
      authAxios
        .patch(api.app.location.makeDefault(Id))
        .then(() => {
          toast.success(
            selectedContent[localizationKeys.ChangedDefaultAdrress]
          );
          setOpen(false);
          onReload();
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message?.[lang] ||
              selectedContent[localizationKeys.oops]
          );
        })
    );
  };

  return (
    <>
      <div
        onClick={() => setLocationId(Id)}
        className={`transition-all duration-100 ${
          locationId === `${Id}`
            ? "border-2 border-primary "
            : "border-gray-300 bg-white"
        } border rounded-xl h-[130px] w-full p-5 cursor-pointer relative hover:shadow-lg`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-gray-dark text-sm font-medium">{AddressLable}</h1>
          <Popup
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            open={open}
            className="bg-white w-auto h-auto rounded-lg border-none shadow-lg"
            trigger={
              <div className="cursor-pointer hover:text-primary transition-all">
                <BsThreeDots size={20} className="text-gray-dark" />
              </div>
            }
            on="click"
            position="bottom right"
          >
            <div className="py-2 min-w-[150px] rounded-lg ">
              {!isMain && (
                <div
                  onClick={handleMakeDefault}
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
                  className="text-red-500 px-4 py-2 cursor-pointer hover:bg-red-50 text-base font-normal"
                >
                  {selectedContent[localizationKeys.delete]}
                </div>
              )}
            </div>
          </Popup>
        </div>

        <p className="text-gray-dark text-sm pt-2">{Address}</p>
        <p className="text-gray-dark text-sm pt-1">
          {City}, {Country}
        </p>
        <p className="text-gray-dark text-sm pt-1">{phone}</p>
        <p className="text-gray-dark text-sm pt-1">{PostalCode}</p>
        {isMain && (
          <p
            className={`text-primary text-md absolute bottom-2 ${
              lang === "ar" ? "left-4" : "right-4"
            }`}
          >
            {selectedContent[localizationKeys.default]}
          </p>
        )}

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
            postalCode: PostalCode,
          }}
        />

        <ConfirmationModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => {
            handleDelete();
            setDeleteModalOpen(false);
          }}
          message={selectedContent[localizationKeys.confirmDeleteAddress]}
        />
      </div>
    </>
  );
};

export default ListingProductsLocationDetails;
