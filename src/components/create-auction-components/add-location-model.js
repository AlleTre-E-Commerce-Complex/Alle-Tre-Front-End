import { Form, Formik } from "formik";
import { useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import useGetAllCities from "../../hooks/use-get-all-cities";
import useGetAllCountries from "../../hooks/use-get-all-countries";
import FormikMultiDropdown from "../shared/formik/formik-dropdown";
import FormikInput from "../shared/formik/formik-input";
import * as Yup from "yup";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import routes from "../../routes";
import { Link, useHistory } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { toast } from "react-hot-toast";

const AddLocationModel = ({ open, setOpen, TextButton, onReload }) => {
  const history = useHistory();
  const [countriesId, setCountriesId] = useState();
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();
  const { AllCitiesOptions, loadingCitiesOptions } =
    useGetAllCities(countriesId);

  const AddLocationSchema = Yup.object({
    countryId: Yup.string().required("required"),
    cityId: Yup.string().required("required"),
    address: Yup.string().required("required"),
    addressLabel: Yup.string().required("required"),
    zipCode: Yup.string().trim().required("required"),
  });
  const { run, isLoading } = useAxios();

  const handleAddLocation = (values) => {
    run(authAxios.post(api.app.location.post, values))
      .then(({ data }) => {
        if (TextButton === "Proceed") {
          history.push(routes.createAuction.productDetails);
          toast.success("locaton add success");
          window.localStorage.setItem("hasCompletedProfile", true);
        } else {
          setOpen(false);
          onReload();
        }
      })
      .catch((err) => {
        toast.error(err?.message.map((e) => e));
      });
  };

  return (
    <Modal
      className="sm:w-[471px] w-full h-auto bg-transparent scale-in "
      onClose={() => setOpen(false)}
      open={open}
    >
      <div className="sm:w-[471px] w-full  h-auto border-2 border-primary rounded-2xl bg-background p-6">
        <div>
          <h1 className="text-base font-bold">
            Location is required <span className="text-red-500">*</span>
          </h1>
          <p className="text-gray-med text-xs font-normal pt-1 pb-2 ">
            In order to finish the procedure, we have to get access to<br></br>{" "}
            your location. you can manage them later .
            <span>
              <HashLink
                smooth
                to={`${routes.profile.profileSettings}#AddressBook`}
                className="text-primary underline cursor-pointer "
              >
                Manage you addresses
              </HashLink>
            </span>
          </p>
        </div>
        <div>
          <Formik
            initialValues={{
              countryId: "",
              cityId: "",
              address: "",
              addressLabel: "",
              zipCode: "",
            }}
            onSubmit={handleAddLocation}
            validationSchema={AddLocationSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="w-full py-6">
                  <FormikMultiDropdown
                    name="countryId"
                    label={"Country"}
                    placeholder="Select Country"
                    options={AllCountriesOptions}
                    loading={loadingAllCountries}
                    onChange={(e) => setCountriesId(e)}
                  />
                </div>
                <div className="w-full py-6">
                  <FormikMultiDropdown
                    name="cityId"
                    label={"City"}
                    placeholder="Select City"
                    options={AllCitiesOptions}
                    loading={loadingCitiesOptions}
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="address"
                    type="text"
                    label="Address"
                    placeholder="wirte your address"
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="addressLabel"
                    type="text"
                    label="Address label"
                    placeholder="ex: Home"
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="zipCode"
                    type="text"
                    label="Postal code"
                    placeholder="Enter postal/Zip code"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    loading={isLoading}
                    className="bg-primary w-[163px] h-[48px] rounded-lg text-white  mb-2 font-normal text-base rtl:font-serifAR ltr:font-serifEN opacity-100"
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
