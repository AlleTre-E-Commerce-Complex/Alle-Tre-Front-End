import React, { useEffect, useState } from "react";

import { Form, Radio } from "semantic-ui-react";
import Stepper from "../../../component/shared/stepper/stepper-app";
import { CreateAuctionBreadcrumb } from "../../../component/shared/bread-crumb/Breadcrumb";

import { useHistory } from "react-router-dom";
import routes from "../../../routes";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikInput from "../../../component/shared/formik/formik-input";
import FormikMultiDropdown from "../../../component/shared/formik/formik-dropdown";
import { CheckboxRadioAuctionDetails } from "../../../component/create-auction-components/check-box-radio-group";

import { hoursOptions } from "../../../utils/hours-options";
import { daysOptions } from "../../../utils/days-options";

import { useDispatch, useSelector } from "react-redux";
import {
  duration,
  type,
  auctionDetails,
  isBuyNow,
  // deliveryPolicy,
  returnPolicy,
  warrantyPolicy,
  OfferPrice,
} from "../../../redux-store/auction-details-slice";

import "../../../../src/assets/style/radio-toggle.css";
import { ScrollToFieldError } from "../../../component/shared/formik/formik-scroll-to-field-error";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

import "../../../assets/style/radio-toggle.css";
import FormikTextArea from "component/shared/formik/formik-text-area";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import api from "api";
import DateTimePicker from "component/shared/dateTimePicker/DateTimePicker";

const AuctionDetails = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const [pofileData, setPofileData] = useState();
  const auctionDetailsInt = useSelector(
    (state) => state.auctionDetails.auctionDetails
  );
  const productDetailsint = useSelector(
    (state) => state.productDetails.productDetails
  );
  const { run: runPofile, isLoading: isLoadingPofile } = useAxios([]);
  useEffect(() => {
    runPofile(
      authAxios.get(api.app.profile.default).then((res) => {
        setPofileData(res?.data?.data);
      })
    );
  }, [runPofile]);

  useEffect(() => {
    if (productDetailsint.category === 4) {
      setBuyNowShow(false);
    }
  },[])

  const [valueRadio, setRadioValue] = useState(
    auctionDetailsInt.valueRadio || "Quick Auction"
  );
  const [IsSchedule, setIsSchedule] = useState(auctionDetailsInt.IsSchedule);
  const [IsBuyNow, setIsBuyNow] = useState(auctionDetailsInt.IsBuyNow);

  const [IsDelivery, setIsDelivery] = useState(false);
  const [IsRetrunPolicy, setIsRetrunPolicy] = useState(false);
  const [IsWaranty, setIsWaranty] = useState(false);
  const [IsOfferPrice, setIsOfferPrice] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isBuyNowShow, setBuyNowShow] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handleDateTimeChange = (date) => {
    setSelectedDateTime(date);
  };
  const AuctionDetailsDataSchema = Yup.object({
    Hrs: Yup.string().when([], {
      is: () => valueRadio === "Quick Auction",
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
    AuctionDuration: Yup.string().when([], {
      is: () => valueRadio === "Long Auction",
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
    date: Yup.string().when([], {
      is: () => IsSchedule,
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
    from: Yup.string().when([], {
      is: () => IsSchedule,
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
    MinimumPrice: Yup.number()
      .min(1, "Price must be at least 1")
      .test(
        "max-start-price",
        (value, context) => {
          const maxPrice = productDetailsint?.maxStartPrice;
          return maxPrice ? `Allowed only below ${maxPrice}` : true;
        },
        (value) => {
          const maxPrice = productDetailsint?.maxStartPrice;
          return maxPrice ? value <= maxPrice : true;
        }
      )
      .required(selectedContent[localizationKeys.required]),
    PurchasingPrice: Yup.number().when([], {
      is: () => IsBuyNow,
      then: Yup.number()
        .required(selectedContent[localizationKeys.required])
        .test({
          message:
            selectedContent[
              localizationKeys
                .purchasingPriceMustBeMoreThanOrEqual30OfMinimumPrice
            ],
          test(value) {
            return (
              value >=
              parseFloat(
                this.parent.MinimumPrice + this.parent.MinimumPrice * 0.3
              )
            );
          },
        }),
      otherwise: Yup.number().notRequired(),
    }),
    numOfDaysOfExpecetdDelivery: Yup.number().when([], {
      is: () => IsDelivery,
      then: Yup.number().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.number().notRequired(),
    }),
    DeliveryFees: Yup.number().when([], {
      is: () => IsDelivery,
      then: Yup.number().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.number().notRequired(),
    }),
    // deliveryPolicyDescription: Yup.string().when([], {
    //   is: () => IsDelivery,
    //   then: Yup.string().required(selectedContent[localizationKeys.required]),
    //   otherwise: Yup.string().notRequired(),
    // }),
    returnPolicyDescription: Yup.string().when([], {
      is: () => IsRetrunPolicy,
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
    warantyPolicyDescription: Yup.string().when([], {
      is: () => IsWaranty,
      then: Yup.string().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.string().notRequired(),
    }),
    offerPrice: Yup.number().when([], {
      is: () => IsOfferPrice,
      then: Yup.number().required(selectedContent[localizationKeys.required]),
      otherwise: Yup.number().notRequired(),
    }),
  });

  const dispatch = useDispatch();

  const handelAuctionDetailsData = (values) => {
    const durationHours = {
      durationUnit: "HOURS",
      durationInHours: values.Hrs,
    };
    const durationDAYS = {
      durationUnit: "DAYS",
      durationInDays: values.AuctionDuration,
    };
    if (valueRadio === "Quick Auction") {
      dispatch(duration(durationHours));
    } else {
      dispatch(duration(durationDAYS));
    }
    const typeONTIME = { type: "ON_TIME" };
    const typeSCHEDULED = {
      type: "SCHEDULED",
      date: values.date,
      from: values.from,
    };
    if (IsSchedule) {
      dispatch(type(typeSCHEDULED));
    } else dispatch(type(typeONTIME));

    const BuyNow = {
      isBuyNowAllowed: "YES",
      acceptedAmount: values.PurchasingPrice,
    };
    if (IsBuyNow) {
      dispatch(isBuyNow(BuyNow));
    } else dispatch(isBuyNow({}));

    // const DeliveryPolicy = {
    //   IsDelivery: IsDelivery,
    //   description: values.deliveryPolicyDescription,
    //   expectedNumOfDays: values.numOfDaysOfExpecetdDelivery,
    //   deliveryFees: values.DeliveryFees,
    // };
    // if (IsDelivery) {
    //   dispatch(deliveryPolicy(DeliveryPolicy));
    // } else {
    //   dispatch(deliveryPolicy({}));
    // }

    const ReturnPolicy = {
      IsRetrunPolicy: IsRetrunPolicy,
      description: values.returnPolicyDescription,
    };
    if (IsRetrunPolicy) {
      dispatch(returnPolicy(ReturnPolicy));
    } else {
      dispatch(returnPolicy({}));
    }

    const WarrantyPolicy = {
      IsWaranty: IsWaranty,
      description: values.warantyPolicyDescription,
    };
    if (IsWaranty) {
      dispatch(warrantyPolicy(WarrantyPolicy));
    } else {
      dispatch(warrantyPolicy({}));
    }
    const offer_Price = {
      IsOfferPrice: IsOfferPrice,
      offerAmount: values.offerPrice,
    };
    if (IsOfferPrice) {
      dispatch(OfferPrice(offer_Price));
    } else {
      dispatch(OfferPrice({}));
    }

    dispatch(
      auctionDetails({
        ...values,
        valueRadio: valueRadio,
        IsSchedule: IsSchedule,
        IsBuyNow: IsBuyNow,
        IsDelivery: IsDelivery,
        IsRetrunPolicy: IsRetrunPolicy,
        IsWaranty: IsWaranty,
        IsOfferPrice: IsOfferPrice,
      })
    );
    history.push(routes.app.createAuction.shippingDetails);
  };

  return (
    <div className="mt-44 animate-in mx-5 ">
      <div className="max-w-[1366px] mx-auto h-14 my-7 py-4 sm:block hidden ">
        <CreateAuctionBreadcrumb />
      </div>
      <div className="flex justify-center">
        <Stepper />
      </div>
      <div className="max-w-[1366px] mx-auto mt-10">
        <h1 className="font-bold text-base sm:text-xl text-gray-800 pb-4">
          {selectedContent[localizationKeys.timing]}
        </h1>
        <div>
          <CheckboxRadioAuctionDetails
            valueRadio={valueRadio}
            setRadioValue={setRadioValue}
          />
          <Formik
            initialValues={{
              Hrs: auctionDetailsInt.Hrs || "",
              AuctionDuration: auctionDetailsInt.AuctionDuration || "",
              date: auctionDetailsInt.date || "",
              from: auctionDetailsInt.from || "",
              MinimumPrice: auctionDetailsInt.MinimumPrice || "",
              PurchasingPrice: auctionDetailsInt.PurchasingPrice || "",
              // numOfDaysOfExpecetdDelivery:
              //   auctionDetailsInt.numOfDaysOfExpecetdDelivery || "",
              // DeliveryFees: auctionDetailsInt.DeliveryFees || "",
              // deliveryPolicyDescription:
              //   auctionDetailsInt.deliveryPolicyDescription || "",
              returnPolicyDescription:
                auctionDetailsInt.returnPolicyDescription || "",
              warantyPolicyDescription:
                auctionDetailsInt.warantyPolicyDescription || "",
            }}
            onSubmit={handelAuctionDetailsData}
            validationSchema={AuctionDetailsDataSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <ScrollToFieldError />
                <div className="grid sm:grid-cols-2 grid-cols-1">
                  <div>
                    <div className="w-[330px] mt-10">
                      {valueRadio === "Quick Auction" ? (
                        <div>
                          <FormikMultiDropdown
                            name={"Hrs"}
                            label={selectedContent[localizationKeys.Hrs]}
                            placeholder="23 hrs"
                            options={hoursOptions}
                          />
                        </div>
                      ) : (
                        <div>
                          <FormikMultiDropdown
                            name={"AuctionDuration"}
                            label={
                              selectedContent[localizationKeys.auctionDuration]
                            }
                            placeholder="7 days"
                            options={daysOptions}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex mt-7">
                        <h1 className="font-bold text-base sm:text-xl text-gray-800 mb-1 ltr:mr-16 rtl:ml-16">
                          {selectedContent[localizationKeys.scheduleBid]}
                          <span className="text-gray-med text-base font-normal mx-2">
                            {selectedContent[localizationKeys.optional]}
                          </span>
                        </h1>
                        <div className="mt-auto">
                          <Radio
                            className="Edit_Radio_Toggle"
                            toggle
                            onChange={() => setIsSchedule((p) => !p)}
                            checked={IsSchedule}
                          />
                        </div>
                      </div>
                      <p className="text-gray-med text-xs font-normal pt-1">
                        {
                          selectedContent[
                            localizationKeys
                              .unlessStartTimeAndDateAreChosenYourListingBecomesActiveImmediately
                          ]
                        }
                      </p>
                      <div
                        className={
                          IsSchedule
                            ? "mt-9 flex sm:flex-row flex-col justify-between gap-x-4 gap-y-10 sm:gap-y-0"
                            : "hidden"
                        }
                      >
                        <DateTimePicker
                          name="dateTime"
                          label={selectedContent[localizationKeys.startDate]}
                          placeholder="DD/MM/YYYY HH:MM"
                          value={selectedDateTime}
                          onChange={(newValue) => {
                            formik.setFieldValue("date", newValue);
                            formik.setFieldValue("from", newValue);
                          }}
                        />
                      </div>
                    </div>
                    <div className="py-2">
                      <h1 className="font-bold text-base sm:text-xl text-gray-800 pb-4">
                        {selectedContent[localizationKeys.pricing]}
                      </h1>
                      <div className="pt-4">
                        <FormikInput
                          min={0}
                          type="number"
                          name="MinimumPrice"
                          label={selectedContent[localizationKeys.startPrice]}
                          placeholder="AED XXX"
                          onWheel={(e) => e.target.blur()} // Prevent scrolling while focused
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                          validate={(value) => {
                            if (value > 5000) {
                              return "allowed only below 5000";
                            }
                            // if (
                            //   value < 5000 &&
                            //   productDetailsint?.category === 4
                            // ) {
                            //   setIsBuyNow(false);
                            // }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className={`flex mt-7`}>
                        <h1 className="font-bold text-base sm:text-xl text-gray-800 mb-1 ltr:mr-16 rtl:ml-16">
                          {selectedContent[localizationKeys.buyNow]}
                          <span className="text-gray-med text-base font-normal mx-2">
                            {selectedContent[localizationKeys.optional]}
                          </span>
                        </h1>
                        <div className="mt-auto">
                          <Radio
                            className="Edit_Radio_Toggle"
                            toggle
                            onChange={() => setIsBuyNow((p) => !p)}
                            checked={IsBuyNow}
                          />
                        </div>
                      </div>
                      <p className="text-gray-med text-xs font-normal pt-1">
                        {
                          selectedContent[
                            localizationKeys.amountThatYouCanSellWithoutAuction
                          ]
                        }
                      </p>
                      <div
                        className={
                          IsBuyNow
                            ? "mt-9 flex justify-between gap-x-4 "
                            : "hidden"
                        }
                      >
                        <div className="w-full">
                          <FormikInput
                            min={1}
                            type="number"
                            name="PurchasingPrice"
                            label={
                              selectedContent[localizationKeys.purchasingPrice]
                            }
                            placeholder="AEDXXX"
                            onWheel={(e) => e.target.blur()} 
                          />
                          <p className="text-gray-dark text-xs font-normal px-2">
                            {
                              selectedContent[
                                localizationKeys.minimum30MoreThanStartingBid
                              ]
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* =============================================== */}
                    <div>
                      {/* <div className="flex mt-7">
                        <h1 className="font-bold text-base text-black mb-1 ltr:mr-16 rtl:ml-16">
                          {selectedContent[localizationKeys.deliveryPolicy]}
                          <span className="text-gray-med text-base font-normal mx-2">
                            {selectedContent[localizationKeys.optional]}
                          </span>
                        </h1>
                        <div className="mt-auto">
                          <Radio
                            className="Edit_Radio_Toggle"
                            toggle
                            onChange={() => setIsDelivery((p) => !p)}
                            checked={IsDelivery}
                          />
                        </div>
                      </div> */}
                      {/* <p className="text-gray-med text-xs font-normal pt-1">
                        {
                          selectedContent[
                            localizationKeys
                              .youCanGiveHereYourDeliveryRelatedPolicy
                          ]
                        }
                        {
                          selectedContent[
                            localizationKeys.includingDeliveryDateAndOthers
                          ]
                        }
                      </p> */}

                      {/* <div
                        className={
                          IsDelivery
                            ? "mt-9 flex flex-col justify-between gap-x-4 "
                            : "hidden"
                        }
                      > */}
                      {/* <div className="w-full my-10">
                          <FormikInput
                            min={0}
                            type="number"
                            name="numOfDaysOfExpecetdDelivery"
                            label={
                              selectedContent[
                                localizationKeys
                                  .howManyDaysWillItTakeForTheDeliveryAfterAuctionExpired
                              ]
                            }
                            placeholder={
                              selectedContent[localizationKeys.NumberOfDays]
                            }
                          />
                        </div>
                        <div className="w-full my-10">
                          <FormikInput
                            min={0}
                            type="number"
                            name="DeliveryFees"
                            label={
                              selectedContent[localizationKeys.DeliveryFees]
                            }
                            placeholder="AEDXXX"
                          />
                        </div> */}
                      {/* <div className="w-full">
                          <FormikTextArea
                            label={
                              selectedContent[
                                localizationKeys.PolicyDescription
                              ]
                            }
                            name={"deliveryPolicyDescription"}
                            placeholder={
                              selectedContent[
                                localizationKeys.PleaseGiveTheDescription
                              ]
                            }
                          />
                        </div> */}
                      {/* </div> */}
                    </div>
                    {/* ================= */}
                    <div>
                      <div className="flex mt-7">
                        <h1 className="font-bold text-base sm:text-xl text-gray-800 mb-1 ltr:mr-16 rtl:ml-16">
                          {selectedContent[localizationKeys.returnPolicy]}
                          <span className="text-gray-med text-base font-normal mx-2">
                            {selectedContent[localizationKeys.optional]}
                          </span>
                        </h1>
                        <div className="mt-auto">
                          <Radio
                            className="Edit_Radio_Toggle"
                            toggle
                            onChange={() => {
                              setIsRetrunPolicy((p) => !p);
                            }}
                            checked={IsRetrunPolicy}
                          />
                        </div>
                      </div>
                      <p className="text-gray-med text-xs font-normal pt-1">
                        {
                          selectedContent[
                            localizationKeys
                              .youCanGiveHereYourReturnRelatedPolicy
                          ]
                        }
                      </p>
                      <div
                        className={
                          IsRetrunPolicy
                            ? "mt-9 flex justify-between gap-x-4 "
                            : "hidden"
                        }
                      >
                        <div className="w-full">
                          <FormikTextArea
                            label={
                              selectedContent[
                                localizationKeys.PolicyDescription
                              ]
                            }
                            name={"returnPolicyDescription"}
                            placeholder={
                              selectedContent[
                                localizationKeys.PleaseGiveTheDescription
                              ]
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* =================== */}
                    <div>
                      <div className="flex mt-7">
                        <h1 className="font-bold text-base sm:text-xl text-gray-800 mb-1 ltr:mr-16 rtl:ml-16">
                          {selectedContent[localizationKeys.warrantyPolicy]}
                          <span className="text-gray-med text-base font-normal mx-2">
                            {selectedContent[localizationKeys.optional]}
                          </span>
                        </h1>
                        <div className="mt-auto">
                          <Radio
                            className="Edit_Radio_Toggle"
                            toggle
                            onChange={() => {
                              setIsWaranty((p) => !p);
                            }}
                            checked={IsWaranty}
                          />
                        </div>
                      </div>
                      <p className="text-gray-med text-xs font-normal pt-1">
                        {
                          selectedContent[
                            localizationKeys
                              .youCanGiveHereYourWarrantyRelatedPolicy
                          ]
                        }
                      </p>
                      <div
                        className={
                          IsWaranty
                            ? "mt-9 flex justify-between gap-x-4 "
                            : "hidden"
                        }
                      >
                        <div className="w-full">
                          <FormikTextArea
                            label={
                              selectedContent[
                                localizationKeys.PolicyDescription
                              ]
                            }
                            name={"warantyPolicyDescription"}
                            placeholder={
                              selectedContent[
                                localizationKeys.PleaseGiveTheDescription
                              ]
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* =================== */}

                    {/* ============================  This is only if the use is admin */}
                    {pofileData?.email === "alletre.auctions@gmail.com" && (
                      <div>
                        <div className="flex mt-7">
                          <h1 className="font-bold text-base text-black mb-1 ltr:mr-16 rtl:ml-16">
                            Offer Product
                          </h1>
                          <div className="mt-auto">
                            <Radio
                              className="Edit_Radio_Toggle"
                              toggle
                              onChange={() => {
                                setIsOfferPrice((p) => !p);
                              }}
                              checked={IsOfferPrice}
                            />
                          </div>
                        </div>

                        <div
                          className={
                            IsOfferPrice
                              ? "mt-9 flex justify-between gap-x-4 "
                              : "hidden"
                          }
                        >
                          <div className="w-full">
                            <FormikInput
                              min={0}
                              type="number"
                              name="offerPrice"
                              label={"Please enter the offer price"}
                              placeholder={"Offer price"}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* ============================ */}
                  </div>
                  {/* buttons */}
                  <div className="mt-auto flex justify-end  mb-6">
                    <button className="bg-primary hover:bg-primary-dark sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN">
                      {selectedContent[localizationKeys.next]}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
