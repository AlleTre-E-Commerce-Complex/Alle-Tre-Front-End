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
        {/* <div className=" max-w-[1366px] mx-auto h-14 my-7 py-4 sm:block hidden ">
          <CreateAuctionBreadcrumb />
        </div>
        <div className="flex justify-center">
          <Stepper />
        </div> */}
        <div className=" max-w-[1366px] mx-auto ">
          <h1 className="font-bold text-base text-black dark:text-white pt-6">
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
              className="bg-primary hover:bg-primary-dark dark:bg-yellow dark:hover:bg-yellow-dark sm:w-[220px] w-full h-[48px] rounded-lg dark:text-black text-white font-semibold text-base rtl:font-serifAR ltr:font-serifEN transition-colors flex items-center justify-center gap-2"
              // onClick={creatAuction}
              onClick={listProduct}
              loading={isLoadingListNewProduct}
            >
              {selectedContent[localizationKeys.listItem]}
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
        className={`relative group border ${
          locationId === `${Id}`
            ? "border-2 border-primary dark:border-yellow bg-primary/5 dark:bg-yellow-200/5 shadow-md"
            : "border-gray-100 dark:border-[#d4af37]/40 bg-white dark:bg-primary-dark hover:border-[#d6a536]/50 dark:hover:border-yellow hover:shadow-md"
        } rounded-xl w-full p-5 cursor-pointer transition-all duration-200`}
      >
        {isMain && (
           <div className="absolute -top-3 ltr:left-4 rtl:right-4 bg-[#d6a536] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
             {selectedContent[localizationKeys.default]}
           </div>
        )}
        <div className="flex justify-between items-start pt-1">
          <h1 className="text-[#34415C] dark:text-white font-bold text-base">{AddressLable}</h1>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                />
                <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 min-w-[160px] bg-white dark:bg-[#1A1F2C] rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col py-1.5">
                    {!isMain && (
                      <button
                        onClick={(e) => handleMakeDefault(e)}
                        className="text-left ltr:text-left rtl:text-right text-sm text-gray-700 dark:text-gray-300 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#22283A] font-medium transition-colors"
                      >
                        {selectedContent[localizationKeys.makeDefault]}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditModalOpen(true);
                        setOpen(false);
                      }}
                      className="text-left ltr:text-left rtl:text-right text-sm text-gray-700 dark:text-gray-300 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#22283A] font-medium transition-colors"
                    >
                      {selectedContent[localizationKeys.edit]}
                    </button>
                    {!isMain && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
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
          <p className="text-gray-500 text-sm truncate">{Address}</p>
          <p className="text-gray-500 text-sm truncate">
            {City}, {Country}
          </p>
          <div className="flex gap-4">
            <p className="text-gray-500 text-sm">{phone}</p>
            <p className="text-gray-500 text-sm">{PostalCode}</p>
          </div>
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
