import React, { useState, useEffect, useRef } from "react";

import { useHistory, useLocation } from "react-router-dom";
import routes from "../../../routes";

import { CheckboxRadioProductDetails } from "../../../component/create-auction-components/check-box-radio-group";
import { CreateAuctionBreadcrumb } from "../../../component/shared/bread-crumb/Breadcrumb";
// import AddImgMedia from "../../../component/create-auction-components/add-img-media";
import { allCustomFileOptions } from "../../../utils/all-custom-fields-options";
import Stepper from "../../../component/shared/stepper/stepper-app";
import { Dimmer, Form } from "semantic-ui-react";
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

import { productDetails } from "../../../redux-store/product-details-Slice";
import { useDispatch, useSelector } from "react-redux";
import useGetAllCountries from "../../../hooks/use-get-all-countries";
import useGetAllCities from "../../../hooks/use-get-all-cities";
// import EditImgeMedia from "../../../component/create-auction-components/edit-imge-media";
import localizationKeys from "../../../localization/localization-keys";
import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
import { IoCameraOutline } from "react-icons/io5";
import { MdArrowDropDown, MdDelete, MdLock } from "react-icons/md";
import ImageMedia from "component/create-auction-components/ImageMedia";
import watermarkImage from "../../../../src/assets/logo/WaterMarkFinal.png";
import CarSpecifications from "../../../component/create-auction-components/CarSpecifications";

const ProductDetails = () => {
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const location = useLocation();
  const { state } = location;
  const [isEditing, setIsEditing] = useState(false);
  const [product_Id] = useState(state?.productId || null);

  useEffect(() => {
    if (state?.isEditing) {
      setIsEditing(true);
    }
  }, [state]);

  const [auctionState, setAuctionState] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [completeDraftVal, setCompleteDraftValue] = useState();
  const [listedProductVal, setListedProductVal] = useState();
  const [loadingImg, setLoadingImg] = useState();
  const [forceReload, setForceReload] = useState(false);
  const [auctionId, setAuctionId] = useState(state?.auctionId || null);
  const [maxStartPrice, setMaxStartPrice] = useState(null);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const formikRef = useRef(null);
  const productDetailsint = useSelector(
    (state) => state.productDetails.productDetails
  );
  const dispatch = useDispatch();

  const history = useHistory();

  const { run: runAuctionById, isLoading: isLoadingAuctionById } = useAxios([]);

  function getCleanedValues(formValues) {
    const isCarCategory = Number(formValues.category) === 4 || GatogryOptions?.find(o => String(o.value) === String(formValues.category))?.name?.toLowerCase() === "cars";
    const isPropertyCategory = Number(formValues.category) === 7 || Number(formValues.category) === 19 || Number(formValues.category) === 23 || ["properties", "عقارات", "propertiess"].includes(GatogryOptions?.find(o => String(o.value) === String(formValues.category))?.name?.toLowerCase());

    const cleanValues = { ...formValues };
    if (!isCarCategory) {
      const carFields = ["trim", "regionalSpecs", "kilometers", "insuredInUae", "interiorColor", "warranty", "fuelType", "doors", "transmissionType", "seatingCapacity", "horsepower", "steeringSide", "engineCapacity", "numberOfCylinders", "driverAssistance", "entertainment", "comfort", "exteriorFeatures", "carType"];
      carFields.forEach(f => delete cleanValues[f]);
    }
    if (!isPropertyCategory) {
      const propFields = ["totalClosingFee", "numberOfBathrooms", "developer", "readyBy", "annualCommunityFee", "isFurnished", "propertyReferenceId", "buyerTransferFee", "sellerTransferFee", "maintenanceFee", "occupancyStatus", "amenities", "zonedFor", "approvedBuildUpArea", "freehold", "residentialType", "commercialType", "numberOfRooms", "totalArea"];
      // emirate is allowed for both cars and properties, so we only delete it if it's neither
      if (!isCarCategory) {
        delete cleanValues["emirate"];
      }
      propFields.forEach(f => delete cleanValues[f]);
    }

    return cleanValues;
  }

  const handleUpdate = async (rawValues) => {
    const values = getCleanedValues(rawValues);
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
      if (values.subCategory)
        formData.append("product[subCategoryId]", values.subCategory);
      if (values.brand) formData.append("product[brand]", values.brand);
      if (valueRadio) formData.append("product[usageStatus]", valueRadio);
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
      if (values.emirate) formData.append("product[emirate]", values.emirate);

      if (values.regionOfManufacture)
        formData.append(
          "product[regionOfManufacture]",
          values.regionOfManufacture
        );
      if (values.numberOfFloors)
        formData.append("product[numberOfFloors]", values.numberOfFloors);
      if (values.numberOfRooms)
        formData.append("product[numberOfRooms]", values.numberOfRooms);
      if (values.itemDescription)
        formData.append("product[description]", values.itemDescription);
      if (values.countryId)
        formData.append("product[countryId]", values.countryId);
      if (values.cityId) formData.append("product[cityId]", values.cityId);

      // Handle related documents if any
      if (relatedDocuments?.length > 0) {
        relatedDocuments.forEach((doc) => {
          formData.append("relatedDocuments", doc);
        });
      }

      // Add auctionId if needed for the update API
      if (auctionId) {
        formData.append("auctionId", auctionId);
      }

      // Send the update request
      const response = await authAxios.put(
        api.app.auctions.updateAuction(auctionId),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success(selectedContent[localizationKeys.updatedSuccessfully]);
        history.push(routes.app.profile.myAuctions.default);
        dispatch(productDetails({}));
      } else {
        toast.error(
          selectedContent[localizationKeys.updateFailed] || "Update failed"
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          selectedContent[localizationKeys.updateFailed] ||
          "An error occurred while updating."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const addImageWatermark = async (file) => {
    if (file.type.startsWith("video/")) {
      return file;
    }

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
          0.8
        );
      });
    } catch (error) {
      toast.error(selectedContent[localizationKeys.errorInWatermarkProcess]);
      throw error;
    }
  };

  useEffect(() => {
    const id = productDetailsint?.auctionId || state?.auctionId;
    if (id) {
      runAuctionById(
        authAxios.get(api.app.auctions.getAuctionsDetails(id)).then((res) => {
          const completeDraftValue = res?.data?.data;

          setAuctionState(res?.data?.data?.status);
          setCompleteDraftValue(res?.data?.data);
          SetProductFunction(completeDraftValue?.product);
          // setimgtest(completeDraftValue?.product?.images);

          // // Map draft images to fileOne, fileTwo, etc.
          // if (completeDraftValue?.product?.images) {
          //   const images = completeDraftValue.product.images;
          //   setFileOne(images[0] || null);
          //   setFileTwo(images[1] || null);
          //   setFileThree(images[2] || null);
          //   setFileFour(images[3] || null);
          //   setFileFive(images[4] || null);
          // }

          // dispatch(
          //   productDetails({
          //     itemName: completeDraftValue?.product?.title,
          //     category: completeDraftValue?.product.categoryId,
          //     subCategory: completeDraftValue?.product?.subCategoryId,
          //     operatingSystem: completeDraftValue?.product?.operatingSystem,
          //     releaseYear: completeDraftValue?.product?.releaseYear,
          //     regionOfManufacture:
          //       completeDraftValue?.product?.regionOfManufacture,
          //     ramSize: completeDraftValue?.product?.ramSize,
          //     processor: completeDraftValue?.product?.processor,
          //     screenSize: completeDraftValue?.product?.screenSize,
          //     model: completeDraftValue?.product?.model,
          //     color: completeDraftValue?.product?.color,
          //     brand: completeDraftValue?.product?.brand,
          //     cameraType: completeDraftValue?.product?.cameraType,
          //     material: completeDraftValue?.product?.material,
          //     memory: completeDraftValue?.product?.memory,
          //     age: completeDraftValue?.product?.age,
          //     totalArea: completeDraftValue?.product?.totalArea,
          //     numberOfRooms: completeDraftValue?.product?.numberOfRooms,
          //     numberOfFloors: completeDraftValue?.product?.numberOfFloors,
          //     landType: completeDraftValue?.product?.landType,
          //     carType: completeDraftValue?.product?.carType,
          //     cityId: completeDraftValue?.product?.cityId,
          //     countryId: completeDraftValue?.product?.countryId,
          //     itemDescription: completeDraftValue?.product?.description,
          //     hasUsageCondition:
          //       completeDraftValue?.product?.category?.hasUsageCondition,
          //     valueRadio: completeDraftValue?.product?.usageStatus,
          //   })
          // );
          // setRadioValue(completeDraftValue?.product?.usageStatus);

          // Set initial images if available
          if (completeDraftValue?.product?.images?.length > 0) {
            const formattedImages = completeDraftValue.product.images.map(
              (img) => {
                const isVideo =
                  img.imagePath?.toLowerCase().includes("video") ||
                  img.imageLink?.toLowerCase().includes("video");
                return {
                  id: img.id,
                  imageLink: img.imageLink,
                  imagePath: img.imagePath,
                  isVideo: isVideo,
                  isCoverPhoto: img.isCoverPhoto || false,
                };
              }
            );
            setimgtest(formattedImages);
          }

          // Set initial usage status
          if (completeDraftValue?.product?.usageStatus) {
            setRadioValue(completeDraftValue.product.usageStatus);
          }

          // Set category and subcategory IDs
          if (completeDraftValue?.product?.categoryId) {
            setCategoryId(completeDraftValue.product.categoryId);
          }
          if (completeDraftValue?.product?.subCategoryId) {
            setSubCategoryId(completeDraftValue.product.subCategoryId);
          }
        })
      );
    }
  }, [runAuctionById, forceReload, state?.auctionId, productDetailsint?.id]);

  //Fetching Listed Product to convert into auction
  useEffect(() => {
    const id = state?.productId;
    if (id) {
      runAuctionById(
        authAxios
          .get(api.app.productListing.listedProduct(state?.productId))
          .then((res) => {
            const listedProduct = res?.data?.data;
            setListedProductVal(res?.data?.data?.product);
            SetProductFunction(listedProduct?.product);
            setAuctionState("LISTED_PRODUCT");
            // Check if formikRef has a current instance and submit the form
            if (formikRef.current) {
              formikRef.current.submitForm();
            }
          })
      );
    }
  }, [runAuctionById, forceReload, state?.productId, productDetailsint?.id]);

  function SetProductFunction(product) {
    setimgtest(product?.images);

    // Map draft images to fileOne, fileTwo, etc.
    if (product?.images) {
      const images = product?.images;
    }

    dispatch(
      productDetails({
        productId: product?.id,
        itemName: product?.title,
        category: product.categoryId,
        subCategory: product?.subCategoryId,
        operatingSystem: product?.operatingSystem,
        releaseYear: product?.releaseYear,
        regionOfManufacture: product?.regionOfManufacture,
        ramSize: product?.ramSize,
        processor: product?.processor,
        screenSize: product?.screenSize,
        model: product?.model,
        color: product?.color,
        brand: product?.brand,
        cameraType: product?.cameraType,
        material: product?.material,
        memory: product?.memory,
        age: product?.age,
        totalArea: product?.totalArea,
        numberOfRooms: product?.numberOfRooms,
        numberOfFloors: product?.numberOfFloors,
        landType: product?.landType,
        carType: product?.carType,
        cityId: product?.cityId,
        countryId: product?.countryId,
        itemDescription: product?.description,
        hasUsageCondition: product?.category?.hasUsageCondition,
        valueRadio: product?.usageStatus,
        trim: product?.trim,
        regionalSpecs: product?.regionalSpecs,
        kilometers: product?.kilometers,
        insuredInUae: product?.insuredInUae,
        interiorColor: product?.interiorColor,
        warranty: product?.warranty,
        fuelType: product?.fuelType,
        doors: product?.doors,
        transmissionType: product?.transmissionType,
        seatingCapacity: product?.seatingCapacity,
        horsepower: product?.horsepower,
        steeringSide: product?.steeringSide,
        engineCapacity: product?.engineCapacity,
        numberOfCylinders: product?.numberOfCylinders,
        driverAssistance: product?.driverAssistance,
        entertainment: product?.entertainment,
        comfort: product?.comfort,
        exteriorFeatures: product?.exteriorFeatures,
      })
    );
    setRadioValue(product?.usageStatus);
  }

  useEffect(() => {
    const storedAuctionId = localStorage.getItem("auctionId");

    if (state?.auctionId) {
      if (storedAuctionId !== null) {
        localStorage.setItem("auctionId", state.auctionId);
        setAuctionId(state.auctionId);
      }
    } else {
      if (
        auctionState === "DRAFTED" ||
        productDetailsint?.auctionState === "DRAFTED"
      ) {
        if (storedAuctionId) {
          setAuctionId(storedAuctionId);
        }
      }
    }
  }, [state]);

  useEffect(() => {
    if (completeDraftVal?.product?.images) {
      setimgtest(completeDraftVal.product.images);
    }
  }, [completeDraftVal]);

  useEffect(() => {
    if (auctionId) {
      localStorage.setItem("auctionId", auctionId);
    }
  }, [auctionId]);

  useEffect(() => {
    if (!state?.auctionId && auctionId) {
      history.replace({
        pathname: history.location.pathname,
        state: { auctionId },
      });
    }
  }, [state, auctionId, history]);

  const [draftValue, setDraftValue] = useState();
  const [imgtest, setimgtest] = useState([]);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [valueRadio, setRadioValue] = useState(
    completeDraftVal?.product?.usageStatus ||
      productDetailsint.valueRadio ||
      null
  );

  const [countriesId, setCountriesId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [subCategoryId, setSubCategoryId] = useState();

  const [hasUsageCondition, setHasUsageCondition] = useState(
    completeDraftVal?.product?.category?.hasUsageCondition ||
      productDetailsint.hasUsageCondition ||
      true
  );
  const [customFromData, setCustomFromData] = useState();
  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry } = useGetSubGatogry(
    categoryId || productDetailsint.category
  );
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();
  const { AllCitiesOptions, loadingCitiesOptions } = useGetAllCities(
    countriesId || productDetailsint.countriesId
  );

  const { NotAllBranOptions, loadingAllBranOptions } = useGetBrand(
    categoryId || productDetailsint.category
  );

  // const handleReorderImages = (reorderedImages, reorderedFiles) => {

  //   setimgtest(reorderedImages);
  // };

  const [brandInput, setBrandInput] = useState("");
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleBrandInputChange = (value) => {
    setBrandInput(value);
    // const filteredBrands = NotAllBranOptions.filter((brand) =>
    //   brand.text.toLowerCase().includes(value.toLowerCase())
    // );
    // setBrandSuggestions(filteredBrands);
  };
  const checkVideoValidation = (files, currentImages) => {
    // Check if there's already a video in the current images
    const hasExistingVideo = currentImages.some((img) =>
      img.file.type.startsWith("video/")
    );

    // Check if any of the new files is a video
    const newVideos = Array.isArray(files)
      ? files.filter((file) => file.type.startsWith("video/"))
      : files.type.startsWith("video/")
      ? [files]
      : [];

    // If trying to upload a video as first item
    if (currentImages.length === 0 && newVideos.length > 0) {
      return selectedContent[
        localizationKeys
          .videoCannotBeTheFirstUploadPleaseUploadAnImageFirstAsItWillBeUsedAsTheCover
      ];
    }

    // If there's already a video or if trying to upload multiple videos
    if ((hasExistingVideo && newVideos.length > 0) || newVideos.length > 1) {
      return selectedContent[localizationKeys.onlyOneVideoFileIsAllowed];
    }

    return null;
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    // Get current images array
    const currentImages = imgtest || [];

    // Check if adding new files would exceed 50 images
    if (currentImages.length + files.length > 50) {
      toast.error(
        selectedContent[localizationKeys.youCanOnlySelectUpToFiftyImages]
      );
      event.target.value = null;
      return;
    }

    // Check video file size (50MB = 50 * 1024 * 1024 bytes)
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    const oversizedVideos = files.filter(
      (file) => file.type.startsWith("video/") && file.size > MAX_VIDEO_SIZE
    );
    if (oversizedVideos.length > 0) {
      toast.error(selectedContent[localizationKeys.videoSizeLimitExceeded]);
      event.target.value = null;
      return;
    }

    // Check video validation
    const videoError = checkVideoValidation(files, currentImages);
    if (videoError) {
      toast.error(videoError);
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
        })
      );

      // Update the images array
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

      // Check if adding new file would exceed 50 images
      if (currentImages.length >= 50) {
        toast.error(
          selectedContent[localizationKeys.youCanOnlySelectUpToFiftyImages]
        );
        event.target.value = null;
        return;
      }

      // Check video validation
      const videoError = checkVideoValidation(file, currentImages);
      if (videoError) {
        toast.error(videoError);
        event.target.value = null;
        return;
      }

      try {
        const watermarkedFile = await addImageWatermark(file);
        // Create object URL for preview
        const newImage = {
          file: watermarkedFile,
          imageLink: URL.createObjectURL(watermarkedFile),
        };
        // Add the new image to the array
        setimgtest([...currentImages, newImage]);
      } catch (error) {
        toast.error(selectedContent[localizationKeys.errorProcessingImages]);
      }
    }
  };
  const { run, isLoading } = useAxios([]);

  useEffect(() => {
    setCategoryId(productDetailsint.category);
  }, [productDetailsint.category]);

  useEffect(() => {
    if (
      categoryId ||
      subCategoryId ||
      productDetailsint.category ||
      productDetailsint.subCategory ||
      loadingImg
    ) {
      if (SubGatogryOptions.length === 0) {
        run(
          authAxios
            .get(
              api.app.customField.ByCategoryId(
                categoryId || productDetailsint.category
              )
            )
            .then((res) => {
              setCustomFromData(res?.data?.data);
            })
        );
      } else
        run(
          authAxios
            .get(
              api.app.customField.BySubCategoryId(
                subCategoryId || productDetailsint.subCategory
              )
            )
            .then((res) => {
              setCustomFromData(res?.data?.data);
            })
        );
    }
  }, [
    run,
    categoryId,
    subCategoryId,
    SubGatogryOptions.length,
    productDetailsint.category,
    productDetailsint.subCategory,
    loadingImg,
  ]);

  const optionalCarSpecs = [
    "transmissionType", "steeringSide", "seatingCapacity", "horsepower",
    "numberOfCylinders", "fuelType", "doors", "engineCapacity", "trim",
    "kilometers", "regionalSpecs", "carType", "color", "interiorColor",
    "releaseYear", "insuredInUae", "warranty", "driverAssistance",
    "entertainment", "comfort", "exteriorFeatures"
  ];

  const arrayCustomFieldsvalidations =
    customFromData?.arrayCustomFields?.reduce((acc, curr) => {
      if (!optionalCarSpecs.includes(curr.key)) {
        acc[curr.key] = Yup.string().required(
          selectedContent[localizationKeys.required]
        );
      }
      return acc;
    }, {});

  const model = customFromData?.model?.key;
  const isArabic = lang === "ar";
  const [pdfFile, setPdfFile] = useState(null);

  const carMandatoryFields = [
    "carType", "color",
    "interiorColor", "releaseYear", "insuredInUae"
  ].reduce((acc, field) => {
    acc[field] = Yup.string().when("category", {
      is: (cat) => String(cat) === "4" || GatogryOptions?.find(o => String(o.value) === String(cat))?.name === "Cars",
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    });
    return acc;
  }, {});

  const ProductDetailsSchema = Yup.object({
    itemName: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
    category: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
    itemDescription: Yup.string()
      .trim()
      .notRequired(),
    pdfDocument: Yup.mixed().when("category", {
      is: (category) =>
        ["Cars", "Jewellers", "Properties", "عقارات", "مجوهرات", "سيارات", "Propertiess"].includes(
          GatogryOptions.find((opt) => String(opt.value) === String(category))?.name
        ),
      then: Yup.mixed().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.mixed().notRequired(),
    }),
    ...arrayCustomFieldsvalidations,
    ...carMandatoryFields,
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
        selectedContent[localizationKeys.required]
      ),
    }),
  });

  const handelProductDetailsdata = (rawValues) => {
    const values = getCleanedValues(rawValues);
    const allImages = imgtest || [];
    const filesCount = allImages.filter(
      (file) => file !== null && file !== undefined
    ).length;

    if (filesCount < 3) {
      toast.error(
        selectedContent[
          localizationKeys.makeSureThatYouChooseAtLeastThreeOrMorePhotos
        ]
      );
      return;
    }

    if (
      !valueRadio &&
      !draftValue?.valueRadio &&
      !productDetailsint?.valueRadio
    ) {
      if (hasUsageCondition && categoryId !== 7) {
        toast.error(
          selectedContent[
            localizationKeys.makeSureThatYouChooseItemConditionValue
          ]
        );
        return;
      }
    }

    dispatch(
      productDetails({
        ...values,
        hasUsageCondition,
        maxStartPrice,
        valueRadio,
        images: allImages, // Store all images in an array
        relatedDocuments,
        auctionState,
        auctionId: completeDraftVal?.id,
        productId: product_Id,
      })
    );

    // Navigate to the next page
    history.push(routes.app.createAuction.auctionDetails);
  };

  const SaveAuctionAsDraft = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Add all images to formData
    const allImages = imgtest || [];
    allImages.forEach((image, index) => {
      if (image?.file) {
        formData.append("images", image.file);
      }
    });

    formData.append("title", draftValue.itemName || productDetailsint.itemName);
    formData.append(
      "categoryId",
      draftValue.category || productDetailsint.category
    );
    if (draftValue.subCategory || productDetailsint.subCategory) {
      formData.append(
        "subCategoryId",
        draftValue.subCategory || productDetailsint.subCategory
      );
    }
    if (draftValue.brand || productDetailsint.brand) {
      formData.append("brand", draftValue.brand || productDetailsint.brand);
    }
    if (valueRadio || productDetailsint.valueRadio) {
      formData.append(
        "usageStatus",
        valueRadio || productDetailsint.valueRadio
      );
    }
    if (draftValue.color || productDetailsint.color) {
      formData.append("color", draftValue.color || productDetailsint.color);
    }
    if (draftValue.age || productDetailsint.age) {
      formData.append("age", draftValue.age || productDetailsint.age);
    }
    if (draftValue.landType || productDetailsint.landType) {
      formData.append(
        "landType",
        draftValue.landType || productDetailsint.landType
      );
    }
    if (draftValue.cameraType || productDetailsint.cameraType) {
      formData.append(
        "cameraType",
        draftValue.cameraType || productDetailsint.cameraType
      );
    }
    if (draftValue.carType || productDetailsint.carType) {
      formData.append(
        "carType",
        draftValue.carType || productDetailsint.carType
      );
    }
    if (draftValue.material || productDetailsint.material) {
      formData.append(
        "material",
        draftValue.material || productDetailsint.material
      );
    }
    if (draftValue.memory || productDetailsint.memory) {
      formData.append("memory", draftValue.memory || productDetailsint.memory);
    }
    if (draftValue.model || productDetailsint.model) {
      formData.append("model", draftValue.model || productDetailsint.model);
    }
    if (draftValue.processor || productDetailsint.processor) {
      formData.append(
        "processor",
        draftValue.processor || productDetailsint.processor
      );
    }
    if (draftValue.ramSize || productDetailsint.ramSize) {
      formData.append(
        "ramSize",
        draftValue.ramSize || productDetailsint.ramSize
      );
    }
    if (draftValue.releaseYear || productDetailsint.releaseYear) {
      formData.append(
        "releaseYear",
        draftValue.releaseYear || productDetailsint.releaseYear
      );
    }
    if (draftValue.screenSize || productDetailsint.screenSize) {
      formData.append(
        "screenSize",
        draftValue.screenSize || productDetailsint.screenSize
      );
    }
    const draftCategory = draftValue.category || productDetailsint.category;
    const isDraftPropCategory = Number(draftCategory) === 7 || Number(draftCategory) === 19 || Number(draftCategory) === 23 || ["properties", "عقارات", "propertiess"].includes(GatogryOptions?.find(o => String(o.value) === String(draftCategory))?.name?.toLowerCase());

    if (isDraftPropCategory && (draftValue.totalArea || productDetailsint.totalArea)) {
      formData.append(
        "totalArea",
        draftValue.totalArea || productDetailsint.totalArea
      );
    }
    if (draftValue.operatingSystem || productDetailsint.operatingSystem) {
      formData.append(
        "operatingSystem",
        draftValue.operatingSystem || productDetailsint.operatingSystem
      );
    }
    const appendDraftField = (field) => {
      const val = draftValue[field] || productDetailsint[field];
      if (val) {
        formData.append(field, Array.isArray(val) ? JSON.stringify(val) : val);
      }
    };
    const isDraftCarCategory = Number(draftCategory) === 4 || GatogryOptions?.find(o => String(o.value) === String(draftCategory))?.name?.toLowerCase() === "cars";
    if (isDraftCarCategory) {
      [
        "trim", "regionalSpecs", "kilometers", "insuredInUae", "interiorColor",
        "warranty", "fuelType", "doors", "transmissionType", "seatingCapacity",
        "horsepower", "steeringSide", "engineCapacity", "numberOfCylinders", "driverAssistance",
        "entertainment", "comfort", "exteriorFeatures", "emirate"
      ].forEach(appendDraftField);

    }
    
    if (
      draftValue.regionOfManufacture ||
      productDetailsint.regionOfManufacture
    ) {
      formData.append(
        "regionOfManufacture",
        draftValue.regionOfManufacture || productDetailsint.regionOfManufacture
      );
    }
    if (isDraftPropCategory && (draftValue.numberOfFloors || productDetailsint.numberOfFloors)) {
      formData.append(
        "numberOfFloors",
        draftValue.numberOfFloors || productDetailsint.numberOfFloors
      );
    }
    if (isDraftPropCategory && (draftValue.numberOfRooms || productDetailsint.numberOfRooms)) {
      formData.append(
        "numberOfRooms",
        draftValue.numberOfRooms || productDetailsint.numberOfRooms
      );
    }
    if (draftValue.itemDescription || productDetailsint.itemDescription) {
      formData.append(
        "description",
        draftValue.itemDescription || productDetailsint.itemDescription
      );
    }
    if (draftValue.countryId || productDetailsint.countryId) {
      formData.append(
        "countryId",
        draftValue.countryId || productDetailsint.countryId
      );
    }
    if (draftValue.cityId || productDetailsint.cityId) {
      formData.append("cityId", draftValue.cityId || productDetailsint.cityId);
    }

    // Handle document uploads
    if (relatedDocuments?.length > 0) {
      relatedDocuments.forEach((doc) => {
        formData.append("relatedDocuments", doc);
      });
    }

    setIsSavingDraft(true);
    try {
      const response = await authAxios.post(
        api.app.auctions.setAssdraft,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.data?.success) {
        toast.success(selectedContent[localizationKeys.draftSavedSuccessfully]);
        history.push(routes.app.profile.myAuctions.drafts);
        dispatch(productDetails({}));
      } else {
        toast.error(
          selectedContent[localizationKeys.errorSavingDraft] ||
            "Error saving draft"
        );
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error(error.response?.data?.message || "Error while saving draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const carField = [
    ...(customFromData?.arrayCustomFields || []),
    ...(customFromData?.regularCustomFields || []),
  ];
  const adjustedcarField = carField.filter(
    (field) => field.subCategoryId !== null || field.categoryId === 4
  );

  useEffect(() => {
    return () => {
      if (imgtest) {
        imgtest.forEach((img) => {
          if (
            img?.imageLink &&
            typeof img.imageLink === "string" &&
            img.imageLink.startsWith("blob:")
          ) {
            URL.revokeObjectURL(img.imageLink);
          }
        });
      }
    };
  }, [imgtest]);

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={
          isSavingDraft ||
          isLoading ||
          loadingSubGatogry ||
          isLoadingAuctionById ||
          loadingAllBranOptions ||
          isUpdating
        }
        inverted
      >
        <LoadingTest3arbon />
      </Dimmer>
      <div className="mt-44 animate-in max-w-[1366px] md:mx-auto  px-4 ">
        {/* <Loader active /> */}
        <div className=" h-14 my-7 py-4 sm:block hidden">
          {/* Breadcrumb  */}
          <CreateAuctionBreadcrumb />
        </div>
        {/* stepper */}
        <div className="flex justify-center">
          <Stepper />
        </div>
        <div className="">
          <h1 className="text-black text-base font-bold mt-4">
            {selectedContent[localizationKeys.itemDetails]}
          </h1>
          {/* formik */}
          <div>
            <Formik
              innerRef={formikRef} // Assigning ref to Formik
              initialValues={{
                itemName: productDetailsint.itemName || "",
                category: productDetailsint.category || "",
                subCategory: productDetailsint.subCategory || "",
                operatingSystem: productDetailsint.operatingSystem || "",
                releaseYear: productDetailsint.releaseYear || "",
                regionOfManufacture:
                  productDetailsint.regionOfManufacture || "",
                ramSize: productDetailsint.ramSize || "",
                processor: productDetailsint.processor || "",
                screenSize: productDetailsint.screenSize || "",
                model: productDetailsint.model || "",
                color: productDetailsint.color || "",
                brand: productDetailsint.brand || "",
                cameraType: productDetailsint.cameraType || "",
                material: productDetailsint.material || "",
                type: productDetailsint.type || "",
                memory: productDetailsint.memory || "",
                age: productDetailsint.age || "",
                totalArea: productDetailsint.totalArea || "",
                numberOfRooms: productDetailsint.numberOfRooms || "",
                numberOfFloors: productDetailsint.numberOfFloors || "",
                landType: productDetailsint.landType || "",
                carType: productDetailsint.carType || "",
                cityId: productDetailsint.cityId || "",
                countryId: productDetailsint.countryId || "",
                itemDescription: productDetailsint.itemDescription || "",
                trim: productDetailsint.trim || "",
                regionalSpecs: productDetailsint.regionalSpecs || "",
                kilometers: productDetailsint.kilometers || "",
                insuredInUae: productDetailsint.insuredInUae || "",
                interiorColor: productDetailsint.interiorColor || "",
                warranty: productDetailsint.warranty || "",
                fuelType: productDetailsint.fuelType || "petrol",
                doors: productDetailsint.doors || "4",
                transmissionType: productDetailsint.transmissionType || "automatic",
                seatingCapacity: productDetailsint.seatingCapacity || "5",
                horsepower: productDetailsint.horsepower || "100-199",
                steeringSide: productDetailsint.steeringSide || "left",
                engineCapacity: productDetailsint.engineCapacity || "unknown",
                numberOfCylinders: productDetailsint.numberOfCylinders || "4",
                driverAssistance: productDetailsint.driverAssistance || [],
                entertainment: productDetailsint.entertainment || [],
                comfort: productDetailsint.comfort || [],
                exteriorFeatures: productDetailsint.exteriorFeatures || [],
              }}
              onSubmit={isEditing ? handleUpdate : handelProductDetailsdata}
              validationSchema={ProductDetailsSchema}
              enableReinitialize
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <ScrollToFieldError />
                  {setDraftValue(formik?.values)}
                  <div className="grid gap-x-4 gap-y-10 md:grid-cols-4 grid-cols-2 mt-10 ">
                    <div className="col-span-2">
                      <FormikInput
                        name="itemName"
                        type={"text"}
                        label={selectedContent[localizationKeys.itemName]}
                        placeholder={selectedContent[localizationKeys.itemName]}
                      />
                    </div>
                    <div className="col-span-2 hidden md:block"></div>
                    <div className="col-span-2 ">
                      <FormikMultiDropdown
                        name="category"
                        label={selectedContent[localizationKeys.category]}
                        placeholder={selectedContent[localizationKeys.category]}
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
                          const fieldOption = GatogryOptions.find(
                            (go) => go.value === value
                          );
                          // onReload();
                          setMaxStartPrice(fieldOption.maxStartPrice);
                          setCustomFromData([]);
                          setSubCategoryId(undefined);
                          formik.setFieldValue("subCategory", "");
                          setHasUsageCondition(fieldOption?.hasUsageCondition);
                          dispatch(
                            productDetails({
                              category: value,
                              itemName: draftValue.itemName,
                            })
                          );
                        }}
                      />
                    </div>
                    <div
                      className={
                        SubGatogryOptions?.length === 0
                          ? "hidden"
                          : "col-span-2"
                      }
                    >
                      <FormikMultiDropdown
                        name="subCategory"
                        label={selectedContent[localizationKeys.subCategory]}
                        placeholder={
                          selectedContent[localizationKeys.subCategory]
                        }
                        loading={loadingSubGatogry}
                        options={SubGatogryOptions}
                        onChange={(e) => setSubCategoryId(e)}
                      />
                    </div>
                    {formik.values.subCategory && (
                      <>
                        {[
                          ...(customFromData?.arrayCustomFields || []),
                          ...(customFromData?.regularCustomFields || []),
                        ]
                          .filter((e) => e?.key !== "brandId")
                          .map((e) => {
                            const isDropdown =
                              customFromData?.arrayCustomFields?.some(
                                (field) => field.key === e.key
                              );

                            return (
                              <div
                                key={e.key}
                                className="w-full col-span-2 sm:col-span-1 md:col-span-2"
                              >
                                {isDropdown ? (
                                  <FormikMultiDropdown
                                    name={e?.key}
                                    label={
                                      lang === "en" ? e?.labelEn : e?.labelAr
                                    }
                                    placeholder={
                                      lang === "en" ? e?.labelEn : e?.labelAr
                                    }
                                    options={
                                      e?.key === "countryId"
                                        ? AllCountriesOptions
                                        : e?.key === "cityId"
                                        ? AllCitiesOptions
                                        : allCustomFileOptions[e?.key]?.map(
                                            (option) => ({
                                              ...option,
                                              text: isArabic
                                                ? option.text.split(" | ")[1]
                                                : option.text.split(" | ")[0],
                                            })
                                          )
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
                                      lang === "en" ? e?.labelEn : e?.labelAr
                                    }
                                    placeholder={
                                      lang === "en" ? e?.labelEn : e?.labelAr
                                    }
                                    type={e?.type}
                                  />
                                )}
                              </div>
                            );
                          })}
                      </>
                    )}

                    {categoryId === 4 && (
                      <div className="col-span-2 md:col-span-4 w-full">
                        <CarSpecifications
                          brandNode={
                            <div className="w-full relative">
                              <FormikInput
                                name="brand"
                                type="text"
                                label={selectedContent[localizationKeys.brand]}
                                placeholder={selectedContent[localizationKeys.brand]}
                                value={formik.values.brand}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  formik.handleChange(e);
                                  handleBrandInputChange(value);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                              />
                              <button
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                className="absolute right-4 top-4 sm:right-3 sm:top-4 text-black hover:text-gray-70"
                                aria-label="Toggle Dropdown"
                                type="button"
                              >
                                {isDropdownOpen && brandSuggestions.length > 0 && (
                                  <MdArrowDropDown className="w-5 h-5" />
                                )}
                              </button>
                              {isDropdownOpen && brandSuggestions.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                  <ul>
                                    {brandSuggestions.map((suggestion, index) => (
                                      <li
                                        key={index}
                                        onClick={() => {
                                          formik.setFieldValue("brand", suggestion.text);
                                          setBrandInput(suggestion.text);
                                          setBrandSuggestions([]);
                                          setIsDropdownOpen(false);
                                        }}
                                        className="cursor-pointer hover:bg-gray-200 px-4 py-2"
                                      >
                                        {suggestion.text}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          }
                          modelNode={
                            customFromData?.model ? (
                              <div className="w-full">
                                <FormikInput
                                  min={0}
                                  name={`${customFromData?.model?.key}`}
                                  label={lang === "en" ? customFromData?.model?.labelEn : customFromData?.model?.labelAr}
                                  placeholder={lang === "en" ? customFromData?.model?.labelEn : customFromData?.model?.labelAr}
                                />
                              </div>
                            ) : null
                          }
                          descriptionNode={
                            <div className="md:col-span-3 w-full mt-2">
                              <FormikTextArea
                                name="itemDescription"
                                type={"text"}
                                label={selectedContent[localizationKeys.itemDescription]}
                                placeholder={selectedContent[localizationKeys.writeItemDescription]}
                              />
                            </div>
                          }
                        />
                      </div>
                    )}

                    {(formik.values.subCategory && categoryId !== 4) &&
                      categoryId !== 3 &&
                      categoryId !== 7 &&
                      !["Properties", "عقارات", "Propertiess"].includes(GatogryOptions?.find(opt => String(opt.value) === String(categoryId))?.name) && (
                        <>
                          <div className="col-span-2 sm:col-span-1  md:col-span-2 relative">
                            <FormikInput
                              name="brand"
                              type="text"
                              label={selectedContent[localizationKeys.brand]}
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
                              onClick={() => setIsDropdownOpen((prev) => !prev)}
                              className="absolute right-4 top-4 sm:right-3 sm:top-4 text-black hover:text-gray-70"
                              aria-label="Toggle Dropdown"
                            >
                              {isDropdownOpen &&
                                brandSuggestions.length > 0 && (
                                  <MdArrowDropDown className="w-5 h-5" />
                                )}
                            </button>
                            {isDropdownOpen && brandSuggestions.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                <ul>
                                  {brandSuggestions.map((suggestion, index) => (
                                    <li
                                      key={index}
                                      onClick={() => {
                                        formik.setFieldValue(
                                          "brand",
                                          suggestion.text
                                        );
                                        setBrandInput(suggestion.text);
                                        setBrandSuggestions([]);
                                        setIsDropdownOpen(false);
                                      }}
                                      className="cursor-pointer hover:bg-gray-200 px-4 py-2"
                                    >
                                      {suggestion.text}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          {customFromData?.model && (
                            <div className="col-span-2 sm:col-span-1  md:col-span-2">
                              <FormikInput
                                min={0}
                                name={`${customFromData?.model?.key}`}
                                label={
                                  lang === "en"
                                    ? customFromData?.model?.labelEn
                                    : customFromData?.model?.labelAr
                                }
                                placeholder={
                                  lang === "en"
                                    ? customFromData?.model?.labelEn
                                    : customFromData?.model?.labelAr
                                }
                              />
                            </div>
                          )}
                        </>
                      )}

                    {categoryId !== 4 && (
                      <div className="col-span-2 col-start-1 mt-1">
                        <FormikTextArea
                          name="itemDescription"
                          type={"text"}
                          label={
                            selectedContent[localizationKeys.itemDescription]
                          }
                          placeholder={
                            selectedContent[localizationKeys.writeItemDescription]
                          }
                        />
                      </div>
                    )}
                  </div>
                  {/* {isEditing ? (
                    <div className="flex items-start justify-start my-8">
                      <div className="flex items-center bg-primary/10 border border-secondary-light rounded-lg p-4 shadow-sm w-full max-w-2xl">
                        <span className="mr-3 text-primary">
                          <MdLock className="w-7 h-7" />
                        </span>
                        <div>
                          <div className="font-semibold text-primary text-base mb-1">
                            {selectedContent[localizationKeys.editingDisabled]}
                          </div>
                          <div className="text-primary text-sm">
                            {
                              selectedContent[
                                localizationKeys
                                  .editingImagesAndDocumentsIsDisabledWhileUpdatingTheAuction
                              ]
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : ( */}
                  <div>
                    <h1 className="font-bold text-base text-black pt-6">
                      {selectedContent[localizationKeys.addMedia]}{" "}
                      <span className="text-gray-600 text-sm font-normal px-1">
                        {
                          selectedContent[
                            localizationKeys.uploadOneImageAndOneVideo
                          ]
                        }
                      </span>
                    </h1>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        max="50"
                        maxLength="50"
                        onChange={handleFileChange}
                        className="w-full max-w-[660px] h-[50px] px-4 py-3 box-border pr-12"
                        style={{
                          width: "100%",
                          maxWidth: "680px",
                          height: "50px",
                          boxSizing: "border-box",
                        }}
                      />
                      <input
                        id="camera-input-file"
                        name="camera-input-file"
                        type="file"
                        accept="image/*"
                        onChange={handleCameraChange}
                        capture="environment"
                        className="hidden"
                      />
                      <label
                        htmlFor="camera-input-file"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 md:hidden cursor-pointer"
                      >
                        <IoCameraOutline className="w-7 h-7 text-primary" />
                      </label>
                    </div>
                    <div className="mt-6 w-full">
                      <ImageMedia
                        auctionId={state?.auctionId}
                        setimgtest={setimgtest}
                        images={imgtest || []}
                        onReload={onReload}
                        setLoadingImg={setLoadingImg}
                        isEditMode={isEditing}
                        auctionState={auctionState}
                      />
                    </div>
                  </div>
                  {/* )} */}
                  {[
                    "Cars",
                    "Jewellers",
                    "Properties",
                    "عقارات",
                    "مجوهرات",
                    "سيارات",
                    "Propertiess"
                  ].includes(
                    GatogryOptions.find(
                      (opt) => String(opt.value) === String(formik.values.category)
                    )?.name
                  ) &&
                    !isEditing && (
                      <div className="mb-6">
                        <label className="block font-bold text-base text-black pt-6">
                          {selectedContent[localizationKeys.uploadPdfDocument]}
                          <span className="text-gray-med text-base font-normal px-1">
                            ({selectedContent[localizationKeys.maxSize]}
                            10MB)
                          </span>
                        </label>
                        <div
                          id="pdfDocument"
                          className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ease-in-out max-w-3xl
                          ${
                            formik.touched.pdfDocument &&
                            formik.errors.pdfDocument
                              ? "border-primary text-primary bg-primary-veryLight"
                              : relatedDocuments.length > 0
                              ? "border-primary-light bg-primary-veryLight"
                              : "border-gray-med hover:border-primary bg-gray-light hover:bg-primary-veryLight"
                          }`}
                        >
                          <input
                            name="relatedDocument"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.type === "application/pdf") {
                                  if (file.size <= 10 * 1024 * 1024) {
                                    // 10MB limit
                                    formik.setFieldValue("pdfDocument", file);
                                    setRelatedDocuments([file]); // Reset array with new file
                                  } else {
                                    toast.error(
                                      selectedContent[
                                        localizationKeys
                                          .fileSizeShouldBeLessThan10MB
                                      ]
                                    );
                                  }
                                } else {
                                  toast.error(
                                    selectedContent[
                                      localizationKeys.pleaseUploadPdfOnly
                                    ]
                                  );
                                }
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-med"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 015.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="mt-4">
                              <p className="text-sm text-gray-dark">
                                {
                                  selectedContent[
                                    localizationKeys.dragAndDropYourPdfHereOr
                                  ]
                                }{" "}
                                <span className="text-primary font-medium hover:text-primary-dark">
                                  {
                                    selectedContent[
                                      localizationKeys.clickToBrowse
                                    ]
                                  }
                                </span>
                              </p>
                            </div>
                          </div>
                          {relatedDocuments.length > 0 &&
                            relatedDocuments[0] && (
                              <div className="mt-4 p-3 bg-white rounded border border-gray-veryLight">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center flex-1 min-w-0">
                                    <svg
                                      className="h-6 w-6 flex-shrink-0 text-primary"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                      <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                    </svg>
                                    <span className="ml-2 text-sm text-gray-verydark truncate max-w-xs">
                                      {relatedDocuments[0].name}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRelatedDocuments([]);
                                      formik.setFieldValue("pdfDocument", null);
                                      const input =
                                        document.querySelector(
                                          'input[type="file"]'
                                        );
                                      if (input) {
                                        input.value = "";
                                      }
                                    }}
                                    className="ml-2 p-1 text-primary hover:text-red-600 focus:outline-none flex-shrink-0 relative z-20"
                                  >
                                    <MdDelete className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                        {formik.touched.pdfDocument &&
                          formik.errors.pdfDocument && (
                            <div className="text-primary text-sm mt-2">
                              {formik.errors.pdfDocument}
                            </div>
                          )}
                      </div>
                    )}
                  <div
                    className={
                      hasUsageCondition ||
                      completeDraftVal?.product?.category?.hasUsageCondition ||
                      productDetailsint?.hasUsageCondition
                        ? "w-full"
                        : "hidden"
                    }
                  >
                    {!(categoryId === 7) && (
                      <h1 className="font-bold text-base text-black pt-6">
                        {selectedContent[localizationKeys.itemCondition]}
                      </h1>
                    )}

                    <div
                      className={
                        hasUsageCondition ||
                        completeDraftVal?.product?.category
                          ?.hasUsageCondition ||
                        productDetailsint?.hasUsageCondition
                          ? "mt-6 w-full"
                          : "hidden"
                      }
                    >
                      <CheckboxRadioProductDetails
                        valueRadio={valueRadio}
                        setRadioValue={setRadioValue}
                        categoryId={categoryId}
                        subCategoryId={subCategoryId}
                        isAuction
                      />
                    </div>
                  </div>
                  <div className="flex gap-x-4 sm:justify-end justify-center pb-8">
                    <div className="mt-auto w-full sm:w-auto ">
                      {!(
                        auctionState === "DRAFTED" ||
                        productDetailsint?.auctionState === "DRAFTED"
                      ) &&
                        !isEditing && (
                          <div
                            onClick={(e) => SaveAuctionAsDraft(e)}
                            className="bg-white border-primary-dark border-[1px] text-primary rounded-lg sm:w-[136px] w-full h-[48px] pt-3.5 text-center cursor-pointer"
                          >
                            {selectedContent[localizationKeys.saveAsDraft]}
                          </div>
                        )}
                    </div>
                    {isEditing ? (
                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary-dark sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN"
                      >
                        {selectedContent[localizationKeys.Submit]}
                      </button>
                    ) : (
                      <button className="bg-primary hover:bg-primary-dark sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN">
                        {selectedContent[localizationKeys.next]}
                      </button>
                    )}
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

export default ProductDetails;
