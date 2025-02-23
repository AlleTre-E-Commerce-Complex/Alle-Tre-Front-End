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
  const [imgtest, setimgtest] = useState();
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
    const filteredBrands = NotAllBranOptions.filter((brand) =>
      brand.text.toLowerCase().includes(value.toLowerCase())
    );
    setBrandSuggestions(filteredBrands);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    // Check if user selected more than 5 files
    const totalFiles =
      (fileOne ? 1 : 0) +
      (fileTwo ? 1 : 0) +
      (fileThree ? 1 : 0) +
      (fileFour ? 1 : 0) +
      (fileFive ? 1 : 0) +
      files.length;
    if (totalFiles > 5) {
      toast.error(
        selectedContent[localizationKeys.youCanOnlySelectUpToFiveImages]
      );
      // Clear the input
      event.target.value = "";
      return;
    }

    const fileArray = Array.from(files);
    const newFiles = [fileOne, fileTwo, fileThree, fileFour, fileFive];

    // Add new files to the existing files
    let index = 0;
    for (const file of fileArray) {
      while (index < newFiles.length && newFiles[index]) {
        index++;
      }
      if (index < newFiles.length) {
        newFiles[index] = file; // Add new file to the first empty slot
      }
    }

    // Set the updated files back to state
    setFileOne(newFiles[0]);
    setFileTwo(newFiles[1]);
    setFileThree(newFiles[2]);
    setFileFour(newFiles[3]);
    setFileFive(newFiles[4]);
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
    model: Yup.string().when([], {
      is: () => model,
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
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
    const filesCount = [fileOne, fileTwo, fileThree, fileFour, fileFive].filter(
      Boolean
    ).length;
    if (filesCount >= 3) {
      if (valueRadio) {
        // const formData = new FormData();
        // formData.append("product[title]", values.itemName);
        // formData.append("product[ProductListingPrice]", values.itemPrice);
        // formData.append("product[categoryId]", values.category);
        // if (values.subCategory) {
        //   formData.append("product[subCategoryId]", values.subCategory);
        // }
        // if (values.brand) {
        //   formData.append("product[brand]", values.brand);
        // }
        // if (values.valueRadio) {
        //   formData.append("product[usageStatus]", values.valueRadio);
        // }
        // if (values.color) {
        //   formData.append("product[color]", values.color);
        // }
        // if (values.age) {
        //   formData.append("product[age]", values.age);
        // }
        // if (values.landType) {
        //   formData.append("product[landType]", values.landType);
        // }
        // if (values.cameraType) {
        //   formData.append("product[cameraType]", values.cameraType);
        // }
        // if (values.carType) {
        //   formData.append("product[carType]", values.carType);
        // }
        // if (values.material) {
        //   formData.append("product[material]", values.material);
        // }
        // if (values.memory) {
        //   formData.append("product[memory]", values.memory);
        // }
        // if (values.model) {
        //   formData.append("product[model]", values.model);
        // }
        // if (values.processor) {
        //   formData.append("product[processor]", values.processor);
        // }
        // if (values.ramSize) {
        //   formData.append("product[ramSize]", values.ramSize);
        // }
        // if (values.releaseYear) {
        //   formData.append("product[releaseYear]", values.releaseYear);
        // }
        // if (values.screenSize) {
        //   formData.append("product[screenSize]", values.screenSize);
        // }
        // if (values.totalArea) {
        //   formData.append("product[totalArea]", values.totalArea);
        // }
        // if (values.operatingSystem) {
        //   formData.append("product[operatingSystem]", values.operatingSystem);
        // }
        // if (values.regionOfManufacture) {
        //   formData.append(
        //     "product[regionOfManufacture]",
        //     values.regionOfManufacture
        //   );
        // }
        // if (values.numberOfFloors) {
        //   formData.append("product[numberOfFloors]", values.numberOfFloors);
        // }
        // if (values.numberOfRooms) {
        //   formData.append("product[numberOfRooms]", values.numberOfRooms);
        // }
        // if (values.itemDescription) {
        //   formData.append("product[description]", values.itemDescription);
        // }
        // if (values.countryId) {
        //   formData.append("product[countryId]", values.countryId);
        // }
        // if (values.cityId) {
        //   formData.append("product[cityId]", values.cityId);
        // }
        // // if (offerDataInt.IsOfferPrice) {
        // //   formData.append("product[isOffer]", offerDataInt.IsOfferPrice);
        // //   formData.append("product[offerAmount]", offerDataInt.offerAmount);
        // // }
        // if (values?.auctionState === "DRAFTED") {
        // } else {
        //   formData.append("images", fileOne);

        //   formData.append("images", fileTwo);

        //   formData.append("images", fileThree);

        //   if (fileFour) {
        //     formData.append("images", fileFour);
        //   }
        //   if (fileFive) {
        //     formData.append("images", fileFive);
        //   }
        // }

        // run(
        //   authAxios
        //     .post(api.app.productListing.listNewProduct, formData)
        //     .then((res) => {
        //       toast.success(
        //         selectedContent[
        //           localizationKeys.yourProductIsSuccessfullyListed
        //         ]
        //       );
        //       history.push(routes.app.home);
        //     })
        //     .catch((error) => {
        //       toast.error(
        //         selectedContent[
        //           localizationKeys.makeSureThatYouChooseAtLeastThreeOrMorePhotos
        //         ]
        //       );
        //     })
        // );
        dispatch(
          listingProductDetails({
            ...values,
            valueRadio,
            fileOne,
            fileTwo,
            fileThree,
            fileFour,
            fileFive,
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

  const handleCameraChange = (event) => {
    const file = event.target.files[0]; // Get single captured photo
    if (file) {
      // Find first empty slot
      if (!fileOne) setFileOne(file);
      else if (!fileTwo) setFileTwo(file);
      else if (!fileThree) setFileThree(file);
      else if (!fileFour) setFileFour(file);
      else if (!fileFive) setFileFive(file);
      else
        toast.error(
          selectedContent[localizationKeys.youCanOnlySelectUpToFiveImages]
        );
    }
    // Reset input
    event.target.value = "";
  };

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
                        options={GatogryOptions.map((option) => ({
                          ...option,
                          text:
                            option.text === "Electronic Devices" ||
                            option.text === "الأجهزة الإلكترونية" ? (
                              option.text
                            ) : (
                              <div className="flex justify-between items-center">
                                <span>{option.text}</span>
                                <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-lg">
                                  {selectedContent[localizationKeys.comingSoon]}
                                </span>
                              </div>
                            ),
                          disabled:
                            option.text !== "Electronic Devices" &&
                            option.text !== "الأجهزة الإلكترونية",
                        }))}
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
                      categoryId !== 3 && (
                        <>
                          <div className="col-span-2 sm:col-span-1  md:col-span-2 relative">
                            <FormikInput
                              name="brand"
                              type="text"
                              label={selectedContent[localizationKeys.brand]}
                              placeholder={
                                selectedContent[localizationKeys.brand]
                              }
                              value={brandInput}
                              onChange={(e) => {
                                handleBrandInputChange(e.target.value);
                                formik.handleChange(e);
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
                      <span className="text-gray-med text-base font-normal px-1">
                        {selectedContent[localizationKeys.from3upto5photos]}
                      </span>
                    </h1>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        max="5"
                        maxLength="5"
                        onChange={handleFileChange}
                        className="w-full max-w-[680px] h-[50px] px-4 py-3 box-border pr-12"
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
                      {/* {auctionState === "DRAFTED"  ? (
                        <EditImgeMedia
                          auctionId={state?.auctionId}
                          imgOne={imgtest && imgtest[0]}
                          fileOne={fileOne}
                          setFileOne={setFileOne}
                          imgTwo={imgtest && imgtest[1]}
                          fileTwo={fileTwo}
                          setFileTwo={setFileTwo}
                          imgThree={imgtest && imgtest[2]}
                          fileThree={fileThree}
                          setFileThree={setFileThree}
                          imgFour={imgtest && imgtest[3]}
                          fileFour={fileFour}
                          setFileFour={setFileFour}
                          imgFive={imgtest && imgtest[4]}
                          fileFive={fileFive}
                          setFileFive={setFileFive}
                          onReload={onReload}
                          setLoadingImg={setLoadingImg}
                        />
                      ) : (
                        <AddImgMedia
                          fileOne={fileOne}
                          setFileOne={setFileOne}
                          fileTwo={fileTwo}
                          setFileTwo={setFileTwo}
                          fileThree={fileThree}
                          setFileThree={setFileThree}
                          fileFour={fileFour}
                          setFileFour={setFileFour}
                          fileFive={fileFive}
                          setFileFive={setFileFive}
                        />
                      )} */}
                      <ImageMedia
                        auctionId={state?.auctionId}
                        imgOne={imgtest && imgtest[0]}
                        fileOne={fileOne}
                        setFileOne={setFileOne}
                        imgTwo={imgtest && imgtest[1]}
                        fileTwo={fileTwo}
                        setFileTwo={setFileTwo}
                        imgThree={imgtest && imgtest[2]}
                        fileThree={fileThree}
                        setFileThree={setFileThree}
                        imgFour={imgtest && imgtest[3]}
                        fileFour={fileFour}
                        setFileFour={setFileFour}
                        imgFive={imgtest && imgtest[4]}
                        fileFive={fileFive}
                        setFileFive={setFileFive}
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
                    <h1 className="font-bold text-base text-black pt-6">
                      {selectedContent[localizationKeys.itemCondition]}
                    </h1>
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
