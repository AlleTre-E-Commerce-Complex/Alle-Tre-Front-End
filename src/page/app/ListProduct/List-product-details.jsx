import React, { useState, useEffect } from "react";

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
import { useDispatch } from "react-redux";
import useGetAllCountries from "../../../hooks/use-get-all-countries";
import useGetAllCities from "../../../hooks/use-get-all-cities";
// import EditImgeMedia from "../../../component/create-auction-components/edit-imge-media";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
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
const ListProductDetails = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { state } = useLocation();

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
  const [fileOne, setFileOne] = useState(null);
  const [fileTwo, setFileTwo] = useState(null);
  const [fileThree, setFileThree] = useState(null);
  const [fileFour, setFileFour] = useState(null);
  const [fileFive, setFileFive] = useState(null);
  const [listedProductVal, setListedProductVal] = useState();
  console.log("listedProductVal", listedProductVal);
  const [valueRadio, setRadioValue] = useState(null);

  const [countriesId, setCountriesId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [subCategoryId, setSubCategoryId] = useState();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [product_Id] = useState(state?.productId || null);

  useEffect(() => {
    if (state?.isEditing) {
      setIsEditing(true);
    }
  }, [state]);

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

  useEffect(() => {
    if (product_Id) {
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

            // Set initial usage status
            if (productData?.usageStatus) {
              setRadioValue(productData.usageStatus);
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
  }, [run, forceReload, product_Id]);

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
      toast.error(selectedContent[localizationKeys.errorInWatermarkProcess]);
      throw error;
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

  const arrayCustomFieldsvalidations =
    customFromData?.arrayCustomFields?.reduce((acc, curr) => {
      acc[curr.key] = Yup.string().required(
        selectedContent[localizationKeys.required],
      );
      return acc;
    }, {});

  const isArabic = lang === "ar";
  const handleUpdate = async (values) => {
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
      if (values.regionOfManufacture)
        formData.append(
          "product[regionOfManufacture]",
          values.regionOfManufacture,
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
        history.push(routes.app.profile.myProducts.default);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error?.response?.data?.message ||
          selectedContent[
            localizationKeys.somethingWentWrongPleaseTryAgainLater
          ],
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const ProductDetailsSchema = Yup.object({
    itemName: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
    itemPrice: Yup.number().required(
      selectedContent[localizationKeys.required],
    ),
    category: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
    itemDescription: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
    // ...regularCustomFieldsvalidations,
    ...arrayCustomFieldsvalidations,
    // model: Yup.string().when([], {
    //   is: () => model,
    //   then: Yup.string().required(selectedContent[localizationKeys.required]),
    //   otherwise: Yup.string().notRequired(),
    // }),
    subCategory: Yup.string().when([], {
      is: () => SubGatogryOptions?.length === 0,
      then: Yup.string().notRequired(),
      otherwise: Yup.string().required(
        selectedContent[localizationKeys.required],
      ),
    }),
  });

  const handelProductDetailsdata = (values) => {
    if (imgtest.length >= 3) {
      if (valueRadio) {
        dispatch(
          listingProductDetails({
            ...values,
            valueRadio,
            images: imgtest.map((img) => ({
              file: img.file,
              imageLink: img.imageLink,
              imagePath: img.file.name,
            })),
            auctionState,
            auctionId: completeDraftVal?.id,
          }),
        );
        history.push(routes.app.listProduct.listProductLocationDetails);
      } else {
        toast.error(selectedContent[localizationKeys.oops]);
      }
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

  const carField = [
    ...(customFromData?.arrayCustomFields || []),
    ...(customFromData?.regularCustomFields || []),
  ];
  const adjustedcarField = carField.filter(
    (field) => field.subCategoryId !== null || field.categoryId === 4,
  );

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading || loadingSubGatogry || isUpdating}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in max-w-[1366px] md:mx-auto mx-5 ">
        {/* <Loader active /> */}
        {/* <div className=" h-14 my-7 py-4 sm:block hidden">
          <CreateAuctionBreadcrumb />
        </div> */}
        {/* stepper */}
        <div className="flex justify-center">
          <Stepper />
        </div>
        <div className="w-full flex flex-col gap-6 mt-5">
          <div>
            <Formik
              initialValues={{
                itemName: isEditing ? listedProductVal?.title || "" : "",
                itemPrice: isEditing
                  ? listedProductVal?.ProductListingPrice || ""
                  : "",
                category: isEditing ? listedProductVal?.categoryId || "" : "",
                subCategory: isEditing
                  ? listedProductVal?.subCategory?.id || ""
                  : "",
                operatingSystem: isEditing
                  ? listedProductVal?.operatingSystem || ""
                  : "",
                releaseYear: isEditing
                  ? listedProductVal?.releaseYear || ""
                  : "",
                regionOfManufacture: isEditing
                  ? listedProductVal?.regionOfManufacture || ""
                  : "",
                ramSize: isEditing ? listedProductVal?.ramSize || "" : "",
                processor: isEditing ? listedProductVal?.processor || "" : "",
                screenSize: isEditing ? listedProductVal?.screenSize || "" : "",
                model: isEditing ? listedProductVal?.model || "" : "",
                color: isEditing ? listedProductVal?.color || "" : "",
                brand: isEditing ? listedProductVal?.brand || "" : "",
                cameraType: isEditing ? listedProductVal?.cameraType || "" : "",
                material: isEditing ? listedProductVal?.material || "" : "",
                type: isEditing ? listedProductVal?.type || "" : "",
                memory: isEditing ? listedProductVal?.memory || "" : "",
                age: isEditing ? listedProductVal?.age || "" : "",
                totalArea: isEditing ? listedProductVal?.totalArea || "" : "",
                numberOfRooms: isEditing
                  ? listedProductVal?.numberOfRooms || ""
                  : "",
                numberOfFloors: isEditing
                  ? listedProductVal?.numberOfFloors || ""
                  : "",
                landType: isEditing ? listedProductVal?.landType || "" : "",
                carType: isEditing ? listedProductVal?.carType || "" : "",
                cityId: isEditing
                  ? listedProductVal?.cityId?.toString() || ""
                  : "",
                countryId: isEditing
                  ? listedProductVal?.countryId?.toString() || ""
                  : "",
                itemDescription: isEditing
                  ? listedProductVal?.description || ""
                  : "",
              }}
              onSubmit={isEditing ? handleUpdate : handelProductDetailsdata}
              validationSchema={ProductDetailsSchema}
              enableReinitialize
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                  <ScrollToFieldError />
                  {setDraftValue(formik?.values)}

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
                        <div className="md:col-span-2">
                          <FormikInput
                            name="itemName"
                            type={"text"}
                            label={selectedContent[localizationKeys.itemName]}
                            placeholder={
                              selectedContent[localizationKeys.itemName]
                            }
                          />
                        </div>

                        <div className="w-full">
                          <FormikMultiDropdown
                            name="category"
                            label={selectedContent[localizationKeys.category]}
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
                        )}

                        {categoryId === 4 &&
                          adjustedcarField
                            .filter(
                              (field) =>
                                field.categoryId === 4 &&
                                field.key !== "brandId",
                            ) // Filter for car category
                            .map((field) => {
                              return (
                                <div key={field.key} className="w-full">
                                  <FormikMultiDropdown
                                    name={field.key}
                                    label={`${lang === "en" ? field.labelEn : field.labelAr}`}
                                    placeholder={`${lang === "en" ? field.labelEn : field.labelAr}`}
                                    options={
                                      field.key === "countryId"
                                        ? AllCountriesOptions
                                        : field.key === "cityId"
                                          ? AllCitiesOptions
                                          : allCustomFileOptions[
                                              field.key
                                            ]?.map((option) => ({
                                              ...option,
                                              text: isArabic
                                                ? option.text.split(" | ")[1]
                                                : option.text.split(" | ")[0],
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
                                </div>
                              );
                            })}

                        {(formik.values.subCategory || categoryId === 4) &&
                          categoryId !== 3 &&
                          categoryId !== 7 && (
                            <>
                              <div className="w-full relative">
                                <FormikInput
                                  name="brand"
                                  type="text"
                                  label={
                                    selectedContent[localizationKeys.brand]
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
                                    label={`${lang === "en" ? customFromData?.model?.labelEn : customFromData?.model?.labelAr}`}
                                    placeholder={`${lang === "en" ? customFromData?.model?.labelEn : customFromData?.model?.labelAr}`}
                                  />
                                </div>
                              )}
                            </>
                          )}

                        <div className="md:col-span-2 w-full mt-2 ">
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
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      {/* Pricing Card */}
                      <div className="bg-white dark:bg-[#1A1F2C] border border-gray-200 dark:border-[#d4af37]/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-6">
                          <IoPricetagOutline className="dark:text-primary-light text-yellow w-6 h-6" />
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {selectedContent[localizationKeys.Price]}
                          </h2>
                        </div>
                        <div className="w-full">
                          <FormikInput
                            min={0}
                            type="number"
                            name="itemPrice"
                            label={
                              selectedContent[localizationKeys.price] +
                              (lang === "en" ? " (AED)" : "")
                            }
                            placeholder="AED 000"
                            onWheel={(e) => e.target.blur()}
                          />
                        </div>
                      </div>

                      {/* Condition Card */}
                      {!(categoryId === 7 && subCategoryId === 23) ? (
                        <div className="bg-white dark:bg-[#1A1F2C] border border-gray-200 dark:border-[#d4af37]/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col h-full">
                          <div className="flex items-center gap-2 mb-6">
                            <IoRibbonOutline className="dark:text-primary-light text-yellow w-6 h-6" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {selectedContent[localizationKeys.itemCondition]}
                            </h2>
                          </div>
                          <div className="w-full h-full">
                            <CheckboxRadioProductDetails
                              valueRadio={valueRadio}
                              setRadioValue={setRadioValue}
                              categoryId={categoryId}
                              subCategoryId={subCategoryId}
                            />
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                    {/* Media Card */}
                    <div className="bg-white dark:bg-[#1A1F2C] border border-gray-200 dark:border-[#d4af37]/40 rounded-2xl p-6 md:p-8 shadow-sm">
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
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileChange}
                        id="media-upload"
                        className="hidden"
                      />
                      <input
                        id="camera-input-file"
                        name="camera-input-file"
                        type="file"
                        accept="image/*,video/*"
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
                          isEditMode={isEditing}
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

                      {isEditing ? (
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-dark sm:w-[220px] w-full h-[48px] rounded-lg text-white font-semibold text-base rtl:font-serifAR ltr:font-serifEN transition-colors"
                        >
                          {selectedContent[localizationKeys.Submit]}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-dark dark:bg-yellow dark:hover:bg-yellow-dark sm:w-[220px] w-full h-[48px] rounded-lg dark:text-black text-white font-semibold text-base rtl:font-serifAR ltr:font-serifEN transition-colors flex items-center justify-center gap-2"
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
