import { useState } from "react";
import { Form, Modal } from "semantic-ui-react";
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
import { MdClose } from "react-icons/md";

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
      className="sm:w-[420px] w-[95%] h-auto bg-transparent scale-in shadow-none"
      onClose={() => {
        setOpen(false);
        if(setShowMobileNumber){
          setShowMobileNumber(false)
        }
      }}
      onOpen={() => setOpen(true)}
      open={open || isOpen}
      trigger={
        <button className="bg-primary dark:bg-[#2A3A54] text-white dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-primary-dark dark:hover:bg-primary-light px-4 py-1.5 md:px-6 md:py-2 md:min-w-[120px] text-sm md:text-base font-medium rounded-lg transition-all">
          {oldPhoneNumber
            ? selectedContent[localizationKeys.edit]
            : selectedContent[localizationKeys.add]}
        </button>
      }
    >
      <div className="w-full h-auto border border-gray-100 dark:border-gray-800/60 rounded-3xl bg-white dark:bg-primary-dark shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-800/50">
          <h1 className="text-[#34415C] dark:text-white text-lg font-bold">
            {selectedContent[localizationKeys.editPhoneNumber]}
          </h1>
          <button 
            type="button"
            onClick={(e) => { 
              e.preventDefault(); 
              setOpen(false);
              if(setShowMobileNumber) setShowMobileNumber(false);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full"
          >
            <MdClose size={20} />
          </button>
        </div>
        <div className="p-6">
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
                    <div className="mx-auto">
                      <div
                        className="float-container"
                        lang={lang}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          position: "relative"
                        }}
                      >
                        <label
                          htmlFor="phone"
                          className="label_Input_Form phone-label dark:text-gray-400 dark:bg-primary-dark"
                          style={{
                            [isArabic ? "right" : "left"]: 58,
                            textAlign: isArabic ? "right" : "left",
                            zIndex: 10
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
                          } dark:bg-gray-800/50 dark:text-white dark:border-gray-700 w-full`}
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
                            background: "transparent"
                          }}
                        />

                        {/* Error Message */}
                        {touched.phoneNumber && errors.phoneNumber && (
                          <div
                            className="text-red-500 text-xs mt-1 absolute flex items-center bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md"
                            style={{
                              position: "absolute",
                              top: "100%",
                              [isArabic ? "right" : "left"]: 8,
                            }}
                          >
                            <PiWarningCircle className="mr-1" />
                            {errors.phoneNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-x-4 mt-8">
                    <button
                      type="button"
                      className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-base font-medium py-3.5 rounded-xl transition-all"
                      onClick={() => {
                        setOpen(false);
                        if(setShowMobileNumber){
                          setShowMobileNumber(false)
                        }
                      }}
                    >
                      {selectedContent[localizationKeys.cancel]}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#34415C] dark:bg-primary hover:bg-[#2a3449] dark:hover:bg-primary-dark text-white text-base font-medium py-3.5 rounded-xl transition-all shadow-sm flex justify-center items-center"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        selectedContent[localizationKeys.save]
                      )}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Modal>
  );
};

export default EditPhoneNumberModel;
