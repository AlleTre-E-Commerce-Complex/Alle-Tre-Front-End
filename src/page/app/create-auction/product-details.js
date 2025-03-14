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
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";
import { IoCameraOutline } from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import ImageMedia from "component/create-auction-components/ImageMedia";

const ProductDetails = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { state } = useLocation();
  const [auctionState, setAuctionState] = useState();

  const [completeDraftVal, setCompleteDraftValue] = useState();
  const [listedProductVal, setListedProductVal] = useState();
  const [loadingImg, setLoadingImg] = useState();
  const [forceReload, setForceReload] = useState(false);
  const [auctionId, setAuctionId] = useState(state?.auctionId || null);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const formikRef = useRef(null);
  const productDetailsint = useSelector(
    (state) => state.productDetails.productDetails
  );

  const dispatch = useDispatch();

  const history = useHistory();

  const { run: runAuctionById, isLoading: isLoadingAuctionById } = useAxios([]);
  const { run: runFetchListedProduct, isLoading: isLoadingFetchListedProduct } =
    useAxios([]);

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
        })
      );
    }
  }, [runAuctionById, forceReload, state?.auctionId, productDetailsint?.id]);

  //Fetching Listed Product to convert into auction
  useEffect(() => {
    const id = state?.productId;
    if (id) {
      runAuctionById(
        authAxios.get(api.app.productListing.listedProduct(state?.productId)).then((res) => {
          const listedProduct = res?.data?.data;
          console.log('listed product into auction: ',res?.data )
          setListedProductVal(res?.data?.data?.product)
          SetProductFunction(listedProduct?.product)
          setAuctionState('LISTED_PRODUCT');
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
      setFileOne(images[0] || null);
      setFileTwo(images[1] || null);
      setFileThree(images[2] || null);
      setFileFour(images[3] || null);
      setFileFive(images[4] || null);
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
      const images = completeDraftVal.product.images;
      setimgtest(images); // Update imgtest with the fetched images
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

  const handleReorderImages = (reorderedImages, reorderedFiles) => {
    setFileOne(reorderedFiles[0] || null);
    setFileTwo(reorderedFiles[1] || null);
    setFileThree(reorderedFiles[2] || null);
    setFileFour(reorderedFiles[3] || null);
    setFileFive(reorderedFiles[4] || null);

    setimgtest(reorderedImages);
  };

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
    const files = [fileOne, fileTwo, fileThree, fileFour, fileFive];
    const filesCount = files.filter(
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
      if (hasUsageCondition) {
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
        valueRadio,
        fileOne,
        fileTwo,
        fileThree,
        fileFour,
        fileFive,
        auctionState,
        auctionId: completeDraftVal?.id,
        productId: state?.productId,
      })
    );

    // Navigate to the next page
    history.push(routes.app.createAuction.auctionDetails, {
      fileOne,
      fileTwo,
      fileThree,
      fileFour,
      fileFive,
    });
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
      formData.append("cityId", draftValue.cityId || productDetailsint.cityId);
    }

    // Append files correctly
    if (fileOne) {
      formData.append("images", fileOne);
    }
    if (fileTwo) {
      formData.append("images", fileTwo);
    }
    if (fileThree) {
      formData.append("images", fileThree);
    }
    if (fileFour) {
      formData.append("images", fileFour);
    }
    if (fileFive) {
      formData.append("images", fileFive);
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
              selectedContent[
                localizationKeys.yourAuctionSuccessfullySavedAsDraft
              ]
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
              selectedContent[
                localizationKeys.yourAuctionSuccessfullySavedAsDraft
              ]
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

  const handleCameraChange = (event) => {
    const file = event.target.files[0];
    if (file) {
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
        active={
          isLoading ||
          loadingSubGatogry ||
          isLoadingCSaveAuctionAsDraft ||
          isLoadingAuctionById ||
          loadingAllBranOptions
        }
        inverted
      >
        <LodingTestAllatre />
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
                      {/* {auctionState === "DRAFTED" ||
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
                        isEditMode={
                          auctionState === "DRAFTED" ||
                          productDetailsint?.auctionState === "DRAFTED"
                        }
                        onReorderImages={handleReorderImages}
                        setimgtest={setimgtest}
                      />
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
