import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Stepper from "../../../components/shared/stepper/stepper-app";
import routes from "../../../routes";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Dimmer, Loader, Form } from "semantic-ui-react";
import FormikInput from "../../../components/shared/formik/formik-input";
import FormikMultiDropdown from "../../../components/shared/formik/formik-dropdown";
import FormikTextArea from "../../../components/shared/formik/formik-text-area";
import { useEffect } from "react";
import AddImgMedia from "../../../components/create-auction-components/add-img-media";
import { CheckboxRadioProductDetails } from "../../../components/create-auction-components/check-box-radio-group";
import useGetGatogry from "../../../hooks/use-get-category";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import useAxios from "../../../hooks/use-axios";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import { useDispatch, useSelector } from "react-redux";
import { productDetails } from "../../../redux-store/product-details-Slice";
import { allCustomFileOptions } from "../../../utils/all-custom-fields-options";
import useGetBrand from "../../../hooks/use-get-brand";
import { toast } from "react-hot-toast";

const ProductDetails = () => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];

  const productDetailsint = useSelector(
    (state) => state.productDetails.productDetails
  );
  const dispatch = useDispatch();

  const history = useHistory();

  const [fileOne, setFileOne] = useState(productDetailsint.fileOne || null);
  const [fileTwo, setFileTwo] = useState(productDetailsint.fileTwo || null);
  const [fileThree, setFileThree] = useState(
    productDetailsint.fileThree || null
  );
  const [fileFour, setFileFour] = useState(productDetailsint.fileFour || null);
  const [fileFive, setFileFive] = useState(productDetailsint.fileFive || null);

  const [valueRadio, setRadioValue] = useState(productDetailsint.valueRadio);
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
  ]);

  const ProductDetailsSchema = Yup.object({
    itemName: Yup.string().trim().required("required"),
    category: Yup.string().trim().required("required"),
    itemDescription: Yup.string().trim().required("required"),
  });

  const handelProductDetailsdata = (values) => {
    if (fileThree) {
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
      history.push(routes.createAuction.auctionDetails);
    }
  };

  const {
    run: runSaveAuctionAsDraft,
    isLoading: isLoadingCSaveAuctionAsDraft,
  } = useAxios([]);
  const SaveAuctionAsDraft = () => {
    const formData = new FormData();
    formData.append("title", productDetailsint.itemName);
    formData.append("categoryId", productDetailsint.category);
    if (productDetailsint.subCategory) {
      formData.append("subCategoryId", productDetailsint.subCategory);
    }
    if (productDetailsint.brandId) {
      formData.append("brandI]", productDetailsint.brandId);
    }
    if (productDetailsint.valueRadio) {
      formData.append("usageStatus", productDetailsint.valueRadio);
    }
    if (productDetailsint.color) {
      formData.append("colo]", productDetailsint.color);
    }
    if (productDetailsint.age) {
      formData.append("age", productDetailsint.age);
    }
    if (productDetailsint.landType) {
      formData.append("landType", productDetailsint.landType);
    }
    if (productDetailsint.cameraType) {
      formData.append("cameraType", productDetailsint.cameraType);
    }
    if (productDetailsint.carType) {
      formData.append("carType", productDetailsint.carType);
    }
    if (productDetailsint.material) {
      formData.append("material", productDetailsint.material);
    }
    if (productDetailsint.model) {
      formData.append("model", productDetailsint.model);
    }
    if (productDetailsint.processor) {
      formData.append("processor", productDetailsint.processor);
    }
    if (productDetailsint.ramSize) {
      formData.append("ramSize", productDetailsint.ramSize);
    }
    if (productDetailsint.releaseYear) {
      formData.append("releaseYear", productDetailsint.releaseYear);
    }
    if (productDetailsint.screenSize) {
      formData.append("screenSize", productDetailsint.screenSize);
    }
    if (productDetailsint.totalArea) {
      formData.append("totalArea", productDetailsint.totalArea);
    }
    if (productDetailsint.operatingSystem) {
      formData.append("operatingSystem", productDetailsint.operatingSystem);
    }
    if (productDetailsint.regionOfManufacture) {
      formData.append(
        "regionOfManufacture",
        productDetailsint.regionOfManufacture
      );
    }
    if (productDetailsint.numberOfFloors) {
      formData.append("numberOfFloors", productDetailsint.numberOfFloors);
    }
    if (productDetailsint.numberOfRooms) {
      formData.append("numberOfRooms", productDetailsint.numberOfRooms);
    }
    if (productDetailsint.itemDescription) {
      formData.append("description", productDetailsint.itemDescription);
    }
    formData.append("images", productDetailsint.fileOne);
    formData.append("images", productDetailsint.fileTwo);
    formData.append("images", productDetailsint.fileThree);
    if (productDetailsint.fileFour) {
      formData.append("images", productDetailsint.fileFour);
    }
    if (productDetailsint.fileFive) {
      formData.append("images", productDetailsint.fileFive);
    }

    runSaveAuctionAsDraft(
      authAxios
        .post(api.app.auctions.draft, formData)
        .then((res) => {
          toast.success("your Auction Save As Drafted success");
          history.push(routes.createAuction.default);
          dispatch(productDetails({}));
        })
        .catch((err) => {})
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
      <div className=" h-14 my-7 py-4 ">
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
              itemDescription: productDetailsint.itemDescription || "",
            }}
            onSubmit={handelProductDetailsdata}
            validationSchema={ProductDetailsSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
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
                  <div className="col-span-2 hidden md:block">
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
                    <div className="w-full">
                      <FormikMultiDropdown
                        name={e?.key}
                        label={`${lang === "en" ? e?.labelEn : e?.labelAr}`}
                        placeholder={`${
                          lang === "en" ? e?.labelEn : e?.labelAr
                        }`}
                        options={
                          e?.key === "brandId"
                            ? AllBranOptions
                            : allCustomFileOptions[e?.key]
                        }
                        loading={loadingAllBranOptions}
                      />
                    </div>
                  ))}
                  <div
                    className={
                      customFromData?.model?.key ? "w-full mt-1.5" : "hidden"
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
                    <div className="w-full mt-1.5">
                      <FormikInput
                        required
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

                <div>
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

                <div className="flex gap-x-4 sm:justify-end justify-center">
                  <div className="mt-auto w-full sm:w-auto ">
                    <div
                      onClick={() => SaveAuctionAsDraft()}
                      className="bg-white border-primary-dark border-[1px] text-primary rounded-lg sm:w-[136px] w-full h-[48px] pt-3.5 text-center cursor-pointer"
                    >
                      Save As Draft
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary-dark sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN">
                    next
                  </Button>
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
