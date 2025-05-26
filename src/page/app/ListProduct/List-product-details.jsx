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
import { IoCameraOutline } from "react-icons/io5";
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

  const dispatch = useDispatch();
  const history = useHistory();
  const [draftValue, setDraftValue] = useState();
  const [imgtest, setimgtest] = useState([]);
  const [fileOne, setFileOne] = useState(null);
  const [fileTwo, setFileTwo] = useState(null);
  const [fileThree, setFileThree] = useState(null);
  const [fileFour, setFileFour] = useState(null);
  const [fileFive, setFileFive] = useState(null);

  const [valueRadio, setRadioValue] = useState(null);

  const [countriesId, setCountriesId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [subCategoryId, setSubCategoryId] = useState();

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
      const watermarkWidth = img.width * 0.3;
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

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const currentImages = imgtest || [];
    if (currentImages.length + files.length > 50) {
      toast.error(
        selectedContent[localizationKeys.youCanOnlySelectUpToFiftyImages]
      );
      event.target.value = null;
      return;
    }

    // Check if there's already a video in the current images
    const hasExistingVideo = currentImages.some((img) =>
      img.file.type.startsWith("video/")
    );

    // Check if any of the new files is a video
    const newVideos = files.filter((file) => file.type.startsWith("video/"));

    // If trying to upload a video as first item
    if (currentImages.length === 0 && newVideos.length > 0) {
      toast.error(
        selectedContent[
          localizationKeys
            .videoCannotBeTheFirstUploadPleaseUploadAnImageFirstAsItWillBeUsedAsTheCover
        ]
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
        })
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
          selectedContent[localizationKeys.youCanOnlySelectUpToFiftyImages]
        );
        event.target.value = null;
        return;
      }

      const hasExistingVideo = currentImages.some((img) =>
        img.file.type.startsWith("video/")
      );

      const isVideo = file.type.startsWith("video/");

      if (currentImages.length === 0 && isVideo) {
        toast.error(
          selectedContent[
            localizationKeys
              .videoCannotBeTheFirstUploadPleaseUploadAnImageFirstAsItWillBeUsedAsTheCover
          ]
        );
        event.target.value = null;
        return;
      }

      if (hasExistingVideo && isVideo) {
        toast.error(
          selectedContent[localizationKeys.onlyOneVideoFileIsAllowed]
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
  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (categoryId || subCategoryId || loadingImg) {
      if (SubGatogryOptions.length === 0) {
        run(
          authAxios
            .get(api.app.customField.ByCategoryId(categoryId))
            .then((res) => {
              setCustomFromData(res?.data?.data);
            })
        );
      } else
        run(
          authAxios
            .get(api.app.customField.BySubCategoryId(subCategoryId))
            .then((res) => {
              setCustomFromData(res?.data?.data);
            })
        );
    }
  }, [run, categoryId, subCategoryId, SubGatogryOptions.length, loadingImg]);

  const arrayCustomFieldsvalidations =
    customFromData?.arrayCustomFields?.reduce((acc, curr) => {
      acc[curr.key] = Yup.string().required(
        selectedContent[localizationKeys.required]
      );
      return acc;
    }, {});

  const model = customFromData?.model?.key;
  const isArabic = lang === "ar";

  const ProductDetailsSchema = Yup.object({
    itemName: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
    itemPrice: Yup.number().required(
      selectedContent[localizationKeys.required]
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
        selectedContent[localizationKeys.required]
      ),
      brand: Yup.string()
        .trim()
        .required(selectedContent[localizationKeys.required]),
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
          })
        );
        history.push(routes.app.listProduct.listProductLocationDetails);
      } else {
        toast.error(selectedContent[localizationKeys.oops]);
      }
    } else {
      toast.error(
        selectedContent[
          localizationKeys.makeSureThatYouChooseAtLeastThreeOrMorePhotos
        ]
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
    (field) => field.subCategoryId !== null || field.categoryId === 4
  );

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading || loadingSubGatogry}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in max-w-[1366px] md:mx-auto mx-5 ">
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
              initialValues={{
                itemName: "",
                itemPrice: "",
                category: "",
                subCategory: "",
                operatingSystem: "",
                releaseYear: "",
                regionOfManufacture: "",
                ramSize: "",
                processor: "",
                screenSize: "",
                model: "",
                color: "",
                brand: "",
                cameraType: "",
                material: "",
                type: "",
                memory: "",
                age: "",
                totalArea: "",
                numberOfRooms: "",
                numberOfFloors: "",
                landType: "",
                carType: "",
                cityId: "",
                countryId: "",
                itemDescription: "",
              }}
              onSubmit={handelProductDetailsdata}
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
                    <div className="col-span-2">
                      <FormikInput
                        min={0}
                        type="number"
                        name="itemPrice"
                        label={selectedContent[localizationKeys.price]}
                        placeholder="AEDXXX"
                        onWheel={(e) => e.target.blur()} // Prevent scrolling while focused
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
                          setCustomFromData([]);
                          setSubCategoryId(undefined);
                          formik.setFieldValue("subCategory", "");
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
                    {categoryId === 4 &&
                      adjustedcarField
                        .filter(
                          (field) =>
                            field.categoryId === 4 && field.key !== "brandId"
                        ) // Filter for car category
                        .map((field) => {
                          return (
                            <div
                              key={field.key}
                              className="w-full col-span-2 sm:col-span-1 md:col-span-2"
                            >
                              <FormikMultiDropdown
                                name={field.key}
                                label={`${
                                  lang === "en" ? field.labelEn : field.labelAr
                                }`}
                                placeholder={`${
                                  lang === "en" ? field.labelEn : field.labelAr
                                }`}
                                options={
                                  field.key === "countryId"
                                    ? AllCountriesOptions
                                    : field.key === "cityId"
                                    ? AllCitiesOptions
                                    : allCustomFileOptions[field.key]?.map(
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
                                  loadingAllCountries || loadingCitiesOptions
                                }
                              />
                            </div>
                          );
                        })}
                    {(formik.values.subCategory || categoryId === 4) &&
                      categoryId !== 3 &&
                      categoryId !== 7 && (
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
                              className="absolute right-4 top-4 sm:right-3 sm:top-4 text-black hover:text-gray-70" // Button to toggle dropdown
                              aria-label="Toggle Dropdown"
                            >
                              {isDropdownOpen &&
                                brandSuggestions.length > 0 && (
                                  <MdArrowDropDown className="w-5 h-5" /> // Show icon only when dropdown is open
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
                                label={`${
                                  lang === "en"
                                    ? customFromData?.model?.labelEn
                                    : customFromData?.model?.labelAr
                                }`}
                                placeholder={`${
                                  lang === "en"
                                    ? customFromData?.model?.labelEn
                                    : customFromData?.model?.labelAr
                                }`}
                              />
                            </div>
                          )}
                        </>
                      )}

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
                  </div>
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
                        accept="image/*,video/*"
                        multiple
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
                        accept="image/*,video/*"
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
                        isEditMode={auctionState === "DRAFTED"}
                      />
                    </div>
                  </div>
                  <div
                  // className={
                  //   hasUsageCondition ||
                  //   completeDraftVal?.product?.category?.hasUsageCondition ||
                  //   productDetailsint?.hasUsageCondition
                  //     ? "w-full"
                  //     : "hidden"
                  // }
                  >
                    {!(categoryId === 7 && subCategoryId === 23) && (
                      <h1 className="font-bold text-base text-black pt-6">
                        {selectedContent[localizationKeys.itemCondition]}
                      </h1>
                    )}
                    <div
                    //   className={
                    //     hasUsageCondition ||
                    //     completeDraftVal?.product?.category
                    //       ?.hasUsageCondition ||
                    //     productDetailsint?.hasUsageCondition
                    //       ? "mt-6 w-full"
                    //       : "hidden"
                    //   }
                    >
                      <CheckboxRadioProductDetails
                        valueRadio={valueRadio}
                        setRadioValue={setRadioValue}
                        categoryId={categoryId}
                        subCategoryId={subCategoryId}
                      />
                    </div>
                  </div>
                  <div className="flex gap-x-4 sm:justify-end justify-center pb-8">
                    {/* <div className="mt-auto w-full sm:w-auto ">
                      <div
                        onClick={() => SaveAuctionAsDraft()}
                        className="bg-white border-primary-dark border-[1px] text-primary rounded-lg sm:w-[136px] w-full h-[48px] pt-3.5 text-center cursor-pointer"
                      >
                        {selectedContent[localizationKeys.saveAsDraft]}
                      </div>
                    </div> */}
                    <button className="bg-primary hover:bg-primary-dark sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN">
                      {selectedContent[localizationKeys.next]}
                    </button>
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
