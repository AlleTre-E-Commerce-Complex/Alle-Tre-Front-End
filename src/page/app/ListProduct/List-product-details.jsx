import React, { useState, useEffect } from "react";

import { useHistory, useLocation } from "react-router-dom";
import routes from "../../../routes";

import { CheckboxRadioProductDetails } from "../../../component/create-auction-components/check-box-radio-group";
import { CreateAuctionBreadcrumb } from "../../../component/shared/bread-crumb/Breadcrumb";
// import AddImgMedia from "../../../component/create-auction-components/add-img-media";
import Stepper from "../../../component/shared/stepper/stepper-app";
import { Dimmer, Form, Popup } from "semantic-ui-react";
import { toast } from "react-hot-toast";

import { ScrollToFieldError } from "../../../component/shared/formik/formik-scroll-to-field-error";
import FormikMultiDropdown from "../../../component/shared/formik/formik-dropdown";
import FormikTextArea from "../../../component/shared/formik/formik-text-area";
import FormikInput from "../../../component/shared/formik/formik-input";
import { Formik } from "formik";
import * as Yup from "yup";

import api from "../../../api";
import useAxios from "../../../hooks/use-axios";
import useGetBrand from "../../../hooks/use-get-brand";
import { authAxios } from "../../../config/axios-config";
import useGetGatogry from "../../../hooks/use-get-category";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";

import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import { useDispatch, useSelector } from "react-redux";
import useGetAllCountries from "../../../hooks/use-get-all-countries";
import useGetAllCities from "../../../hooks/use-get-all-cities";
// import EditImgeMedia from "../../../component/create-auction-components/edit-imge-media";
import localizationKeys from "../../../localization/localization-keys";
// import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
import LoadingProgress from "../../../component/shared/lotties-file/LoadingProgress";
import {
  IoCameraOutline,
  IoImageOutline,
  IoInformationCircleOutline,
  IoPricetagOutline,
  IoRibbonOutline,
} from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import ImageMedia from "component/create-auction-components/ImageMedia";
import { listingProductDetails } from "redux-store/ListingProduct-details-slice";
import watermarkImage from "../../../../src/assets/logo/WaterMarkFinal.png";
import CarSpecifications from "../../../component/create-auction-components/CarSpecifications";
import PropertySpecifications from "../../../component/create-auction-components/PropertySpecifications";
const ListProductDetails = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { state } = useLocation();

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [auctionState, setAuctionState] = useState();
  const [completeDraftVal, setCompleteDraftValue] = useState();
  const [loadingImg, setLoadingImg] = useState();
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const { run, isLoading } = useAxios([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [draftValue, setDraftValue] = useState();
  const [imgtest, setimgtest] = useState([]);

  const [listedProductVal, setListedProductVal] = useState();


  const [countriesId, setCountriesId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [subCategoryId, setSubCategoryId] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [product_Id] = useState(state?.productId || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalUploadingFiles, setTotalUploadingFiles] = useState(0);
  const [currentUploadingFile, setCurrentUploadingFile] = useState(0);

  const reduxValues = useSelector((state) => state.listingProductDetails.listingProductDetails);

  useEffect(() => {
    if (state?.isEditing) {
      setIsEditing(true);
    }
  }, [state]);

  // Sync with Redux values if not editing and they exist
  useEffect(() => {
    if (!isEditing && reduxValues && Object.keys(reduxValues).length > 0) {
      if (reduxValues.images && imgtest.length === 0) {
        setimgtest(reduxValues.images);
      }
      if (reduxValues.category && !categoryId) {
        setCategoryId(reduxValues.category);
      }
      if (reduxValues.subCategory && !subCategoryId) {
        setSubCategoryId(reduxValues.subCategory);
      }
      if (reduxValues.countryId && !countriesId) {
        setCountriesId(reduxValues.countryId);
      }
    }
  }, [reduxValues, isEditing, imgtest.length, categoryId, subCategoryId, countriesId]);

  useEffect(() => {
    if (isEditing && listedProductVal) {
      setCategoryId(listedProductVal.categoryId);
      setSubCategoryId(listedProductVal.subCategory?.id);
    }
  }, [isEditing, listedProductVal]);
  //   const [hasUsageCondition, setHasUsageCondition] = useState(
  //     completeDraftVal?.product?.category?.hasUsageCondition ||
  //       productDetailsint.hasUsageCondition ||
  //       true
  //   );
  const [customFromData, setCustomFromData] = useState();
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry } = useGetSubGatogry(categoryId);
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();
  const { AllCitiesOptions, loadingCitiesOptions } =
    useGetAllCities(countriesId);

  const { NotAllBranOptions, loadingAllBranOptions } = useGetBrand(categoryId);

  // Auto-select UAE logic
  useEffect(() => {
    const uae = AllCountriesOptions?.find((opt) => opt.text === "United Arab Emirates" || opt.text === "الإمارات العربية المتحدة");
    if (uae && !countriesId) {
      setCountriesId(uae.value);
    }
  }, [AllCountriesOptions, countriesId]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [brandInput, setBrandInput] = useState("");
  const [brandSuggestions, setBrandSuggestions] = useState([]);

  const handleBrandInputChange = (value) => {
    setBrandInput(value);
    const filteredBrands = NotAllBranOptions.filter((brand) =>
      brand.text?.toLowerCase().includes(value.toLowerCase()),
    );
    setBrandSuggestions(filteredBrands);
  };

  useEffect(() => {
    if (state?.auctionId) {
      run(
        authAxios
          .get(api.app.auctions.getAuctionsDetails(state.auctionId))
          .then((res) => {
            const draftData = res?.data?.data;
            const productData = draftData?.product;
            setListedProductVal(productData);
            setAuctionState(draftData?.status);
            setCompleteDraftValue(draftData);

            if (productData?.images?.length > 0) {
              const formattedImages = productData.images.map((img) => {
                const isVideo =
                  img.imagePath?.toLowerCase().includes("video") ||
                  img.imageLink?.toLowerCase().includes("video");
                return {
                  id: img.id,
                  imageLink: img.imageLink || img.imagePath,
                  imagePath: img.imagePath,
                  isVideo: isVideo,
                  isCoverPhoto: img.isCoverPhoto || false,
                };
              });
              setimgtest(formattedImages);
            }

            if (productData?.categoryId) setCategoryId(productData.categoryId);
            if (productData?.subCategoryId) setSubCategoryId(productData.subCategoryId);
          }),
      );
    } else if (product_Id) {
      run(
        authAxios
          .get(api.app.productListing.listedProduct(product_Id))
          .then((res) => {
            const productData = res?.data?.data?.product;
            setListedProductVal(productData);

            // Set initial images if available
            if (productData?.images?.length > 0) {
              const formattedImages = productData.images.map((img) => {
                const isVideo =
                  img.imagePath?.toLowerCase().includes("video") ||
                  img.imageLink?.toLowerCase().includes("video");
                return {
                  id: img.id, // Keep the image ID for deletion
                  imageLink: img.imageLink || img.imagePath,
                  imagePath: img.imagePath,
                  isVideo: isVideo,
                  isCoverPhoto: img.isCoverPhoto || false,
                };
              });
              setimgtest(formattedImages);
            }

            // Set category and subcategory IDs for dropdown population
            if (productData?.categoryId) {
              setCategoryId(productData.categoryId);
            }
            if (productData?.subCategoryId) {
              setSubCategoryId(productData.subCategoryId);
            }
          }),
      );
    }
  }, [run, product_Id, state?.auctionId]);

  const addImageWatermark = async (file) => {
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      const [img, watermarkImg] = await Promise.all([
        loadImage(URL.createObjectURL(file)),
        loadImage(watermarkImage),
      ]);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Calculate watermark dimensions
      const maxDim = Math.max(img.width, img.height);
      let watermarkWidth = maxDim * 0.4;
      if (watermarkWidth > img.width * 0.8) {
        watermarkWidth = img.width * 0.8;
      }
      const watermarkHeight =
        (watermarkImg.height / watermarkImg.width) * watermarkWidth;

      // Center watermark
      const x = (img.width - watermarkWidth) / 2;
      const y = (img.height - watermarkHeight) / 2;

      // Draw watermark with opacity
      ctx.globalAlpha = 0.5;
      ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
      ctx.globalAlpha = 1.0;

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const watermarkedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: new Date().getTime(),
              });
              resolve(watermarkedFile);
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/jpeg",
          0.8,
        );
      });
    } catch (error) {
      console.warn("Watermark process failed, skipping:", error);
      return file;
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const currentImages = imgtest || [];
    if (currentImages.length + files.length > 50) {
      toast.error(
        selectedContent[localizationKeys.youCanOnlySelectUpToFiftyImages],
      );
      event.target.value = null;
      return;
    }

    // Check if there's already a video in the current images
    const hasExistingVideo = currentImages.some((img) =>
      img.file.type.startsWith("video/"),
    );

    // Check if any of the new files is a video
    const newVideos = files.filter((file) => file.type.startsWith("video/"));

    // If trying to upload a video as first item
    if (currentImages.length === 0 && newVideos.length > 0) {
      toast.error(
        selectedContent[
          localizationKeys
            .videoCannotBeTheFirstUploadPleaseUploadAnImageFirstAsItWillBeUsedAsTheCover
        ],
      );
      event.target.value = null;
      return;
    }

    // If there's already a video or if trying to upload multiple videos
    if ((hasExistingVideo && newVideos.length > 0) || newVideos.length > 1) {
      toast.error(selectedContent[localizationKeys.onlyOneVideoFileIsAllowed]);
      event.target.value = null;
      return;
    }

    try {
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          const watermarkedFile = await addImageWatermark(file);
          return {
            file: watermarkedFile,
            imageLink: URL.createObjectURL(watermarkedFile),
          };
        }),
      );
      setimgtest([...currentImages, ...processedFiles]);
    } catch (error) {
      toast.error(selectedContent[localizationKeys.errorProcessingImages]);
    }
  };

  const handleCameraChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Get current images array
      const currentImages = imgtest || [];

      if (currentImages.length >= 50) {
        toast.error(
          selectedContent[localizationKeys.youCanOnlySelectUpToFiftyImages],
        );
        event.target.value = null;
        return;
      }

      const hasExistingVideo = currentImages.some((img) =>
        img.file.type.startsWith("video/"),
      );

      const isVideo = file.type.startsWith("video/");

      if (currentImages.length === 0 && isVideo) {
        toast.error(
          selectedContent[
            localizationKeys
              .videoCannotBeTheFirstUploadPleaseUploadAnImageFirstAsItWillBeUsedAsTheCover
          ],
        );
        event.target.value = null;
        return;
      }

      if (hasExistingVideo && isVideo) {
        toast.error(
          selectedContent[localizationKeys.onlyOneVideoFileIsAllowed],
        );
        event.target.value = null;
        return;
      }

      try {
        const watermarkedFile = await addImageWatermark(file);
        const newImage = {
          file: watermarkedFile,
          imageLink: URL.createObjectURL(watermarkedFile),
        };
        setimgtest([...currentImages, newImage]);
      } catch (error) {
        toast.error(selectedContent[localizationKeys.errorProcessingImages]);
      }
    }
  };

  useEffect(() => {
    if (categoryId || subCategoryId || loadingImg) {
      if (SubGatogryOptions.length === 0) {
        run(
          authAxios
            .get(api.app.customField.ByCategoryId(categoryId))
            .then((res) => {
              setCustomFromData(res?.data?.data);
            }),
        );
      } else
        run(
          authAxios
            .get(api.app.customField.BySubCategoryId(subCategoryId))
            .then((res) => {
              setCustomFromData(res?.data?.data);
            }),
        );
    }
  }, [run, categoryId, subCategoryId, SubGatogryOptions.length, loadingImg]);

  // const optionalCarSpecs = [
  //   "transmissionType", "steeringSide", "seatingCapacity", "horsepower",
  //   "numberOfCylinders", "fuelType", "doors", "engineCapacity", "trim",
  //   "kilometers", "regionalSpecs", "carType", "color", "interiorColor",
  //   "releaseYear", "insuredInUae", "warranty", "driverAssistance",
  //   "entertainment", "comfort", "exteriorFeatures"
  // ];

  // const arrayCustomFieldsvalidations =
  //   customFromData?.arrayCustomFields?.reduce((acc, curr) => {
  //     if (!optionalCarSpecs.includes(curr.key)) {
  //       acc[curr.key] = Yup.string().required(
  //         selectedContent[localizationKeys.required],
  //       );
  //     }
  //     return acc;
  //   }, {});

  const isArabic = lang === "ar";

  const getCleanedValues = (formValues) => {
    const catId = Number(formValues.category);
    const catName = GatogryOptions?.find((opt) => String(opt.value) === String(formValues.category))?.name?.toLowerCase();
    
    const isCarCategory = catId === 4 || catName === "cars";
    const isPropertyCategory = catId === 7 || catId === 19 || catId === 23 || ["properties", "عقارات", "propertiess"].includes(catName);

    const cleanValues = { ...formValues };
    if (!isCarCategory) {
      const carFields = ["trim", "regionalSpecs", "kilometers", "insuredInUae", "interiorColor", "warranty", "fuelType", "doors", "transmissionType", "seatingCapacity", "horsepower", "steeringSide", "engineCapacity", "numberOfCylinders", "driverAssistance", "entertainment", "comfort", "exteriorFeatures", "carType"];
      carFields.forEach(f => delete cleanValues[f]);
    }
    if (!isPropertyCategory) {
      const propFields = ["totalClosingFee", "numberOfBathrooms", "developer", "readyBy", "annualCommunityFee", "isFurnished", "propertyReferenceId", "buyerTransferFee", "sellerTransferFee", "maintenanceFee", "occupancyStatus", "amenities", "zonedFor", "approvedBuildUpArea", "freehold", "residentialType", "commercialType", "numberOfRooms", "totalArea"];
      // emirate is allowed for both cars and properties, and countryId/cityId are global
      if (!isCarCategory) {
        delete cleanValues["emirate"];
      }
      propFields.forEach(f => delete cleanValues[f]);
    }

    return cleanValues;
  };

  const handleUpdate = async (rawValues) => {
    const values = getCleanedValues(rawValues);
    
    if ((imgtest?.length || 0) < 3) {
      toast.error(selectedContent[localizationKeys.makeSureThatYouChooseAtLeastThreeOrMorePhotos]);
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      // Append all images to formData
      const allImages = imgtest || [];
      allImages.forEach((image) => {
        if (image?.file) {
          formData.append("images", image.file);
        }
      });
      // Append all other fields from values
      formData.append("product[title]", values.itemName);
      formData.append("product[categoryId]", values.category);
      formData.append("product[subCategoryId]", values.subCategory);
      console.log(
        "Updating with category:",
        values.category,
        "subcategory:",
        values.subCategory,
      );
      formData.append("product[ProductListingPrice]", values.itemPrice);
      formData.append("product[priceType]", values.priceType);
      formData.append("product[isArbon]", values.isArbon);
      if (values.isArbon && values.arbonAmount) {
        formData.append("product[arbonAmount]", values.arbonAmount);
      }
      if (values.brand) formData.append("product[brand]", values.brand);
      if (values.usageStatus) {
        formData.append("product[usageStatus]", values.usageStatus);
      } else {
        toast.error(selectedContent[localizationKeys.oops]);
        return;
      }
      if (values.color) formData.append("product[color]", values.color);
      if (values.age) formData.append("product[age]", values.age);
      if (values.landType)
        formData.append("product[landType]", values.landType);
      if (values.cameraType)
        formData.append("product[cameraType]", values.cameraType);
      if (values.carType) formData.append("product[carType]", values.carType);
      if (values.material)
        formData.append("product[material]", values.material);
      if (values.memory) formData.append("product[memory]", values.memory);
      if (values.model) formData.append("product[model]", values.model);
      if (values.processor)
        formData.append("product[processor]", values.processor);
      if (values.ramSize) formData.append("product[ramSize]", values.ramSize);
      if (values.releaseYear)
        formData.append("product[releaseYear]", values.releaseYear);
      if (values.screenSize)
        formData.append("product[screenSize]", values.screenSize);
      if (values.totalArea)
        formData.append("product[totalArea]", values.totalArea);
      if (values.operatingSystem)
        formData.append("product[operatingSystem]", values.operatingSystem);
      if (values.trim) formData.append("product[trim]", values.trim);
      if (values.regionalSpecs) formData.append("product[regionalSpecs]", values.regionalSpecs);
      if (values.kilometers) formData.append("product[kilometers]", values.kilometers);
      if (values.insuredInUae) formData.append("product[insuredInUae]", values.insuredInUae);
      if (values.interiorColor) formData.append("product[interiorColor]", values.interiorColor);
      if (values.warranty) formData.append("product[warranty]", values.warranty);
      if (values.fuelType) formData.append("product[fuelType]", values.fuelType);
      if (values.doors) formData.append("product[doors]", values.doors);
      if (values.transmissionType) formData.append("product[transmissionType]", values.transmissionType);
      if (values.seatingCapacity) formData.append("product[seatingCapacity]", values.seatingCapacity);
      if (values.horsepower) formData.append("product[horsepower]", values.horsepower);
      if (values.steeringSide) formData.append("product[steeringSide]", values.steeringSide);
      if (values.engineCapacity) formData.append("product[engineCapacity]", values.engineCapacity);
      if (values.numberOfCylinders) formData.append("product[numberOfCylinders]", values.numberOfCylinders);
      if (values.driverAssistance?.length) formData.append("product[driverAssistance]", JSON.stringify(values.driverAssistance));
      if (values.entertainment?.length) formData.append("product[entertainment]", JSON.stringify(values.entertainment));
      if (values.comfort?.length) formData.append("product[comfort]", JSON.stringify(values.comfort));
      if (values.exteriorFeatures?.length) formData.append("product[exteriorFeatures]", JSON.stringify(values.exteriorFeatures));
      if (values.regionOfManufacture)
        formData.append(
          "product[regionOfManufacture]",
          values.regionOfManufacture,
        );
      if (values.numberOfFloors)
        formData.append("product[numberOfFloors]", values.numberOfFloors);
      if (values.residentialType)
        formData.append("product[residentialType]", values.residentialType);
      if (values.commercialType)
        formData.append("product[commercialType]", values.commercialType);
      if (values.numberOfRooms)
        formData.append("product[numberOfRooms]", values.numberOfRooms);
      if (values.itemDescription)
        formData.append("product[description]", values.itemDescription);
      if (values.countryId) formData.append("product[countryId]", values.countryId);
      if (values.cityId) formData.append("product[cityId]", values.cityId);
      if (values.emirate) formData.append("product[emirate]", values.emirate);
      if (values.totalClosingFee) formData.append("product[totalClosingFee]", values.totalClosingFee);
      if (values.numberOfBathrooms) formData.append("product[numberOfBathrooms]", values.numberOfBathrooms);
      if (values.developer) formData.append("product[developer]", values.developer);
      if (values.readyBy) formData.append("product[readyBy]", values.readyBy);
      if (values.annualCommunityFee) formData.append("product[annualCommunityFee]", values.annualCommunityFee);
      if (values.isFurnished) formData.append("product[isFurnished]", values.isFurnished);
      if (values.propertyReferenceId) formData.append("product[propertyReferenceId]", values.propertyReferenceId);
      if (values.buyerTransferFee) formData.append("product[buyerTransferFee]", values.buyerTransferFee);
      if (values.sellerTransferFee) formData.append("product[sellerTransferFee]", values.sellerTransferFee);
      if (values.maintenanceFee) formData.append("product[maintenanceFee]", values.maintenanceFee);
      if (values.occupancyStatus) formData.append("product[occupancyStatus]", values.occupancyStatus);
      if (values.zonedFor) formData.append("product[zonedFor]", values.zonedFor);
      if (values.amenities?.length) formData.append("product[amenities]", JSON.stringify(values.amenities));

      // Add productId if needed for the update API

      if (product_Id) {
        console.log("product_Id", product_Id);
        formData.append("productId", product_Id);
      }

      // Send the update request
      const response = await authAxios.put(
        api.app.productListing.updateListedProduct(product_Id),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.status === 200) {
        toast.success(
          selectedContent[localizationKeys.productUpdatedSuccessfully],
        );
        history.push(routes.app.listProduct.details(product_Id));
      }
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage = error?.response?.data?.message;
      
      let displayError = selectedContent[localizationKeys.somethingWentWrongPleaseTryAgainLater];
      
      if (typeof errorMessage === "string") {
        displayError = errorMessage;
      } else if (typeof errorMessage === "object" && errorMessage !== null) {
        displayError = errorMessage[lang] || errorMessage.en || errorMessage.ar || displayError;
      } else if (error?.message) {
        displayError = error.message;
      }

      toast.error(displayError);
    } finally {
      setIsUpdating(false);
    }
  };

  const model = customFromData?.model?.key;

  const carMandatoryFields = [
    "carType", "color",
    "interiorColor", "releaseYear", "insuredInUae","warranty"
  ].reduce((acc, field) => {
    acc[field] = Yup.string().when("category", {
      is: (cat) => String(cat) === "4" || GatogryOptions?.find(o => String(o.value) === String(cat))?.name === "Cars",
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    });
    return acc;
  }, {});

  const propertyMandatoryFields = [
    "totalArea", "numberOfRooms", "zonedFor", "occupancyStatus", "isFurnished", "numberOfBathrooms"
  ].reduce((acc, field) => {
    acc[field] = Yup.string().when(["category", "subCategory"], {
      is: (cat, subCat) => {
        const isProperty = String(cat) === "7" || GatogryOptions?.find(o => String(o.value) === String(cat))?.name === "Properties";
        if (!isProperty) return false;

        const subCatObj = SubGatogryOptions?.find(o => String(o.value) === String(subCat));
        const subCatText = (subCatObj?.text || subCatObj?.name || "").toLowerCase();
        
        const isResidential = subCatText.includes("residential") || subCatText.includes("سكني") || subCatText.includes("house") || subCatText.includes("villa") || subCatText.includes("townhouse");
        const isCommercial = subCatText.includes("commercial") || subCatText.includes("تجاري") || subCatText.includes("office") || subCatText.includes("retail") || subCatText.includes("warehouse");
        const isMultipleUnits = subCatText.includes("multiple units") || subCatText.includes("وحدات متعددة");
        const isLand = subCatText.includes("land") || subCatText.includes("أرض");

        if (field === "totalArea") return true;
        if (field === "numberOfRooms" || field === "numberOfBathrooms") return isResidential;
        if (field === "isFurnished") return isResidential || isCommercial;
        if (field === "occupancyStatus") return isResidential || isCommercial || isMultipleUnits;
        if (field === "zonedFor") return isLand || isMultipleUnits;
        
        return false;
      },
      then: (schema) => schema.required(selectedContent[localizationKeys.required]),
      otherwise: (schema) => schema.notRequired(),
    });
    return acc;
  }, {});

  const ProductDetailsSchema = Yup.object({
    itemName: Yup.string()
      .trim()
      .typeError(selectedContent[localizationKeys.required])
      .required(selectedContent[localizationKeys.required]),
    itemPrice: Yup.number().required(
      selectedContent[localizationKeys.required],
    ),
    category: Yup.string()
      .trim()
      .typeError(selectedContent[localizationKeys.required])
      .required(selectedContent[localizationKeys.required]),
    countryId: Yup.string().required(selectedContent[localizationKeys.required]),
    cityId: Yup.string().required(selectedContent[localizationKeys.required]),
    itemDescription: Yup.string()
      .trim()
      .notRequired(),
    // ...regularCustomFieldsvalidations,
    // ...arrayCustomFieldsvalidations,
    ...carMandatoryFields,
    ...propertyMandatoryFields,
    ...(model ? {
      [model]: Yup.string().required(selectedContent[localizationKeys.required])
    } : {}),
    brand: Yup.string().when("category", {
      is: (cat) => {
        const catName = GatogryOptions?.find((opt) => String(opt.value) === String(cat))?.name;
        return String(cat) !== "3" && String(cat) !== "7" && !["Properties", "عقارات", "Propertiess"].includes(catName);
      },
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
    residentialType: Yup.string().when("subCategory", {
      is: (subCat) => {
        const subCatObj = SubGatogryOptions?.find((opt) => String(opt.value) === String(subCat));
        const subCatName = subCatObj?.text?.toLowerCase() || subCatObj?.name?.toLowerCase() || "";
        return subCatName.includes("residential") || subCatName.includes("سكني") || subCatName.includes("house") || subCatName.includes("villa") || subCatName.includes("townhouse");
      },
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
    commercialType: Yup.string().when("subCategory", {
      is: (subCat) => {
        const subCatObj = SubGatogryOptions?.find((opt) => String(opt.value) === String(subCat));
        const subCatName = subCatObj?.text?.toLowerCase() || subCatObj?.name?.toLowerCase() || "";
        return subCatName.includes("commercial") || subCatName.includes("تجاري") || subCatName.includes("office") || subCatName.includes("retail") || subCatName.includes("warehouse");
      },
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
    subCategory: Yup.string().when([], {
      is: () => SubGatogryOptions?.length === 0,
      then: Yup.string().notRequired(),
      otherwise: Yup.string().required(
        selectedContent[localizationKeys.required],
      ),
    }),
    usageStatus: Yup.string().required(selectedContent[localizationKeys.required]),
    isArbon: Yup.boolean(),
    arbonAmount: Yup.number().when("isArbon", {
      is: true,
      then: Yup.number().required(selectedContent[localizationKeys.required]).min(1, selectedContent[localizationKeys.AmountMustBeMoreThan1AED]),
      otherwise: Yup.number().notRequired(),
    }),
  });

  const DraftSaver = ({ values, setDraftValue }) => {
    React.useEffect(() => {
      setDraftValue(values);
    }, [values, setDraftValue]);
    return null;
  };

  const SaveProductAsDraft = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const allImages = imgtest || [];
    allImages.forEach((image) => {
      if (image?.file) {
        formData.append("images", image.file);
      }
    });

    const fieldsToAppend = [
      "categoryId", "subCategoryId", "brand", "color", "age",
      "landType", "cameraType", "carType", "material", "memory", "model",
      "processor", "ramSize", "releaseYear", "screenSize", "totalArea",
      "operatingSystem", "trim", "regionalSpecs", "kilometers",
      "insuredInUae", "interiorColor", "warranty", "fuelType", "doors",
      "transmissionType", "seatingCapacity", "horsepower", "steeringSide",
      "engineCapacity", "numberOfCylinders", "regionOfManufacture",
      "numberOfFloors", "residentialType", "commercialType", "numberOfRooms",
      "countryId", "cityId", "emirate", "totalClosingFee", "numberOfBathrooms",
      "developer", "readyBy", "annualCommunityFee", "isFurnished", "propertyReferenceId",
      "buyerTransferFee", "sellerTransferFee", "maintenanceFee", "occupancyStatus", "zonedFor"
    ];

    if (draftValue) {
      if (draftValue.itemName) formData.append("title", draftValue.itemName);
      if (draftValue.itemDescription) formData.append("description", draftValue.itemDescription);
      if (draftValue.category) formData.append("categoryId", draftValue.category);
      if (draftValue.subCategory) formData.append("subCategoryId", draftValue.subCategory);
      if (draftValue.usageStatus) formData.append("usageStatus", draftValue.usageStatus);
      if (product_Id) formData.append("productId", product_Id);
      if(draftValue.itemPrice) formData.append("ProductListingPrice", draftValue.itemPrice);
      if(draftValue.priceType) formData.append("priceType", draftValue.priceType);
      formData.append("isArbon", draftValue.isArbon ? "true" : "false");
      if (draftValue.isArbon && draftValue.arbonAmount) formData.append("arbonAmount", draftValue.arbonAmount);
      if (state?.auctionId) formData.append("auctionId", state.auctionId);

      formData.append("isListedProduct", "true");
      formData.append("isAuction", "false");
      formData.append("type", "LISTED_PRODUCT");
      formData.append("product[type]", "LISTED_PRODUCT");
      formData.append("product[isListedProduct]", "true");

      const arrayFields = ["driverAssistance", "entertainment", "comfort", "exteriorFeatures", "amenities"];
      arrayFields.forEach((f) => {
        if (draftValue[f]?.length) formData.append(f, JSON.stringify(draftValue[f]));
      });

      fieldsToAppend.forEach((f) => {
        if (draftValue[f]) formData.append(f, draftValue[f]);
      });
    }

    setIsSavingDraft(true);
    try {
      const response = await authAxios.post(
        api.app.auctions.setAssdraft,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200 || response.data?.success) {
        try {
          const draftId = response?.data?.data?.id || state?.auctionId;
          if (draftId) {
            const types = JSON.parse(localStorage.getItem('alletre_draft_types') || '{}');
            types[draftId] = "LISTED_PRODUCT";
            localStorage.setItem('alletre_draft_types', JSON.stringify(types));
          }
        } catch (e) {
          console.warn("Could not save to localStorage");
        }

        toast.success(selectedContent[localizationKeys.draftSavedSuccessfully]);
        history.push(`${routes.app.profile.myProducts.default}?page=1&perPage=10`);
      } else {
        toast.error(selectedContent[localizationKeys.errorSavingDraft]);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      const errorMessage = error?.response?.data?.message;
      let displayError = selectedContent[localizationKeys.errorSavingDraft];
      if (typeof errorMessage === "string") {
        displayError = errorMessage;
      } else if (typeof errorMessage === "object" && errorMessage !== null) {
        displayError = errorMessage[lang] || errorMessage.en || errorMessage.ar || displayError;
      }
      toast.error(displayError);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handelProductDetailsdata = (rawValues) => {
    const values = getCleanedValues(rawValues);
    if (imgtest.length >= 3) {
      dispatch(
        listingProductDetails({
          ...values,
          priceType: values.priceType,
          images: imgtest.map((img) => ({
            file: img.file,
            imageLink: img.imageLink,
            imagePath: img.file ? img.file.name : (img.imagePath || img.imageLink),
          })),
          auctionState,
          auctionId: completeDraftVal?.id,
        }),
      );
      history.push(routes.app.listProduct.listProductLocationDetails);
    } else {
      toast.error(
        selectedContent[
          localizationKeys.makeSureThatYouChooseAtLeastThreeOrMorePhotos
        ],
      );
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const getOptionalLabel = (labelText) => (
    <div className="flex justify-between items-center w-full gap-2">
      <span>{labelText}</span>
      <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest leading-none">
        {isArabic ? "(اختياري)" : "(Optional)"}
      </span>
    </div>
  );

  const safeParseArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // Fall through to other checks if JSON parsing fails
        }
      }
      if (trimmed.includes(",")) {
        return trimmed.split(",").map((v) => v.trim()).filter((v) => v);
      }
    }
    return val ? [val] : [];
  };

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/20"
        active={isLoading || loadingSubGatogry || isUpdating || isSavingDraft }
      >
          <LoadingProgress 
            status={
              isUpdating || isSavingDraft
                ? currentUploadingFile > 0 
                  ? selectedContent[localizationKeys.uploadingPhoto]
                      ?.replace("{current}", currentUploadingFile)
                      ?.replace("{total}", totalUploadingFiles)
                  : selectedContent[localizationKeys.bulkUploading]?.replace("{count}", totalUploadingFiles)
                : ""
            } 
            currentStep={currentUploadingFile > 0 ? currentUploadingFile : undefined}
            totalSteps={totalUploadingFiles > 0 ? totalUploadingFiles : undefined}
            progress={(isUpdating || isSavingDraft) ? uploadProgress : undefined} 
          />
        </Dimmer>
        <div className="mt-32 sm:mt-44 animate-in max-w-[1366px] md:mx-auto mx-5 ">
          <div className="max-w-[1366px] mx-auto mb-12">
            {/* Breadcrumb - Clean top alignment */}
            <div className="hidden sm:block mb-8">
              <CreateAuctionBreadcrumb />
            </div>
            
            {/* Stepper - Primary focus with better breathing room */}
            {/* <div className="flex justify-center py-4 bg-gray-50/50 dark:bg-white/5 rounded-3xl backdrop-blur-sm border border-gray-100 dark:border-white/5 shadow-sm sm:shadow-none sm:border-none sm:bg-transparent">
              <Stepper />
            </div> */}
          </div>
          <div className="w-full flex flex-col gap-6 ">
            <div>
              <Formik
                initialValues={{
                  itemName: listedProductVal?.title || reduxValues?.itemName || "",
                  itemPrice: listedProductVal?.ProductListingPrice ?? reduxValues?.itemPrice ?? "",
                  category: listedProductVal?.categoryId || reduxValues?.category || "",
                  subCategory: listedProductVal?.subCategory?.id || reduxValues?.subCategory || "",
                  usageStatus: listedProductVal?.usageStatus || reduxValues?.usageStatus || "",
                  operatingSystem: listedProductVal?.operatingSystem || reduxValues?.operatingSystem || "",
                  releaseYear: listedProductVal?.releaseYear || reduxValues?.releaseYear || "",
                  regionOfManufacture: listedProductVal?.regionOfManufacture || reduxValues?.regionOfManufacture || "",
                  ramSize: listedProductVal?.ramSize || reduxValues?.ramSize || "",
                  processor: listedProductVal?.processor || reduxValues?.processor || "",
                  screenSize: listedProductVal?.screenSize || reduxValues?.screenSize || "",
                  model: listedProductVal?.model || reduxValues?.model || "",
                  color: listedProductVal?.color || reduxValues?.color || "",
                  brand: listedProductVal?.brand || reduxValues?.brand || "",
                  cameraType: listedProductVal?.cameraType || reduxValues?.cameraType || "",
                  material: listedProductVal?.material || reduxValues?.material || "",
                  type: listedProductVal?.type || reduxValues?.type || "",
                  memory: listedProductVal?.memory || reduxValues?.memory || "",
                  age: listedProductVal?.age || reduxValues?.age || "",
                  totalArea: listedProductVal?.totalArea || reduxValues?.totalArea || "",
                  numberOfRooms: listedProductVal?.numberOfRooms || reduxValues?.numberOfRooms || "",
                  numberOfFloors: listedProductVal?.numberOfFloors || reduxValues?.numberOfFloors || "",
                  landType: listedProductVal?.landType || reduxValues?.landType || "",
                  carType: listedProductVal?.carType || reduxValues?.carType || "",
                  countryId: listedProductVal?.countryId || reduxValues?.countryId || (AllCountriesOptions?.find((opt) => opt.text === "United Arab Emirates" || opt.text === "الإمارات العربية المتحدة")?.value || ""),
                  cityId: listedProductVal?.cityId || reduxValues?.cityId || "",
                  emirate: listedProductVal?.emirate || reduxValues?.emirate || "",
                  totalClosingFee: listedProductVal?.totalClosingFee || reduxValues?.totalClosingFee || "",
                  numberOfBathrooms: listedProductVal?.numberOfBathrooms || reduxValues?.numberOfBathrooms || "",
                  developer: listedProductVal?.developer || reduxValues?.developer || "",
                  readyBy: listedProductVal?.readyBy || reduxValues?.readyBy || "",
                  annualCommunityFee: listedProductVal?.annualCommunityFee || reduxValues?.annualCommunityFee || "",
                  isFurnished: listedProductVal?.isFurnished || reduxValues?.isFurnished || "",
                  propertyReferenceId: listedProductVal?.propertyReferenceId || reduxValues?.propertyReferenceId || "",
                  buyerTransferFee: listedProductVal?.buyerTransferFee || reduxValues?.buyerTransferFee || "",
                  sellerTransferFee: listedProductVal?.sellerTransferFee || reduxValues?.sellerTransferFee || "",
                  maintenanceFee: listedProductVal?.maintenanceFee || reduxValues?.maintenanceFee || "",
                  occupancyStatus: listedProductVal?.occupancyStatus || reduxValues?.occupancyStatus || "",
                  zonedFor: listedProductVal?.zonedFor || reduxValues?.zonedFor || "",
                  amenities: safeParseArray(listedProductVal?.amenities || reduxValues?.amenities),
                  residentialType: listedProductVal?.residentialType || reduxValues?.residentialType || "",
                  commercialType: listedProductVal?.commercialType || reduxValues?.commercialType || "",
                  itemDescription: listedProductVal?.description || reduxValues?.itemDescription || "",
                  trim: listedProductVal?.trim || reduxValues?.trim || "",
                  regionalSpecs: listedProductVal?.regionalSpecs || reduxValues?.regionalSpecs || "",
                  kilometers: listedProductVal?.kilometers || reduxValues?.kilometers || "",
                  insuredInUae: listedProductVal?.insuredInUae || reduxValues?.insuredInUae || "",
                  interiorColor: listedProductVal?.interiorColor || reduxValues?.interiorColor || "",
                  warranty: listedProductVal?.warranty || reduxValues?.warranty || "",
                  fuelType: listedProductVal?.fuelType || reduxValues?.fuelType || "petrol",
                  doors: listedProductVal?.doors || reduxValues?.doors || "4",
                  transmissionType: listedProductVal?.transmissionType || reduxValues?.transmissionType || "automatic",
                  seatingCapacity: listedProductVal?.seatingCapacity || reduxValues?.seatingCapacity || "5",
                  horsepower: listedProductVal?.horsepower || reduxValues?.horsepower || "100-199",
                  steeringSide: listedProductVal?.steeringSide || reduxValues?.steeringSide || "left",
                  engineCapacity: listedProductVal?.engineCapacity || reduxValues?.engineCapacity || "unknown",
                  numberOfCylinders: listedProductVal?.numberOfCylinders || reduxValues?.numberOfCylinders || "4",
                  driverAssistance: safeParseArray(listedProductVal?.driverAssistance || reduxValues?.driverAssistance),
                  entertainment: safeParseArray(listedProductVal?.entertainment || reduxValues?.entertainment),
                  comfort: safeParseArray(listedProductVal?.comfort || reduxValues?.comfort),
                  exteriorFeatures: safeParseArray(listedProductVal?.exteriorFeatures || reduxValues?.exteriorFeatures),
                  priceType: listedProductVal?.priceType || reduxValues?.priceType || "FIXED",
                  isArbon: listedProductVal?.isArbon || reduxValues?.isArbon || false,
                  arbonAmount: listedProductVal?.arbonAmount || reduxValues?.arbonAmount || "",
                }}
                onSubmit={(isEditing && auctionState !== "DRAFTED") ? handleUpdate : handelProductDetailsdata}
                validationSchema={ProductDetailsSchema}
                enableReinitialize
              >
                {(formik) => (
                  <Form onSubmit={formik.handleSubmit} noValidate>
                    <ScrollToFieldError />
                    <DraftSaver values={formik.values} setDraftValue={setDraftValue} />

                  <div className="w-full flex flex-col gap-6  mx-auto">
                    {/* General Information Card */}
                    <div className="bg-white dark:bg-primary-dark border border-gray-200 dark:border-[#d4af37]/40 rounded-2xl p-6 md:p-8 shadow-sm">
                      <div className="flex items-center gap-2 mb-6">
                        <IoInformationCircleOutline className="dark:text-primary-light text-yellow w-6 h-6" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedContent[localizationKeys.itemDetails]}
                        </h2>
                      </div>

                      <div className="grid gap-x-6 gap-y-6 md:grid-cols-2 grid-cols-1">
                        <div className="md:col-span-2 ">
                          <FormikInput
                            name="itemName"
                            type={"text"}
                            label={selectedContent[localizationKeys.ITEMNAME]}
                            placeholder={
                              selectedContent[localizationKeys.itemName]
                            }
                          />
                        </div>

                    
                        
                        <div className="w-full">
                          <FormikMultiDropdown
                            name="countryId"
                            label={selectedContent[localizationKeys.Country]}
                            placeholder={selectedContent[localizationKeys.selectCountry]}
                            options={AllCountriesOptions}
                            loading={loadingAllCountries}
                            onChange={(value) => {
                              setCountriesId(value);
                              formik.setFieldValue("cityId", "");
                            }}
                          />
                        </div>

                        <div className="w-full">
                          <FormikMultiDropdown
                            name="cityId"
                            label={selectedContent[localizationKeys.City]}
                            placeholder={selectedContent[localizationKeys.selectCity]}
                            options={AllCitiesOptions}
                            loading={loadingCitiesOptions}
                            disabled={!formik.values.countryId}
                          />
                        </div>

                        <div className="w-full">
                          <FormikMultiDropdown
                            name="category"
                            label={selectedContent[localizationKeys.CATEGORY]}
                            placeholder={
                              selectedContent[localizationKeys.category]
                            }
                            options={GatogryOptions}
                            // options={GatogryOptions.map((option) => ({
                            //   ...option,
                            //   text:
                            //     option.text === "Electronic Devices" ||
                            //     option.text === "الأجهزة الإلكترونية" ? (
                            //       option.text
                            //     ) : (
                            //       <div className="flex justify-between items-center">
                            //         <span>{option.text}</span>
                            //         <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-lg">
                            //           {selectedContent[localizationKeys.comingSoon]}
                            //         </span>
                            //       </div>
                            //     ),
                            //   disabled:
                            //     option.text !== "Electronic Devices" &&
                            //     option.text !== "الأجهزة الإلكترونية",
                            // }))}
                            loading={loadingGatogry}
                            onChange={(value) => {
                              setCategoryId(value);
                              setCustomFromData([]);
                              setSubCategoryId(undefined);
                              formik.setFieldValue("subCategory", "", false);
                              formik.setFieldTouched(
                                "subCategory",
                                false,
                                false,
                              );
                            }}
                          />
                        </div>
                        <div
                          className={
                            SubGatogryOptions?.length === 0
                              ? "hidden"
                              : "w-full"
                          }
                        >
                          <FormikMultiDropdown
                            name="subCategory"
                            label={
                              selectedContent[localizationKeys.subCategory]
                            }
                            placeholder={
                              selectedContent[localizationKeys.subCategory]
                            }
                            loading={loadingSubGatogry}
                            options={SubGatogryOptions}
                            onChange={(value) => {
                              setSubCategoryId(value);
                              formik.setFieldValue("subCategory", value, true);
                            }}
                          />
                        </div>
                        {/* {formik.values.subCategory && (
                          <>
                            {[
                              ...(customFromData?.arrayCustomFields || []),
                              ...(customFromData?.regularCustomFields || []),
                            ]
                              .filter((e) => e?.key !== "brandId")
                              .map((e) => {
                                const isDropdown =
                                  customFromData?.arrayCustomFields?.some(
                                    (field) => field.key === e.key,
                                  );

                                return (
                                  <div key={e.key} className="w-full">
                                    {isDropdown ? (
                                      <FormikMultiDropdown
                                        name={e?.key}
                                        label={
                                          lang === "en"
                                            ? e?.labelEn
                                            : e?.labelAr
                                        }
                                        placeholder={
                                          lang === "en"
                                            ? e?.labelEn
                                            : e?.labelAr
                                        }
                                        options={
                                          e?.key === "countryId"
                                            ? AllCountriesOptions
                                            : e?.key === "cityId"
                                              ? AllCitiesOptions
                                              : allCustomFileOptions[
                                                  e?.key
                                                ]?.map((option) => ({
                                                  ...option,
                                                  text: isArabic
                                                    ? option.text.split(
                                                        " | ",
                                                      )[1]
                                                    : option.text.split(
                                                        " | ",
                                                      )[0],
                                                }))
                                        }
                                        onChange={(selectedValue) =>
                                          setCountriesId(selectedValue)
                                        }
                                        loading={
                                          loadingAllCountries ||
                                          loadingCitiesOptions
                                        }
                                      />
                                    ) : (
                                      <FormikInput
                                        name={e?.key}
                                        label={
                                          lang === "en"
                                            ? e?.labelEn
                                            : e?.labelAr
                                        }
                                        placeholder={
                                          lang === "en"
                                            ? e?.labelEn
                                            : e?.labelAr
                                        }
                                        type={e?.type}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                          </>
                        )} */}

                        {(formik.values.subCategory && categoryId !== 4) &&
                          categoryId !== 3 &&
                          categoryId !== 7 &&
                          !["Properties", "عقارات", "Propertiess"].includes(GatogryOptions?.find(opt => String(opt.value) === String(categoryId))?.name) && (
                            <>
                              <div className="w-full relative">
                                <FormikInput
                                  name="brand"
                                  type="text"
                                  label={
                                    selectedContent[localizationKeys.Brands]
                                  }
                                  placeholder={
                                    selectedContent[localizationKeys.brand]
                                  }
                                  value={formik.values.brand}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    formik.handleChange(e);
                                    handleBrandInputChange(value);
                                  }}
                                  onFocus={() => setIsDropdownOpen(true)}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setIsDropdownOpen((prev) => !prev)
                                  }
                                  className="absolute right-4 top-10 sm:right-3 sm:top-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                  {isDropdownOpen &&
                                    brandSuggestions.length > 0 && (
                                      <MdArrowDropDown className="w-6 h-6" />
                                    )}
                                </button>
                                {isDropdownOpen &&
                                  brandSuggestions.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#2C3241] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                                      <ul className="py-1">
                                        {brandSuggestions.map(
                                          (suggestion, index) => (
                                            <li
                                              key={index}
                                              onClick={() => {
                                                formik.setFieldValue(
                                                  "brand",
                                                  suggestion.text,
                                                );
                                                setBrandInput(suggestion.text);
                                                setBrandSuggestions([]);
                                                setIsDropdownOpen(false);
                                              }}
                                              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1A1F2C] text-gray-900 dark:text-white px-4 py-2"
                                            >
                                              {suggestion.text}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                              {customFromData?.model && (
                                <div className="w-full">
                                  <FormikInput
                                    min={0}
                                    name={`${customFromData?.model?.key}`}
                                    label={selectedContent[localizationKeys.model]}
                                    placeholder={`${lang === "en" ? customFromData?.model?.labelEn : customFromData?.model?.labelAr}`}
                                  />
                                </div>
                              )}
                            </>
                          )}

                        {/* {categoryId !== 4 && (
                          <div className="md:col-span-2 w-full mt-2">
                            <FormikTextArea
                              name="itemDescription"
                              type={"text"}
                              label={
                                selectedContent[localizationKeys.itemDescription]
                              }
                              placeholder={
                                selectedContent[
                                  localizationKeys.writeItemDescription
                                ]
                              }
                            />
                          </div>
                        )} */}
                      </div>
                    </div>

                    {categoryId === 4 && (
                      <div className="w-full">
                        <CarSpecifications
                          descriptionNode={
                            <div className="md:col-span-3 w-full mt-2 text-gray-600 dark:text-gray-300 font-bold text-sm">
                              <FormikTextArea
                                name="itemDescription"
                                type={"text"}
                                label={getOptionalLabel(selectedContent[localizationKeys.itemDescription])}
                                placeholder={selectedContent[localizationKeys.writeItemDescription]}
                              />
                            </div>
                          }
                        />
                      </div>
                    )}

                    {(() => {
                      const categoryName = GatogryOptions?.find(opt => String(opt.value) === String(categoryId))?.name?.toLowerCase() || "";
                      const isPropertyCategory = categoryId === 7 || categoryId === 3 || categoryName.includes("properties") || categoryName.includes("عقارات") || categoryName.includes("real estate");
                      
                      if (!isPropertyCategory) return null;

                      return (
                        <div className="w-full">
                          <PropertySpecifications 
                              subCategoryText={SubGatogryOptions?.find(opt => String(opt.value) === String(formik.values.subCategory))?.text || SubGatogryOptions?.find(opt => String(opt.value) === String(formik.values.subCategory))?.name}
                            descriptionNode={
                              <div className="w-full mt-2 text-gray-600 dark:text-gray-300">
                                <FormikTextArea
                                  name="itemDescription"
                                  type={"text"}
                                  label={getOptionalLabel(selectedContent[localizationKeys.itemDescription])}
                                  placeholder={selectedContent[localizationKeys.writeItemDescription]}
                                />
                              </div>
                            }
                          />
                        </div>
                      );
                    })()}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      {/* Pricing Card */}
                      <div className="bg-white dark:bg-primary-dark border border-gray-200 dark:border-[#d4af37]/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-6">
                          <IoPricetagOutline className="dark:text-primary-light text-yellow w-6 h-6" />
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {selectedContent[localizationKeys.Price]}
                          </h2>
                        </div>
                        <div className="w-full space-y-2">
                          <div className="flex items-center justify-between w-full mb-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {selectedContent[localizationKeys.price]} {lang === "en" ? "(AED)" : ""}
                            </label>
                            <div className="w-[180px] sm:w-[220px]">
                              <div className="flex  bg-gray-100 dark:bg-[#1A1F2C] p-0.5 rounded-lg gap-0.5 border border-gray-200 dark:border-white/5 h-[32px]">
                                <button
                                  type="button"
                                  onClick={() => formik.setFieldValue("priceType", "FIXED")}
                                  className={`flex-1 px-2  rounded-md text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                                    formik.values.priceType === "FIXED"
                                      ? "bg-yellow text-primary-dark shadow-sm"
                                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5"
                                  }`}
                                >
                                  <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${formik.values.priceType === "FIXED" ? "bg-primary-dark animate-pulse" : "bg-gray-400"}`} />
                                  {selectedContent[localizationKeys.fixed]}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => formik.setFieldValue("priceType", "NEGOTIABLE")}
                                  className={`flex-1 px-2 rounded-md text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                                    formik.values.priceType === "NEGOTIABLE"
                                      ? "bg-yellow text-primary-dark shadow-sm"
                                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5"
                                  }`}
                                >
                                  <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${formik.values.priceType === "NEGOTIABLE" ? "bg-primary-dark animate-pulse" : "bg-gray-400"}`} />
                                  {selectedContent[localizationKeys.negotiable]}
                                </button>
                              </div>
                            </div>
                          </div>
                          <FormikInput
                            min={0}
                            type="number"
                            name="itemPrice"
                            placeholder="AED 000"
                            onWheel={(e) => e.target.blur()}
                          />
                          
                          {/* Arbon Section */}
                          <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {selectedContent[localizationKeys.setArbon]}
                                </label>
                                <Popup
                                  trigger={
                                    <div className="cursor-help text-gray-400 hover:text-yellow transition-colors">
                                      <IoInformationCircleOutline className="w-4 h-4" />
                                    </div>
                                  }
                                  content={selectedContent[localizationKeys.arbonDescription]}
                                  position="top left"
                                  flowing
                                  wide
                                  inverted
                                  size="tiny"
                                />
                              </div>
                              <div className="w-[120px]">
                                <div className="flex bg-gray-100 dark:bg-[#1A1F2C] p-0.5 rounded-lg gap-0.5 border border-gray-200 dark:border-white/5 h-[28px]">
                                  <button
                                    type="button"
                                    onClick={() => formik.setFieldValue("isArbon", true)}
                                    className={`flex-1 rounded-md text-[10px] font-bold transition-all duration-300 flex items-center justify-center ${
                                      formik.values.isArbon
                                        ? "bg-yellow text-primary-dark shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5"
                                    }`}
                                  >
                                    {selectedContent[localizationKeys.yes]}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      formik.setFieldValue("isArbon", false);
                                      formik.setFieldValue("arbonAmount", "");
                                    }}
                                    className={`flex-1 rounded-md text-[10px] font-bold transition-all duration-300 flex items-center justify-center ${
                                      !formik.values.isArbon
                                        ? "bg-yellow text-primary-dark shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5"
                                    }`}
                                  >
                                    {selectedContent[localizationKeys.no]}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {formik.values.isArbon && (
                              <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                <FormikInput
                                  min={0}
                                  type="number"
                                  name="arbonAmount"
                                  placeholder={selectedContent[localizationKeys.arbonAmount]}
                                  onWheel={(e) => e.target.blur()}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {(() => {
                        const categoryName = GatogryOptions?.find(opt => String(opt.value) === String(categoryId))?.name?.toLowerCase() || "";
                        const isPropertyCategory = categoryId === 7 || categoryId === 3 || categoryName.includes("properties") || categoryName.includes("عقارات") || categoryName.includes("real estate");
                        const subCatName = SubGatogryOptions?.find(opt => String(opt.value) === String(subCategoryId))?.text?.toLowerCase() || "";
                        const isRent = subCategoryId === 23 || subCatName.includes("rent") || subCatName.includes("إيجار");

                        if (isPropertyCategory && isRent) {
                          return <div></div>;
                        }

                        return (
                          <div className="bg-white dark:bg-primary-dark border border-gray-200 dark:border-[#d4af37]/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2">
                                <IoRibbonOutline className="dark:text-primary-light text-yellow w-6 h-6" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {selectedContent[localizationKeys.itemCondition]} <span className="text-red-500">*</span>
                                </h2>
                              </div>
                              {formik.errors.usageStatus && (formik.touched.usageStatus || formik.submitCount > 0) && (
                                <span className="text-sm font-medium text-red-600 ltr:font-serifEN rtl:font-serifAR px-2 py-1 rounded">
                                  {selectedContent[localizationKeys.required]}
                                </span>
                              )}
                            </div>
                            <div className="w-full h-full" id="usageStatus">
                              <CheckboxRadioProductDetails
                                valueRadio={formik.values.usageStatus}
                                setRadioValue={(val) => {
                                  formik.setFieldValue("usageStatus", val);
                                }}
                                isProperty={isPropertyCategory}
                                categoryId={categoryId}
                                subCategoryId={subCategoryId}
                                showError={Boolean(
                                  formik.errors.usageStatus && (formik.touched.usageStatus || formik.submitCount > 0)
                                )}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    {/* Media Card */}
                    <div className="bg-white dark:bg-primary-dark border border-gray-200 dark:border-[#d4af37]/40 rounded-2xl p-6 md:p-8 shadow-sm">
                      {/* Desktop Header */}
                      <div className="hidden md:flex justify-between items-start mb-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-row items-center gap-2">
                            <IoImageOutline className="w-5 h-5 dark:text-primary-light text-yellow" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                              {selectedContent[localizationKeys.productMedia]}
                            </h2>
                          </div>
                          <span className="text-gray-500 dark:text-[#8E97A6] text-sm block">
                            {
                              selectedContent[
                                localizationKeys.uploadOneImageAndOneVideo
                              ]
                            }
                          </span>
                        </div>
                        <label
                          htmlFor="media-upload"
                          className="flex items-center gap-1.5 text-sm font-bold text-primary dark:text-yellow cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                        >
                          <IoCameraOutline className="w-4 h-4" /> {selectedContent[localizationKeys.addMore]}
                        </label>
                      </div>

                      {/* Mobile Header */}
                      <div className="flex md:hidden justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <IoImageOutline className="dark:text-primary-light text-yellow w-6 h-6" />
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {selectedContent[localizationKeys.addMedia]}
                          </h2>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm hidden sm:block">
                          {
                            selectedContent[
                              localizationKeys.uploadOneImageAndOneVideo
                            ]
                          }
                        </span>
                      </div>

                      {/* Mobile Upload Zone */}
                      <div className="relative mb-6 md:hidden">
                        <label
                          htmlFor="media-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-[#2C3241] rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-[#22283A] transition-colors bg-gray-50/50 dark:bg-[#151922]"
                        >
                          <IoImageOutline className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {selectedContent[localizationKeys.clickToUploadImagesAndVideos]}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedContent[localizationKeys.uploadUpTo12Items]}
                          </p>
                        </label>
                        <label
                          htmlFor="camera-input-file"
                          className="absolute right-4 top-4 cursor-pointer p-2 bg-white dark:bg-[#2C3241] rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                        >
                          <IoCameraOutline className="w-5 h-5 text-primary dark:text-yellow" />
                        </label>
                      </div>

                      {/* Hidden Upload Inputs */}
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png, .heic, .heif, .mp4, .mov, image/*, video/*"
                        multiple
                        onChange={handleFileChange}
                        id="media-upload"
                        className="hidden"
                      />
                      <input
                        id="camera-input-file"
                        name="camera-input-file"
                        type="file"
                        accept=".jpg, .jpeg, .png, .heic, .heif, .mp4, .mov, image/*, video/*"
                        onChange={handleCameraChange}
                        capture="environment"
                        className="hidden"
                      />

                      <div className="w-full">
                        <ImageMedia
                          auctionId={state?.auctionId || product_Id}
                          setimgtest={setimgtest}
                          images={imgtest || []}
                          onReload={onReload}
                          setLoadingImg={setLoadingImg}
                          isEditMode={auctionState === "DRAFTED" ? true : isEditing}
                          isListing={true}
                        />
                      </div>
                    </div>

                    <div className="flex gap-x-4 sm:justify-end justify-center pt-2 pb-10">
                      <button
                        type="button"
                        onClick={() => history.goBack()}
                        className="bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2C3241] sm:w-[150px] w-full h-[48px] rounded-lg font-medium transition-colors"
                      >
                        {selectedContent[localizationKeys.cancel]}
                      </button>

                      {!(auctionState === "DRAFTED") && !isEditing && (
                        <button
                          type="button"
                          disabled={loadingImg}
                          onClick={(e) => SaveProductAsDraft(e)}
                          className={`bg-transparent border-primary dark:border-yellow border-[1px] text-primary dark:text-yellow ${loadingImg ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/5 dark:hover:bg-yellow/10 hover:shadow-md"} rounded-lg sm:w-[136px] w-full h-[48px] flex items-center justify-center transition-all duration-300 font-medium`}
                        >
                          {isSavingDraft ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-primary dark:border-yellow border-t-transparent rounded-full animate-spin"></div>
                              {selectedContent[localizationKeys.saving]}
                            </div>
                          ) : (
                            selectedContent[localizationKeys.saveAsDraft]
                          )}
                        </button>
                      )}

                      {isEditing && auctionState !== "DRAFTED" ? (
                        <button
                          type="submit"
                          disabled={loadingImg}
                          className={`bg-primary ${loadingImg ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark shadow-lg hover:shadow-xl"} sm:w-[220px] w-full h-[48px] rounded-lg text-white font-semibold text-base rtl:font-serifAR ltr:font-serifEN transition-all duration-300 transform active:scale-95`}
                        >
                          {selectedContent[localizationKeys.Submit]}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loadingImg}
                          className={`bg-primary dark:bg-yellow ${loadingImg ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark dark:hover:bg-yellow-dark shadow-lg hover:shadow-xl"} sm:w-[220px] w-full h-[48px] rounded-lg dark:text-black text-white font-semibold text-base rtl:font-serifAR ltr:font-serifEN transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95`}
                        >
                          {selectedContent[localizationKeys.next]}
                          <span className="rtl:rotate-180">➤</span>
                        </button>
                      )}
                    </div>
                  </div>
                  </Form>
                )}
              </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListProductDetails;
