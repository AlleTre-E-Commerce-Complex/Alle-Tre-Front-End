import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";
import routes from "../../../routes";

import { CheckboxRadioProductDetails } from "../../../components/create-auction-components/check-box-radio-group";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import AddImgMedia from "../../../components/create-auction-components/add-img-media";
import { allCustomFileOptions } from "../../../utils/all-custom-fields-options";
import Stepper from "../../../components/shared/stepper/stepper-app";
import { Dimmer, Loader, Form } from "semantic-ui-react";
import { toast } from "react-hot-toast";

import { ScrollToFieldError } from "../../../components/shared/formik/formik-scroll-to-field-error";
import FormikMultiDropdown from "../../../components/shared/formik/formik-dropdown";
import FormikTextArea from "../../../components/shared/formik/formik-text-area";
import FormikInput from "../../../components/shared/formik/formik-input";
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

const ProductDetails = () => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const productDetailsint = useSelector(
    (state) => state.productDetails.productDetails
  );
  const dispatch = useDispatch();

  const history = useHistory();

  const [draftValue, setDraftValue] = useState();
  const [fileOne, setFileOne] = useState(productDetailsint.fileOne || null);
  const [fileTwo, setFileTwo] = useState(productDetailsint.fileTwo || null);
  const [fileThree, setFileThree] = useState(
    productDetailsint.fileThree || null
  );
  const [fileFour, setFileFour] = useState(productDetailsint.fileFour || null);
  const [fileFive, setFileFive] = useState(productDetailsint.fileFive || null);

  const [valueRadio, setRadioValue] = useState(
    productDetailsint.valueRadio || null
  );
  const [countriesId, setCountriesId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [subCategoryId, setSubCategoryId] = useState();

  const [hasUsageCondition, setHasUsageCondition] = useState(
    false || productDetailsint.hasUsageCondition
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

  const { AllBranOptions, loadingAllBranOptions } = useGetBrand(
    categoryId || productDetailsint.category
  );

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (
      categoryId ||
      subCategoryId ||
      productDetailsint.category ||
      productDetailsint.subCategory
    )
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
  }, [
    SubGatogryOptions.length,
    categoryId,
    productDetailsint.category,
    productDetailsint.subCategory,
    run,
    subCategoryId,
    forceReload,
  ]);
  const regularCustomFieldsvalidations =
    customFromData?.regularCustomFields?.reduce((acc, curr) => {
      acc[curr.key] = Yup.string().required("Required");
      return acc;
    }, {});
  const arrayCustomFieldsvalidations =
    customFromData?.arrayCustomFields?.reduce((acc, curr) => {
      acc[curr.key] = Yup.string().required("Required");
      return acc;
    }, {});

  const model = customFromData?.model?.key;
  const ProductDetailsSchema = Yup.object({
    itemName: Yup.string().trim().required("required"),
    category: Yup.string().trim().required("required"),
    itemDescription: Yup.string().trim().required("required"),
    ...regularCustomFieldsvalidations,
    ...arrayCustomFieldsvalidations,
    model: Yup.string().when([], {
      is: () => model,
      then: Yup.string().required("required"),
      otherwise: Yup.string().notRequired(),
    }),
    subCategory: Yup.string().when([], {
      is: () => SubGatogryOptions?.length === 0,
      then: Yup.string().notRequired(),
      otherwise: Yup.string().required("required"),
    }),
  });

  const handelProductDetailsdata = (values) => {
    if (fileThree) {
      if (valueRadio || draftValue.valueRadio || productDetailsint.valueRadio) {
        dispatch(
          productDetails({
            ...values,
            hasUsageCondition: hasUsageCondition,
            valueRadio: valueRadio,
            fileOne: fileOne,
            fileTwo: fileTwo,
            fileThree: fileThree,
            fileFour: fileFour,
            fileFive: fileFive,
          })
        );
        history.push(routes.app.createAuction.auctionDetails);
      } else {
        if (hasUsageCondition) {
          toast.error("Make sure that you choose Item Condition value");
        }
      }
      if (!hasUsageCondition) {
        dispatch(
          productDetails({
            ...values,
            hasUsageCondition: hasUsageCondition,
            valueRadio: valueRadio,
            fileOne: fileOne,
            fileTwo: fileTwo,
            fileThree: fileThree,
            fileFour: fileFour,
            fileFive: fileFive,
          })
        );
        history.push(routes.app.createAuction.auctionDetails);
      }
    } else {
      toast.error("Make sure that you choose at least three or more photos");
    }
  };

  const {
    run: runSaveAuctionAsDraft,
    isLoading: isLoadingCSaveAuctionAsDraft,
  } = useAxios([]);
  const SaveAuctionAsDraft = () => {
    const formData = new FormData();
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
    if (draftValue.brandId || productDetailsint.brandId) {
      formData.append(
        "brandI",
        draftValue.brandId || productDetailsint.brandId
      );
    }
    if (draftValue.valueRadio || productDetailsint.valueRadio) {
      formData.append(
        "usageStatus",
        draftValue.valueRadio || productDetailsint.valueRadio
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
    if (draftValue.totalArea || productDetailsint.totalArea) {
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
    if (
      draftValue.regionOfManufacture ||
      productDetailsint.regionOfManufacture
    ) {
      formData.append(
        "regionOfManufacture",
        draftValue.regionOfManufacture || productDetailsint.regionOfManufacture
      );
    }
    if (draftValue.numberOfFloors || productDetailsint.numberOfFloors) {
      formData.append(
        "numberOfFloors",
        draftValue.numberOfFloors || productDetailsint.numberOfFloors
      );
    }
    if (draftValue.numberOfRooms || productDetailsint.numberOfRooms) {
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
      formData.append(
        "cityId",
        draftValue.cityId || productDetailsint.countryId
      );
    }
    if (fileFive) {
      formData.append("images", fileOne || productDetailsint.fileOne);
    }
    if (fileTwo) {
      formData.append("images", fileTwo || productDetailsint.fileTwo);
    }
    if (fileThree) {
      formData.append("images", fileThree || productDetailsint.fileThree);
    }
    if (fileThree || productDetailsint.fileFour) {
      formData.append("images", fileThree || productDetailsint.fileFour);
    }
    if (fileFive || productDetailsint.fileFive) {
      formData.append("images", fileFive || productDetailsint.fileFive);
    }

    runSaveAuctionAsDraft(
      authAxios
        .post(api.app.auctions.setAssdraft, formData)
        .then((res) => {
          toast.success("your Auction Save As Drafted success");
          history.push(routes.app.createAuction.default);
          dispatch(productDetails({}));
        })
        .catch((err) => {
          toast.error(
            err?.message.map((e) => e) ||
              "oops, sorry something with wrong please make sure everything is correct and try again"
          );
        })
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="mt-44 animate-in max-w-[1366px] md:mx-auto mx-5 ">
      <Dimmer
        className="animate-pulse"
        active={isLoading || loadingSubGatogry || isLoadingCSaveAuctionAsDraft}
        inverted
      >
        <Loader active />
      </Dimmer>
      <div className=" h-14 my-7 py-4 sm:block hidden">
        {/* Breadcrumb  */}
        <CreateAuctionBreadcrumb />
      </div>
      {/* stepper */}
      <div className="flex justify-center">
        <Stepper />
      </div>
      <div className="">
        <h1 className="text-black text-base font-bold mt-4">Item Details</h1>
        {/* formik */}
        <div>
          <Formik
            initialValues={{
              itemName: productDetailsint.itemName || "",
              category: productDetailsint.category || "",
              subCategory: productDetailsint.subCategory || "",
              operatingSystem: productDetailsint.operatingSystem || "",
              releaseYear: productDetailsint.releaseYear || "",
              regionOfManufacture: productDetailsint.regionOfManufacture || "",
              ramSize: productDetailsint.ramSize || "",
              processor: productDetailsint.processor || "",
              screenSize: productDetailsint.screenSize || "",
              model: productDetailsint.model || "",
              color: productDetailsint.color || "",
              brandId: productDetailsint.brandId || "",
              cameraType: productDetailsint.cameraType || "",
              material: productDetailsint.material || "",
              age: productDetailsint.age || "",
              totalArea: productDetailsint.totalArea || "",
              numberOfRooms: productDetailsint.numberOfRooms || "",
              numberOfFloors: productDetailsint.numberOfFloors || "",
              landType: productDetailsint.landType || "",
              carType: productDetailsint.carType || "",
              cityId: productDetailsint.cityId || "",
              countryId: productDetailsint.countryId || "",
              itemDescription: productDetailsint.itemDescription || "",
            }}
            onSubmit={handelProductDetailsdata}
            validationSchema={ProductDetailsSchema}
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
                      label={"Item Name"}
                      placeholder="Item Name"
                    />
                  </div>
                  <div className="col-span-2 hidden md:block"></div>
                  <div className="col-span-2 ">
                    <FormikMultiDropdown
                      name="category"
                      label={"Category"}
                      placeholder="Category"
                      options={GatogryOptions}
                      loading={loadingGatogry}
                      onChange={(value) => {
                        setCategoryId(value);
                        const fieldOption = GatogryOptions.find(
                          (go) => go.value === value
                        );
                        setHasUsageCondition(fieldOption?.hasUsageCondition);
                        onReload();
                        setCustomFromData([]);
                      }}
                    />
                  </div>
                  <div
                    className={
                      SubGatogryOptions?.length === 0 ? "hidden" : "col-span-2"
                    }
                  >
                    <FormikMultiDropdown
                      name="subCategory"
                      label={"Sub Category"}
                      placeholder="Sub Category"
                      loading={loadingSubGatogry}
                      options={SubGatogryOptions}
                      onChange={(e) => setSubCategoryId(e)}
                    />
                  </div>
                  {customFromData?.arrayCustomFields?.map((e) => (
                    <div className="w-full col-span-2 sm:col-span-1 ">
                      <FormikMultiDropdown
                        name={e?.key}
                        label={`${lang === "en" ? e?.labelEn : e?.labelAr}`}
                        placeholder={`${
                          lang === "en" ? e?.labelEn : e?.labelAr
                        }`}
                        options={
                          e?.key === "brandId"
                            ? AllBranOptions
                            : e?.key === "countryId"
                            ? AllCountriesOptions
                            : e?.key === "cityId"
                            ? AllCitiesOptions
                            : allCustomFileOptions[e?.key]
                        }
                        onChange={(e) => setCountriesId(e)}
                        loading={
                          loadingAllBranOptions ||
                          loadingAllCountries ||
                          loadingCitiesOptions
                        }
                      />
                    </div>
                  ))}
                  <div
                    className={
                      customFromData?.model?.key
                        ? "w-full mt-1.5 col-span-2 sm:col-span-1"
                        : "hidden"
                    }
                  >
                    <FormikInput
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
                  {customFromData?.regularCustomFields?.map((e) => (
                    <div className="w-full mt-1.5 col-span-2 sm:col-span-1">
                      <FormikInput
                        name={e?.key}
                        type={e?.type}
                        label={lang === "en" ? e?.labelEn : e?.labelAr}
                        placeholder={`${
                          lang === "en" ? e?.labelEn : e?.labelAr
                        }`}
                      />
                    </div>
                  ))}
                  <div className="col-span-2 col-start-1 mt-1">
                    <FormikTextArea
                      name="itemDescription"
                      type={"text"}
                      label={"Item Description"}
                      placeholder="Write Item Description...."
                    />
                  </div>
                </div>
                <div>
                  <h1 className="font-bold text-base text-black pt-6">
                    Add Media{" "}
                    <span className="text-gray-med text-base font-normal">
                      (from 3 up to 5 photos )
                    </span>
                  </h1>
                  <div className="mt-6 w-full">
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
                  </div>
                </div>
                <div className={hasUsageCondition ? "w-full" : "hidden"}>
                  <h1 className="font-bold text-base text-black pt-6">
                    Item Condition
                  </h1>
                  <div className={hasUsageCondition ? "mt-6 w-full" : "hidden"}>
                    <CheckboxRadioProductDetails
                      valueRadio={valueRadio}
                      setRadioValue={setRadioValue}
                    />
                  </div>
                </div>
                <div className="flex gap-x-4 sm:justify-end justify-center pb-8">
                  <div className="mt-auto w-full sm:w-auto ">
                    <div
                      onClick={() => SaveAuctionAsDraft()}
                      className="bg-white border-primary-dark border-[1px] text-primary rounded-lg sm:w-[136px] w-full h-[48px] pt-3.5 text-center cursor-pointer"
                    >
                      Save As Draft
                    </div>
                  </div>
                  <button className="bg-primary hover:bg-primary-dark sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN">
                    Next
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
