import { useState } from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import { Formik } from "formik";
import useAxios from "../../hooks/use-axios";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import { toast } from "react-hot-toast";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { PiWarningCircle } from "react-icons/pi";

const EditPhoneNumberModel = ({ onReload,oldPhoneNumber,isOpen,setShowMobileNumber }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const [open, setOpen] = useState(false);
  const isArabic = lang === "ar";
  const { run, isLoading } = useAxios([]);
  // Track the old phone number to reset it when country changes
  const [initialPhoneNumber, setInitialPhoneNumber] = useState(
    oldPhoneNumber || ""
  );

  const handleSave = (values) => {
    const formData = new FormData();
    formData.append("phone", values.phoneNumber);
    run(
      authAxios
        .put(api.app.profile.editPersonalInfo, formData)
        .then((res) => {
          toast.success(
            selectedContent[
              localizationKeys.thePhoneNumberHasBeenEditSuccessfully
            ]
          );
          localStorage.setItem('userPhone', values.phoneNumber)
          setOpen(false);
          onReload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message?.[lang] ||
              err?.response?.data?.message?.[0] ||
              selectedContent[localizationKeys.oops]
          );
        })
    );
  };
  return (
    <Modal
      className="sm:w-[368px] w-full h-auto bg-transparent scale-in shadow-none"
      onClose={() => {
        setOpen(false);
        if(setShowMobileNumber){
        setShowMobileNumber(false)
        }
      }}
      onOpen={() => setOpen(true)}
      open={open || isOpen}
      trigger={
        <Button className="bg-secondary-veryLight text-secondary opacity-100 w-[73px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2 ltr:font-serifEN rtl:font-serifAR">
          {oldPhoneNumber
            ? selectedContent[localizationKeys.edit]
            : selectedContent[localizationKeys.add]}
        </Button>
      }
    >
      <div className="sm:w-[368px] w-full h-auto border-2 border-primary rounded-2xl bg-background px-8">
        <h1 className="text-start text-gray-dark font-semibold text-base pt-10">
          {selectedContent[localizationKeys.editPhoneNumber]}
        </h1>
        <Formik
          initialValues={{
            phoneNumber: initialPhoneNumber || "",
          }}
          onSubmit={handleSave}
          enableReinitialize
        >
          {({
            values,
            setFieldValue,
            errors,
            touched,
            handleSubmit,
            handleBlur,
          }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <div className="w-full">
                  <div className="mt-10 mx-auto">
                    <div
                      className="float-container"
                      lang={lang}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <label
                        htmlFor="phone"
                        className="label_Input_Form phone-label"
                        style={{
                          [isArabic ? "right" : "left"]: 58,
                          textAlign: isArabic ? "right" : "left",
                        }}
                      >
                        {selectedContent[localizationKeys.phone]}
                      </label>

                      {/* Phone Input Field */}
                      <PhoneInput
                        id="phone"
                        name="phoneNumber"
                        international
                        defaultCountry="AE"
                        value={values.phoneNumber || ""}
                        onChange={(value) =>
                          setFieldValue("phoneNumber", value)
                        }
                        onBlur={handleBlur}
                        className={`input_Input_Form phone_Input_Form ${
                          isArabic ? "rtl" : "ltr"
                        }`}
                        placeholder={
                          selectedContent[localizationKeys.phoneNumber]
                        }
                        style={{
                          border: "none",
                          boxShadow: "none",
                          outline: "none",
                          flex: 1,
                          paddingLeft: isArabic ? "10px" : "50px",
                          paddingRight: isArabic ? "50px" : "10px",
                        }}
                      />

                      {/* Error Message */}
                      {touched.phoneNumber && errors.phoneNumber && (
                        <div
                          className="text-red-700 text-md mt-1 absolute flex items-center"
                          style={{
                            position: "absolute",
                            top: "100%",
                            [isArabic ? "right" : "left"]: 8,
                          }}
                        >
                          <PiWarningCircle className="mr-2" />
                          {errors.phoneNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-x-4 my-8">
                  <button
                    type="button"
                    className="border-primary border-[1px] text-primary w-[136px] h-[48px] rounded-lg"
                    onClick={() => {
                      setOpen(false);
                      if(setShowMobileNumber){
                        setShowMobileNumber(false)
                        }
                    }}
                  >
                    {selectedContent[localizationKeys.cancel]}
                  </button>
                  <Button
                    loading={isLoading}
                    className="bg-primary hover:bg-primary-dark opacity-100 text-base font-normal ltr:font-serifEN rtl:font-serifAR text-white w-[136px] h-[48px] rounded-lg"
                  >
                    {selectedContent[localizationKeys.save]}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default EditPhoneNumberModel;
