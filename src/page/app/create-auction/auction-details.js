import React, { useEffect, useState } from "react";

import { Form, Radio } from "semantic-ui-react";
import Stepper from "../../../component/shared/stepper/stepper-app";
import { CreateAuctionBreadcrumb } from "../../../component/shared/bread-crumb/Breadcrumb";

import { useHistory } from "react-router-dom";
import routes from "../../../routes";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikDate from "../../../component/shared/formik/formik-date";
import FormikInput from "../../../component/shared/formik/formik-input";
import FormikTimePicker from "../../../component/shared/formik/formik-time-picker";
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
} from "../../../redux-store/auction-details-slice";

import "../../../../src/assets/style/radio-toggle.css";
import { ScrollToFieldError } from "../../../component/shared/formik/formik-scroll-to-field-error";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

import "../../../assets/style/radio-toggle.css";

const AuctionDetails = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();

  const auctionDetailsInt = useSelector(
    (state) => state.auctionDetails.auctionDetails
  );

  const [valueRadio, setRadioValue] = useState(
    auctionDetailsInt.valueRadio || "Quick Auction"
  );
  const [IsSchedule, setIsSchedule] = useState(auctionDetailsInt.IsSchedule);
  const [IsBuyNow, setIsBuyNow] = useState(auctionDetailsInt.IsBuyNow);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

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
    MinimumPrice: Yup.number().required(
      selectedContent[localizationKeys.required]
    ),
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
    dispatch(
      auctionDetails({
        ...values,
        valueRadio: valueRadio,
        IsSchedule: IsSchedule,
        IsBuyNow: IsBuyNow,
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
                        <h1 className="font-bold text-base text-black mb-1 ltr:mr-16 rtl:ml-16">
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
                            ? "mt-9 flex sm:flex-row flex-col justify-between gap-x-4 gap-y-10 sm:gap-y-0 "
                            : "hidden"
                        }
                      >
                        <div className="w-full">
                          <FormikDate
                            name="date"
                            label={selectedContent[localizationKeys.startDate]}
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                        <div className="w-full">
                          <FormikTimePicker
                            name="from"
                            label={selectedContent[localizationKeys.time]}
                            placeholder="HH:MM"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h1 className="font-bold text-base text-black py-6">
                        {selectedContent[localizationKeys.pricing]}
                      </h1>
                      <div className="pt-6">
                        <FormikInput
                          type="number"
                          name="MinimumPrice"
                          label={selectedContent[localizationKeys.minimumPrice]}
                          placeholder="AEDXXX"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex mt-7">
                        <h1 className="font-bold text-base text-black mb-1 ltr:mr-16 rtl:ml-16">
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
                            localizationKeys
                              .unlessStartTimeAndDateAreChosenYourListingBecomesActiveImmediately
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
                            type="number"
                            name="PurchasingPrice"
                            label={
                              selectedContent[localizationKeys.purchasingPrice]
                            }
                            placeholder="AEDXXX"
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
