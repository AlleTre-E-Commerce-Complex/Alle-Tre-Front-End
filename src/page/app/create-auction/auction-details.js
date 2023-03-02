import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Radio } from "semantic-ui-react";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Stepper from "../../../components/shared/stepper/stepper-app";
import routes from "../../../routes";
import "../../../../src/assets/style/radio-toggle.css";
import { CheckboxRadioAuctionDetails } from "../../../components/create-auction-components/check-box-radio-group";
import { Formik } from "formik";
import FormikMultiDropdown from "../../../components/shared/formik/formik-dropdown";
import { hoursOptions } from "../../../utils/hours-options";
import { daysOptions } from "../../../utils/days-options";

const AuctionDetails = () => {
  const history = useHistory();

  const [valueRadio, setRadioValue] = useState("Quick Auction");
  const [IsSchedule, setIsSchedule] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

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
              itemName: "",
              category: "",
              subCategory: "",
            }}
            // onSubmit={handelProductDetailsdata}
            // validationSchema={ProductDetailsSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="w-[299px] mt-10">
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
                        name={"Auction Duration"}
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
