import { useState } from "react";

import * as Yup from "yup";
import { Form, Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";
import FormikMultiDropdown from "../shared/formik/formik-dropdown";
import { useDispatch } from "react-redux";

import { Button, Modal } from "semantic-ui-react";

import useGetAllCities from "../../hooks/use-get-all-cities";
import useGetAllCountries from "../../hooks/use-get-all-countries";

import { authAxios } from "../../config/axios-config";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import { toast } from "react-hot-toast";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { hasCompletedProfile } from "../../redux-store/login-date-slice";

const AddLocationModel = ({ open, setOpen, TextButton, onReload }) => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const [countriesId, setCountriesId] = useState();
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();
  const { AllCitiesOptions, loadingCitiesOptions } =
    useGetAllCities(countriesId);

  const dispatch = useDispatch();

  const AddLocationSchema = Yup.object({
    countryId: Yup.string().required(
      selectedContent[localizationKeys.required]
    ),
    cityId: Yup.string().required(selectedContent[localizationKeys.required]),
    address: Yup.string().required(selectedContent[localizationKeys.required]),
    addressLabel: Yup.string().required(
      selectedContent[localizationKeys.required]
    ),
    zipCode: Yup.string()
      .trim()
      .required(selectedContent[localizationKeys.required]),
  });
  const { run, isLoading } = useAxios();

  const handleAddLocation = (values) => {
    run(authAxios.post(api.app.location.post, values))
      .then(({ data }) => {
        if (TextButton === selectedContent[localizationKeys.proceed]) {
          history.push(routes.app.createAuction.productDetails);
          toast.success(selectedContent[localizationKeys.successAddLocatons]);
          dispatch(hasCompletedProfile(true));
          window.localStorage.setItem("hasCompletedProfile", true);
        } else {
          window.localStorage.setItem("hasCompletedProfile", true);
          dispatch(hasCompletedProfile(true));
          setOpen(false);
          onReload();
        }
      })
      .catch((err) => {
        toast.error(err?.message?.map((e) => e));
      });
  };

  return (
    <Modal
      className="sm:w-[471px] w-full h-auto bg-transparent scale-in "
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <div className="sm:w-[471px] w-full  h-auto border-2 border-primary rounded-2xl bg-background p-6">
        <div className="ltr:text-left rtl:text-right">
          <h1 className="text-base font-bold">
            {selectedContent[localizationKeys.locationIsRequired]}{" "}
            <span className="text-red-500">*</span>
          </h1>
          <p className="text-gray-med text-xs font-normal pt-1 pb-2 ">
            {
              selectedContent[
                localizationKeys.inOrderToFinishTheProcedureWeHaveToGetAccessTo
              ]
            }
            <br></br>
            {
              selectedContent[
                localizationKeys.yourLocationYouCanManageThemLater
              ]
            }
            <span>
              <HashLink
                smooth
                to={`${routes.app.profile.profileSettings}#AddressBook`}
                className="text-primary underline cursor-pointer "
              >
                {selectedContent[localizationKeys.manageYouAddresses]}
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
                    label={selectedContent[localizationKeys.country]}
                    placeholder={
                      selectedContent[localizationKeys.selectCountry]
                    }
                    options={AllCountriesOptions}
                    loading={loadingAllCountries}
                    onChange={(e) => setCountriesId(e)}
                  />
                </div>
                <div className="w-full py-6">
                  <FormikMultiDropdown
                    name="cityId"
                    label={selectedContent[localizationKeys.city]}
                    placeholder={selectedContent[localizationKeys.city]}
                    options={AllCitiesOptions}
                    loading={loadingCitiesOptions}
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="address"
                    type="text"
                    label={selectedContent[localizationKeys.address]}
                    placeholder={
                      selectedContent[localizationKeys.wirteYourAddress]
                    }
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="addressLabel"
                    type="text"
                    label={selectedContent[localizationKeys.addressLabel]}
                    placeholder={selectedContent[localizationKeys.exHome]}
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="zipCode"
                    type="text"
                    label={selectedContent[localizationKeys.zipCode]}
                    placeholder={
                      selectedContent[localizationKeys.enterPostalZipCode]
                    }
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
