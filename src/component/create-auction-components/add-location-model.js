import React, { useState, useRef, useEffect } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";
import { useDispatch } from "react-redux";
import FormikMultiDropdown from "../shared/formik/formik-dropdown";
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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { PiWarningCircle } from "react-icons/pi";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const AddLocationModel = ({
  open,
  setOpen,
  TextButton,
  onReload,
  isEditing = false,
  editData = null,
  isListing,
  setIsListing,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const [countriesId, setCountriesId] = useState();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { AllCountriesOptions, loadingAllCountries } = useGetAllCountries();
  const { AllCitiesOptions, loadingCitiesOptions } =
    useGetAllCities(countriesId);

  const isArabic = lang === "ar";
  const dispatch = useDispatch();
  const isMounted = useRef(true);

  const AddLocationSchema = Yup.object({
    countryId: Yup.string().required(
      selectedContent[localizationKeys.required]
    ),
    cityId: Yup.string().required(selectedContent[localizationKeys.required]),
    address: Yup.string().required(selectedContent[localizationKeys.required]),
    addressLabel: Yup.string().required(
      selectedContent[localizationKeys.required]
    ),
    phone: Yup.string()
      .required(selectedContent[localizationKeys.required])
      .matches(
        /^[+][0-9]+$/,
        selectedContent[localizationKeys.invalidPhoneNumber]
      ),
  });

  const handleLocationSelect = (lat, lng, setFieldValue) => {
    if (typeof lat === "number" && typeof lng === "number") {
      setSelectedLocation({ lat, lng });
      setFieldValue("lat", lat);
      setFieldValue("lng", lng);

      // Reverse Geocode to get address only
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setFieldValue("address", results[0].formatted_address);
        } else {
          console.error("Geocode failed: ", status);
        }
      });
    }
  };
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_SECRET_KEY,
  });

  const { run, isLoading } = useAxios();

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const initialValues = isEditing
    ? {
        addressLabel: editData.addressLabel || "",
        address: editData.address || "",
        countryId: editData.country || "",
        cityId: editData.city || "",
        phone: editData.phone || "",
        lat: editData.lat || 0.0,
        lng: editData.lng || 0.0,
      }
    : {
        addressLabel: "",
        address: "",
        countryId: "",
        cityId: "",
        phone: "",
        lat: 0.0,
        lng: 0.0,
      };

  const handleSubmit = (values) => {
    if (isEditing) {
      const locationData = {
        addressLabel: values.addressLabel,
        address: values.address,
        countryId: values.countryId,
        cityId: values.cityId,
        phone: values.phone,
        lat: selectedLocation?.lat || values.lat,
        lng: selectedLocation?.lng || values.lng,
      };

      run(
        authAxios.put(api.app.location.edit(editData.addressId), locationData)
      )
        .then((res) => {
          if (isMounted.current) {
            window.localStorage.setItem("hasCompletedProfile", "true");
            toast.success(
              selectedContent[localizationKeys.successUpdateLocation]
            );
            setOpen(false);
            onReload();
          }
        })
        .catch((err) => {
          console.error("Error updating location:", err);
          toast.error(selectedContent[localizationKeys.oops]);
        });
    } else {
      run(authAxios.post(api.app.location.post, values))
        .then((res) => {
          if (isMounted.current) {
            window.localStorage.setItem("hasCompletedProfile", "true");
            if (TextButton === selectedContent[localizationKeys.proceed]) {
              if (isListing) {
                history.push(routes.app.listProduct.default);
              } else {
                history.push(routes.app.createAuction.productDetails);
              }
              toast.success(
                selectedContent[localizationKeys.successAddLocatons]
              );
              setOpen(false);
            } else {
              setOpen(false);
              onReload();
            }
          }
        })
        .catch((err) => {
          const errorMessage = err.message[0] || 
            (lang === "ar" ? err.message.ar : err.message.en) || 
            selectedContent[localizationKeys.oops];
          toast.error(errorMessage);
        });
    }
  };

  return (
    <Modal
      className="sm:w-[471px] w-full h-auto bg-transparent scale-in"
      onClose={() => {
        setOpen(false);
        if (setIsListing) {
          setIsListing(false);
        }
      }}
      open={open}
    >
      <div className="sm:w-[471px] w-full h-auto border-2 border-primary rounded-2xl bg-background p-6">
        <div className="flex justify-between items-center ltr:text-left rtl:text-right">
          <h1 className="text-base font-bold">
            {isEditing
              ? selectedContent[localizationKeys.editLocation]
              : selectedContent[localizationKeys.locationIsRequired]}{" "}
            <span className="text-red-500">*</span>
          </h1>
          <button
            onClick={() => {
              setOpen(false);
              if (setIsListing) {
                setIsListing(false);
              }
            }}
            className={`absolute top-4 ${
              isArabic ? "left-4" : "right-4"
            } w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-primary`}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        <p className="text-gray-med text-xs font-normal pt-1 pb-2">
          {
            selectedContent[
              localizationKeys.inOrderToFinishTheProcedureWeHaveToGetAccessTo
            ]
          }
          <br />
          {selectedContent[localizationKeys.yourLocationYouCanManageThemLater]}
          <span>
            <HashLink
              smooth
              to={`${routes.app.profile.profileSettings}#AddressBook`}
              className="text-primary underline cursor-pointer"
              onClick={() => setOpen(false)}
            >
              {selectedContent[localizationKeys.manageYouAddresses]}
            </HashLink>
          </span>
        </p>

        <div>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={AddLocationSchema}
            enableReinitialize
          >
            {({ values, setFieldValue, errors, touched, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                {/* Form fields go here */}
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

                {/* Other fields */}
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

                {/* Phone input */}
                <div className="float-container" lang={lang}>
                  <label
                    htmlFor="phone"
                    className="label_Input_Form phone-label"
                    style={{
                      [isArabic ? "right" : "left"]: 18,
                      textAlign: isArabic ? "right" : "left",
                    }}
                  >
                    {selectedContent[localizationKeys.phone]}
                  </label>
                  <PhoneInput
                    id="phone"
                    name="phone"
                    international
                    defaultCountry="AE"
                    value={values.phone || ""}
                    onChange={(value) => setFieldValue("phone", value)}
                    className={`input_Input_Form phone_Input_Form ${
                      isArabic ? "rtl" : "ltr"
                    }`}
                    placeholder={selectedContent[localizationKeys.phoneNumber]}
                  />
                  <div
                    className={`${
                      touched.phone && errors.phone ? "visible" : "invisible"
                    } text-red-700 text-md mt-1 absolute flex items-center`}
                    style={{
                      position: "absolute",
                      top: "100%",
                      [isArabic ? "right" : "left"]: 8,
                    }}
                  >
                    <PiWarningCircle className="mr-2" />
                    {errors.phone}
                  </div>
                </div>

                {/* Address label */}
                <div className="w-full py-11">
                  <FormikInput
                    name="addressLabel"
                    type="text"
                    label={selectedContent[localizationKeys.addressLabel]}
                    placeholder={selectedContent[localizationKeys.exHome]}
                  />
                </div>

                {/* Google Map */}
                <div className="w-full py-6">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "200px" }}
                      zoom={10.5}
                      center={selectedLocation || { lat: 25.185, lng: 55.2651 }}
                      options={{
                        streetViewControl: false,
                      }}
                      onClick={(e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();
                        handleLocationSelect(lat, lng, setFieldValue);
                      }}
                    >
                      {selectedLocation && (
                        <Marker position={selectedLocation} />
                      )}
                    </GoogleMap>
                  ) : (
                    <div>Loading map...</div>
                  )}
                </div>

                <FormikInput
                  name="lat"
                  type="hidden"
                  value={values.lat || ""}
                />
                <FormikInput
                  name="lng"
                  type="hidden"
                  value={values.lng || ""}
                />

                <div className="flex justify-end">
                  <Button
                    loading={isLoading}
                    className="bg-primary w-[163px] h-[48px] rounded-lg text-white mb-2 font-normal text-base rtl:font-serifAR ltr:font-serifEN opacity-100"
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
