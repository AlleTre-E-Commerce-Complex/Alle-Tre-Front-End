import React, { useState, useEffect } from "react";

import { useHistory, useLocation } from "react-router-dom";
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
import EditImgeMedia from "../../../components/create-auction-components/edit-imge-media";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";

const ProductDetails = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { state } = useLocation();

  const [auctionState, setAuctionState] = useState();
  const [completeDraftVal, setCompleteDraftValue] = useState();
  const [loadingImg, setLoadingImg] = useState();
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const productDetailsint = useSelector(
    (state) => state.productDetails.productDetails
  );

  const dispatch = useDispatch();

  const history = useHistory();

  const { run: runAuctionById, isLoading: isLoadingAuctionById } = useAxios([]);
  useEffect(() => {
    const id = productDetailsint?.auctionId || state?.auctionId;
    if (id)
      runAuctionById(
        authAxios.get(api.app.auctions.getAuctionsDetails(id)).then((res) => {
          const completeDraftValue = res?.data?.data;
          setAuctionState(res?.data?.data?.status);
          setimgtest(completeDraftValue?.product?.images);
          setCompleteDraftValue(res?.data?.data);
          dispatch(
            productDetails({
              itemName: completeDraftValue?.product?.title,
              category: completeDraftValue?.product.categoryId,
              subCategory: completeDraftValue?.product?.subCategoryId,
              operatingSystem: completeDraftValue?.product?.operatingSystem,
              releaseYear: completeDraftValue?.product?.releaseYear,
              regionOfManufacture:
                completeDraftValue?.product?.regionOfManufacture,
              ramSize: completeDraftValue?.product?.ramSize,
              processor: completeDraftValue?.product?.processor,
              screenSize: completeDraftValue?.product?.screenSize,
              model: completeDraftValue?.product?.model,
              color: completeDraftValue?.product?.color,
              brandId: completeDraftValue?.product?.brandId,
              cameraType: completeDraftValue?.product?.cameraType,
              material: completeDraftValue?.product?.material,
              age: completeDraftValue?.product?.age,
              totalArea: completeDraftValue?.product?.totalArea,
              numberOfRooms: completeDraftValue?.product?.numberOfRooms,
              numberOfFloors: completeDraftValue?.product?.numberOfFloors,
              landType: completeDraftValue?.product?.landType,
              carType: completeDraftValue?.product?.carType,
              cityId: completeDraftValue?.product?.cityId,
              countryId: completeDraftValue?.product?.countryId,
              itemDescription: completeDraftValue?.product?.description,
              hasUsageCondition:
                completeDraftValue?.product?.category?.hasUsageCondition,
              valueRadio: completeDraftValue?.product?.usageStatus,
            })
          );
          setRadioValue(completeDraftValue?.product?.usageStatus);
        })
      );
  }, [runAuctionById, state?.auctionId, forceReload, productDetailsint?.id]);

  const [draftValue, setDraftValue] = useState();
  const [imgtest, setimgtest] = useState();
  const [fileOne, setFileOne] = useState(productDetailsint.fileOne || null);
  const [fileTwo, setFileTwo] = useState(productDetailsint.fileTwo || null);
  const [fileThree, setFileThree] = useState(
    productDetailsint.fileThree || null
  );
  const [fileFour, setFileFour] = useState(productDetailsint.fileFour || null);
  const [fileFive, setFileFive] = useState(productDetailsint.fileFive || null);

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

  const { run, isLoading } = useAxios([]);
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
    forceReload,
    loadingImg,
  ]);
  const regularCustomFieldsvalidations =
    customFromData?.regularCustomFields?.reduce((acc, curr) => {
      acc[curr.key] = Yup.string().required(
        selectedContent[localizationKeys.required]
      );
      return acc;
    }, {});
  const arrayCustomFieldsvalidations =
    customFromData?.arrayCustomFields?.reduce((acc, curr) => {
      acc[curr.key] = Yup.string().required(
        selectedContent[localizationKeys.required]
      );
      return acc;
    }, {});

  const model = customFromData?.model?.key;
  const ProductDetailsSchema = Yup.object({
    itemName: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
    category: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
    itemDescription: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
    ...regularCustomFieldsvalidations,
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
    }),
  });

  const handelProductDetailsdata = (values) => {
    if (fileThree || (imgtest && imgtest[2])) {
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
            auctionState: auctionState,
            auctionId: completeDraftVal?.id,
          })
        );
        history.push(routes.app.createAuction.auctionDetails);
      } else {
        if (hasUsageCondition) {
          toast.error(
            selectedContent[
              localizationKeys.makeSureThatYouChooseItemConditionValue
            ]
          );
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
            auctionState: auctionState,
            auctionId: completeDraftVal?.id,
          })
        );
        history.push(routes.app.createAuction.auctionDetails);
      }
    } else {
      toast.error(
        selectedContent[
          localizationKeys.makeSureThatYouChooseAtLeastThreeOrMorePhotos
        ]
      );
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
        "brandId",
        draftValue.brandId || productDetailsint.brandId
      );
    }
    // if (hasUsageCondition) {
    if (valueRadio || productDetailsint.valueRadio) {
      formData.append(
        "usageStatus",
        valueRadio || productDetailsint.valueRadio
      );
      // }
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
    if (
      auctionState === "DRAFTED" ||
      productDetailsint?.auctionState === "DRAFTED"
    ) {
      runSaveAuctionAsDraft(
        authAxios
          .put(
            api.app.auctions.completeUpdatedraft(completeDraftVal?.id),
            formData
          )
          .then((res) => {
            toast.success(
              selectedContent[localizationKeys.yourAuctionSaveAsDraftedSuccess]
            );
            history.push(routes.app.createAuction.default);
            dispatch(productDetails({}));
          })
          .catch((err) => {
            toast.error(
              err?.message?.map((e) => e) ||
                selectedContent[localizationKeys.oops]
            );
          })
      );
    } else {
      runSaveAuctionAsDraft(
        authAxios
          .post(api.app.auctions.setAssdraft, formData)
          .then((res) => {
            toast.success(
              selectedContent[localizationKeys.yourAuctionSaveAsDraftedSuccess]
            );
            history.push(routes.app.createAuction.default);
            dispatch(productDetails({}));
          })
          .catch((err) => {
            toast.error(
              selectedContent[localizationKeys.oops] ||
                err?.message?.map((e) => e)
            );
          })
      );
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={
          isLoading ||
          loadingSubGatogry ||
          isLoadingCSaveAuctionAsDraft ||
          isLoadingAuctionById
        }
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
                        loading={loadingGatogry}
                        onChange={(value) => {
                          setCategoryId(value);
                          const fieldOption = GatogryOptions.find(
                            (go) => go.value === value
                          );
                          onReload();
                          setCustomFromData([]);
                          setSubCategoryId(undefined);
                          formik.setFieldValue("subCategory", "");
                          setHasUsageCondition(fieldOption?.hasUsageCondition);
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
                              ? NotAllBranOptions
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
                    <div className="mt-6 w-full">
                      {auctionState === "DRAFTED" ||
                      productDetailsint?.auctionState === "DRAFTED" ? (
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
                      )}
                    </div>
                  </div>
                  <div
                    className={
                      hasUsageCondition ||
                      completeDraftVal?.product?.category?.hasUsageCondition ||
                      productDetailsint?.hasUsageCondition
                        ? "w-full"
                        : "hidden"
                    }
                  >
                    <h1 className="font-bold text-base text-black pt-6">
                      {selectedContent[localizationKeys.itemCondition]}
                    </h1>
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
                      />
                    </div>
                  </div>
                  <div className="flex gap-x-4 sm:justify-end justify-center pb-8">
                    <div className="mt-auto w-full sm:w-auto ">
                      <div
                        onClick={() => SaveAuctionAsDraft()}
                        className="bg-white border-primary-dark border-[1px] text-primary rounded-lg sm:w-[136px] w-full h-[48px] pt-3.5 text-center cursor-pointer"
                      >
                        {selectedContent[localizationKeys.saveAsDraft]}
                      </div>
                    </div>
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

export default ProductDetails;
