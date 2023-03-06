import { Form, Formik } from "formik";
import { Button, Modal } from "semantic-ui-react";
import { hoursOptions } from "../../utils/hours-options";
import FormikMultiDropdown from "../shared/formik/formik-dropdown";
import FormikInput from "../shared/formik/formik-input";

const AddLocationModel = ({ open, setOpen, TextButton }) => {
  return (
    <Modal
      className="w-[471px] h-auto bg-transparent scale-in "
      onClose={() => setOpen(false)}
      open={open}
    >
      <div className="w-[471px] h-auto border-2 border-primary rounded-2xl bg-background p-6">
        <div>
          <h1 className="text-base font-bold">
            Location is required <span className="text-red-500">*</span>
          </h1>
          <p className="text-gray-med text-xs font-normal pt-1 pb-2 ">
            In order to finish the procedure, we have to get access to<br></br>{" "}
            your location. you can manage them later .
            <span className="text-primary underline cursor-pointer ">
              Manage you addresses
            </span>
          </p>
        </div>
        <div>
          <Formik
            initialValues={{
              City: "",
              Country: "",
              Address: "",
            }}
            // onSubmit={handelProductDetailsdata}
            // validationSchema={ProductDetailsSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="w-full py-6">
                  <FormikMultiDropdown
                    name={"City"}
                    label={"City"}
                    placeholder="Select City"
                    options={hoursOptions}
                  />
                </div>
                <div className="w-full py-6">
                  <FormikMultiDropdown
                    name={"Country"}
                    label={"Country"}
                    placeholder="Select Country"
                    options={hoursOptions}
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="Address"
                    type="text"
                    label="Address"
                    placeholder="wirte your address"
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="AddressLabel"
                    type="text"
                    label="Address label"
                    placeholder="ex: Home"
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="Postalcode"
                    type="text"
                    label="Postal code"
                    placeholder="Enter postal/Zip code"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    // loading={isLoading}
                    onClick={() => {
                      // history.push(routes.dashboard.app);
                    }}
                    className="bg-primary w-[163px] h-[48px] rounded-lg text-white  mb-2 font-normal text-base rtl:font-serifAR ltr:font-serifEN"
                  >
                    {TextButton}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Modal>
  );
};

export default AddLocationModel;
