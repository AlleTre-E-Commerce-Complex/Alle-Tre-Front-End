import React, { useEffect, useState } from "react";

import { Form, Radio } from "semantic-ui-react";
import Stepper from "../../../components/shared/stepper/stepper-app";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";

import { useHistory } from "react-router-dom";
import routes from "../../../routes";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikDate from "../../../components/shared/formik/formik-date";
import FormikInput from "../../../components/shared/formik/formik-input";
import FormikTimePicker from "../../../components/shared/formik/formik-time-picker";
import FormikMultiDropdown from "../../../components/shared/formik/formik-dropdown";
import { CheckboxRadioAuctionDetails } from "../../../components/create-auction-components/check-box-radio-group";

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
import { ScrollToFieldError } from "../../../components/shared/formik/formik-scroll-to-field-error";

const AuctionDetails = () => {
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
      then: Yup.string().required("required"),
      otherwise: Yup.string().notRequired(),
    }),
    AuctionDuration: Yup.string().when([], {
      is: () => valueRadio === "Long Auction",
      then: Yup.string().required("required"),
      otherwise: Yup.string().notRequired(),
    }),
    date: Yup.string().when([], {
      is: () => IsSchedule,
      then: Yup.string().required("required"),
      otherwise: Yup.string().notRequired(),
    }),
    from: Yup.string().when([], {
      is: () => IsSchedule,
      then: Yup.string().required("required"),
      otherwise: Yup.string().notRequired(),
    }),
    MinimumPrice: Yup.string().trim().required("required"),
    PurchasingPrice: Yup.string().when([], {
      is: () => IsBuyNow,
      then: Yup.string().required("required"),
      otherwise: Yup.string().notRequired(),
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
                            label={"Hrs."}
                            placeholder="23 hrs"
                            options={hoursOptions}
                          />
                        </div>
                      ) : (
                        <div>
                          <FormikMultiDropdown
                            name={"AuctionDuration"}
                            label={"Auction Duration"}
                            placeholder="7 days"
                            options={daysOptions}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex mt-7">
                        <h1 className="font-bold text-base text-black mb-1 mr-16">
                          Schedule Bid
                          <span className="text-gray-med text-base font-normal mx-2">
                            (Optional)
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
                        Unless a start time and date are chosen, your listing
                        becomes active immediately.
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
                            label={"Start Date"}
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                        <div className="w-full">
                          <FormikTimePicker
                            name="from"
                            label={"Time"}
                            placeholder="DD/MM/YYYY"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h1 className="font-bold text-base text-black py-6">
                        Pricing
                      </h1>
                      <div className="pt-6">
                        <FormikInput
                          type="number"
                          name="MinimumPrice"
                          label="Minimum Price"
                          placeholder="AEDXXX"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex mt-7">
                        <h1 className="font-bold text-base text-black mb-1 mr-16">
                          Buy Now
                          <span className="text-gray-med text-base font-normal mx-2">
                            (Optional)
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
                        Unless a start time and date are chosen, your listing
                        becomes active immediately.
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
                            label="Purchasing Price"
                            placeholder="AEDXXX"
                          />
                          <p className="text-gray-dark text-xs font-normal px-2">
                            Minimum: 30% more than starting bid
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* buttons */}
                  <div className="mt-auto flex justify-end  mb-6">
                    <button className="bg-primary hover:bg-primary-dark sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN">
                      Next
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
