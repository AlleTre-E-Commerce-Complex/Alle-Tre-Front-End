import React, { useEffect, useState } from "react";

import routes from "../../../routes";
import { useHistory } from "react-router-dom";
import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import { CreateAuctionBreadcrumb } from "../../../component/shared/bread-crumb/Breadcrumb";
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
import LoadingProgress from "../../../component/shared/lotties-file/LoadingProgress";
import { BsThreeDots } from "react-icons/bs";
import ConfirmationModal from "../../../component/shared/delete-modal/delete-modal";
import TermsAndConditionsModal from "../../../component/shared/terms-and-condition/TermsAndConditionsModal";

const ListingProductsLocationDetails = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const dispatch = useDispatch();

  const productDetailsInt = useSelector(
    (state) => state.listingProductDetails.listingProductDetails
  );

  const [locationId] = useFilter("locationId", "");

  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [locatonData, setLocationData] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [totalUploadingFiles, setTotalUploadingFiles] = useState(0);
  const [currentUploadingFile, setCurrentUploadingFile] = useState(0);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

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
  } = useAxios([]);

  const listProduct = (isDraft = false) => {
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
      const additionalFields = [
        "priceType",
        "brand",
        "usageStatus",
        "color",
        "age",
        "landType",
        "cameraType",
        "carType",
        "material",
        "memory",
        "model",
        "processor",
        "ramSize",
        "releaseYear",
        "screenSize",
        "totalArea",
        "operatingSystem",
        "regionOfManufacture",
        "numberOfFloors",
        "numberOfRooms",
        "countryId",
        "cityId",
        "emirate",
        "totalClosingFee",
        "numberOfBathrooms",
        "developer",
        "readyBy",
        "annualCommunityFee",
        "isFurnished",
        "propertyReferenceId",
        "buyerTransferFee",
        "sellerTransferFee",
        "maintenanceFee",
        "occupancyStatus",
        "amenities",
        "zonedFor",
        "approvedBuildUpArea",
        "freehold",
        "residentialType",
        "commercialType",
        "trim",
        "regionalSpecs",
        "kilometers",
        "insuredInUae",
        "interiorColor",
        "warranty",
        "fuelType",
        "doors",
        "transmissionType",
        "seatingCapacity",
        "horsepower",
        "steeringSide",
        "engineCapacity",
        "numberOfCylinders",
        "driverAssistance",
        "entertainment",
        "comfort",
        "exteriorFeatures",
        "isArbon",
        "arbonAmount",
      ];
      if (productDetailsInt.itemDescription) {
        formData.append(
          "product[description]",
          productDetailsInt.itemDescription
        );
      }

      additionalFields.forEach((field) => {
        if (
          productDetailsInt[field] !== undefined &&
          productDetailsInt[field] !== null &&
          productDetailsInt[field] !== ""
        ) {
          formData.append(
            `product[${field}]`,
            Array.isArray(productDetailsInt[field])
              ? JSON.stringify(productDetailsInt[field])
              : productDetailsInt[field]
          );
        }
      });
      
      if (productDetailsInt.images && Array.isArray(productDetailsInt.images)) {
        productDetailsInt.images.forEach((image, index) => {
          if (image.file) {
            formData.append("images", image.file);
          }
        });
      }

      if (productDetailsInt.auctionId) {
        formData.append("auctionId", productDetailsInt.auctionId);
      }


      const imagesToUpload = productDetailsInt.images?.filter(img => img.file) || [];
      setTotalUploadingFiles(imagesToUpload.length);
      setIsUploading(true);
      setUploadProgress(0);
      setCurrentUploadingFile(0);

      // We remove images from the initial metadata POST to handle them sequentially for progress feedback
      const metadataOnlyFormData = new FormData();
      for (let [key, value] of formData.entries()) {
        if (key !== "images") {
          metadataOnlyFormData.append(key, value);
        }
      }

      runListNewProduct(
        authAxios
          .post(isDraft ? api.app.auctions.setAssdraft : api.app.productListing.listNewProduct, metadataOnlyFormData)
          .then(async (res) => {
            const productId = res?.data?.data?.productId || res?.data?.data?.id;
            
            if (productId && imagesToUpload.length > 0) {
              for (let i = 0; i < imagesToUpload.length; i++) {
                const image = imagesToUpload[i];
                setCurrentUploadingFile(i + 1);
                setUploadProgress(0);

                const imgFormData = new FormData();
                imgFormData.append("image", image.file);
                
                await authAxios.patch(
                  api.app.Imagees.upload(productId, true), 
                  imgFormData,
                  {
                    onUploadProgress: (progressEvent) => {
                      const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                      );
                      setUploadProgress(percentCompleted);
                    },
                  }
                );
              }
            }

            toast.success(
              isDraft 
                ? selectedContent[localizationKeys.draftSavedSuccessfully]
                : selectedContent[localizationKeys.ProductListedSuccessfully]
            );
            
            if (isDraft) {
               history.push(routes.app.profile.myProducts.drafts);
            } else {
               history.push(routes.app.listProduct.details(productId));
            }
            
            dispatch(listingProductDetails({}));
            setIsTermsModalOpen(false);
          })
          .catch((err) => {
            console.error("Listing error:", err);
            toast.error(selectedContent[localizationKeys.oops]);
          })
          .finally(() => {
            setIsUploading(false);
          })
      );
    } else {
      toast.error(
        selectedContent[
          localizationKeys
            .makeSureThatYouChooseTheLocationOrCreateAnotherOne
        ]
      );
    }
  };

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50 dark:bg-[#09090b]/40 backdrop-blur-xl z-[9999]"
        active={isLoading || isLoadingListNewProduct || isUploading}
      >
        <LoadingProgress 
          status={
            isUploading 
              ? currentUploadingFile > 0 
                ? selectedContent[localizationKeys.uploadingPhoto]
                    ?.replace("{current}", currentUploadingFile)
                    ?.replace("{total}", totalUploadingFiles)
                : selectedContent[localizationKeys.bulkUploading]?.replace("{count}", totalUploadingFiles)
              : ""
          } 
          currentStep={currentUploadingFile > 0 ? currentUploadingFile : undefined}
          totalSteps={totalUploadingFiles > 0 ? totalUploadingFiles : undefined}
          progress={isUploading ? uploadProgress : undefined} 
        />
      </Dimmer>
      <div className="mt-32 sm:mt-44 animate-in max-w-[1366px] md:mx-auto mx-5 pb-20">
        <div className="max-w-[1366px] mx-auto mb-16">
          <div className="hidden sm:block mb-10">
            <CreateAuctionBreadcrumb />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 dark:border-white/5 pb-8">
            <div>
              <h1 className="font-black text-3xl text-gray-900 dark:text-white mb-2">
                {selectedContent[localizationKeys.locationDetails]}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Select your preferred collection or shipping point
              </p>
            </div>
            
            <button
               onClick={() => setOpen(true)}
               className="flex items-center justify-center gap-2 bg-zinc-900 dark:bg-[#d4af37] text-white dark:text-black px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-zinc-200 dark:shadow-[#d4af37]/10 active:scale-95"
            >
               <GoPlus className="w-5 h-5" />
               <span>{selectedContent[localizationKeys.addAddress]}</span>
            </button>
          </div>
        </div>

        <div className="max-w-[1366px] mx-auto">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-2">
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
            {/* Minimalist Add Card */}
            <div 
              onClick={() => setOpen(true)}
              className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 min-h-[160px] cursor-pointer group hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#d4af37] group-hover:text-black transition-all text-gray-400">
                <GoPlus className="w-6 h-6" />
              </div>
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">{selectedContent[localizationKeys.addAddress]}</span>
            </div>
          </div>
          {/* <button
          onClick={() => history.push(routes.createAuction.paymentDetails)}
        >
          go to paymentDetails
        </button> */}
          {/* buttons */}
          <div className="flex justify-end items-center gap-4 mt-28">
            <button
              className="px-8 h-[48px] rounded-lg border border-primary-light dark:border-white/10 text-gray-500 dark:text-gray-400 font-semibold text-base hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => history.push(routes.app.listProduct.default)}
            >
              {selectedContent[localizationKeys.back]}
            </button>
            <button
              className="bg-primary hover:bg-primary-dark dark:bg-yellow dark:hover:bg-yellow-dark sm:w-[220px] w-full h-[48px] rounded-lg dark:text-black text-white font-semibold text-base rtl:font-serifAR ltr:font-serifEN transition-colors flex items-center justify-center gap-2"
              onClick={() => setIsTermsModalOpen(true)}
              disabled={isLoadingListNewProduct}
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
        <TermsAndConditionsModal 
          open={isTermsModalOpen}
          setOpen={setIsTermsModalOpen}
          onList={() => listProduct(false)}
          onDraft={() => listProduct(true)}
          isLoading={isLoadingListNewProduct}
        />
      </div>
    </>
  );
};

export const LocationDetailsCard = ({
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
        className={`relative group border-2 ${
          locationId === `${Id}`
            ? "border-primary dark:border-[#d4af37] bg-primary/5 dark:bg-[#d4af37]/5 shadow-[0_10px_30px_rgba(212,175,55,0.15)] ring-1 ring-[#d4af37]/20"
            : "border-gray-100 dark:border-white/5 bg-white dark:bg-[#22283A]/40 hover:border-[#d6a536]/30 dark:hover:border-[#d4af37]/30 hover:shadow-xl"
        } rounded-2xl w-full p-5 cursor-pointer transition-all duration-300 ease-out transform hover:-translate-y-1`}
      >
        {isMain && (
           <div className="absolute -top-3.5 ltr:left-6 rtl:right-6 bg-gradient-to-r from-[#d6a536] to-[#b8860b] text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-[#d6a536]/20 uppercase tracking-[0.15em] z-10 border border-white/20">
             {selectedContent[localizationKeys.default]}
           </div>
        )}
        <div className="flex justify-between items-start pt-1 gap-2">
          <h1 className="text-gray-950 dark:text-white font-black text-base tracking-tight truncate">{AddressLable}</h1>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(!open)}
              className="cursor-pointer text-gray-400 hover:text-[#d6a536] transition-all p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 active:scale-90"
            >
              <BsThreeDots size={18} />
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
                <div className="absolute top-full ltr:right-0 rtl:left-0 mt-3 min-w-[180px] bg-white dark:bg-[#1A2131] rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-3xl">
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

        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-1.5">
             <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed line-clamp-2">{Address}</p>
          </div>
          
          <div className="flex items-center gap-1.5 text-gray-900 dark:text-white/80 font-bold text-xs uppercase tracking-wider">
            <span>{City}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
            <span>{Country}</span>
          </div>

          <div className="pt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-gray-50 dark:border-white/5">
            <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Phone</span>
               <p className="text-zinc-600 dark:text-zinc-400 text-xs font-bold tabular-nums">{phone}</p>
            </div>
            {PostalCode && (
              <div className="flex items-center gap-1.5">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Postal</span>
                 <p className="text-zinc-600 dark:text-zinc-400 text-xs font-bold tabular-nums">{PostalCode}</p>
              </div>
            )}
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
