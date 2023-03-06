import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Stepper from "../../../components/shared/stepper/stepper-app";
import routes from "../../../routes";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Dimmer, Form, Loader } from "semantic-ui-react";
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

const ProductDetails = () => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];

  const history = useHistory();

  const [valueRadio, setRadioValue] = useState("New");
  const [categoryId, setCategoryId] = useState();
  const [subCategoryId, setSubCategoryId] = useState();

  const [hasUsageCondition, setHasUsageCondition] = useState();

  const [customFromData, setCustomFromData] = useState();

  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry } = useGetSubGatogry(categoryId);

  console.log("====================================");
  console.log(hasUsageCondition);
  console.log(categoryId);
  console.log(subCategoryId);
  console.log("====================================");

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (categoryId || subCategoryId)
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
  }, [SubGatogryOptions.length, categoryId, run, subCategoryId]);

  const ProductDetailsSchema = Yup.object({
    itemName: Yup.string().max(20).trim().required("required"),
    category: Yup.string().max(20).trim().required("required"),
    subCategory: Yup.string().max(20).trim().required("required"),
  });

  const handelProductDetailsdata = (values) => {
    console.log("====================================");
    console.log(values);
    console.log("====================================");
  };
  const stateOptions = [
    { key: "test", text: "test", value: "test" },
    { key: "test", text: "test", value: "test" },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  console.log("====================================");
  console.log(customFromData);
  console.log("====================================");
  return (
    <div className="mt-44 animate-in max-w-[1366px] md:mx-auto mx-5 ">
      {/* <Dimmer className="animate-pulse" active={isLoading} inverted>
        <Loader active />
      </Dimmer> */}
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
              itemName: "",
              category: "",
              subCategory: "",
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
                      />
                    </div>
                  ))}
                  {console.log(customFromData?.model)}
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
                    <AddImgMedia />
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
                    <button className="bg-white border-primary-dark border-[1px] text-primary rounded-lg sm:w-[136px] w-full h-[48px] ">
                      Save As Draft
                    </button>
                  </div>
                  <Button
                    onClick={() => {}}
                    className="bg-primary sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN"
                  >
                    next
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <button onClick={() => history.push(routes.createAuction.auctionDetails)}>
        go to auctionDetails
      </button>
    </div>
  );
};

export default ProductDetails;
