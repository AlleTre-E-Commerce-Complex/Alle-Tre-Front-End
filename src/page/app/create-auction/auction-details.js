import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, Radio } from "semantic-ui-react";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Stepper from "../../../components/shared/stepper/stepper-app";
import routes from "../../../routes";
import "../../../../src/assets/style/radio-toggle.css";
import { CheckboxRadioAuctionDetails } from "../../../components/create-auction-components/check-box-radio-group";
import { Formik } from "formik";
import FormikMultiDropdown from "../../../components/shared/formik/formik-dropdown";
import { hoursOptions } from "../../../utils/hours-options";
import { daysOptions } from "../../../utils/days-options";
import FormikDate from "../../../components/shared/formik/formik-date";
import FormikTimePicker from "../../../components/shared/formik/formik-time-picker";
import FormikInput from "../../../components/shared/formik/formik-input";
import { useSelector } from "react-redux";

const AuctionDetails = () => {
  const history = useHistory();

  const [valueRadio, setRadioValue] = useState("Quick Auction");
  const [IsSchedule, setIsSchedule] = useState(true);
  const [IsBuyNow, setIsBuyNow] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const productDetailsInt = useSelector(
    (state) => state.productDetails.productDetails
  );
  console.log("====================================");
  console.log({ stor: productDetailsInt });
  console.log("====================================");

  return (
    <div className="mt-44 animate-in ">
      <div className="max-w-[1366px] mx-auto h-14 my-7 py-4 ">
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
              Hrs: "",
              AuctionDuration: "",
              date: "",
              dateTwo: "",
              from: "",
            }}
            // onSubmit={handelProductDetailsdata}
            // validationSchema={ProductDetailsSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-2">
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
                            ? "mt-9 flex justify-between gap-x-4 "
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
                    <Button
                      onClick={() => {}}
                      className="bg-primary sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN"
                    >
                      next
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <button
          onClick={() => history.push(routes.createAuction.shippingDetails)}
        >
          go to shippingDetails
        </button>
      </div>
    </div>
  );
};

export default AuctionDetails;
