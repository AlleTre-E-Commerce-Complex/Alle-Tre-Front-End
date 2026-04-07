import { useState } from "react";
import { Form, Modal } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import { Formik } from "formik";
import * as Yup from "yup";
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

const EditPhoneNumberModel = ({ onReload, oldPhoneNumber, isOpen, setShowMobileNumber }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const [open, setOpen] = useState(false);
  const isArabic = lang === "ar";
  const { run, isLoading } = useAxios([]);
  // Track the old phone number to reset it when country changes
  const [initialPhoneNumber, setInitialPhoneNumber] = useState(
    oldPhoneNumber || ""
  );

  const handleCloseModal = () => {
    setOpen(false);
    if (setShowMobileNumber) {
      setShowMobileNumber(false);
    }
  };

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
          handleCloseModal();
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
    <>
      <button 
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary dark:bg-primary text-white dark:text-white border border-transparent dark:border-white/5 hover:bg-primary-dark dark:hover:bg-primary-light px-4 py-1.5 md:px-6 md:py-2 md:min-w-[120px] text-sm md:text-base font-semibold rounded-xl transition-all shadow-sm active:scale-[0.98]"
      >
        {oldPhoneNumber
          ? selectedContent[localizationKeys.edit]
          : selectedContent[localizationKeys.add]}
      </button>

      <Modal
        className="sm:w-[420px] w-[95%] h-auto bg-transparent scale-in shadow-none"
        onClose={handleCloseModal}
        open={Boolean(open || isOpen)}
      >
        <div className="w-full h-auto border border-gray-100 dark:border-white/10 rounded-xl bg-white dark:bg-[#1a2332] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 dark:border-white/5">
            <h1 className="text-primary dark:text-white text-xl font-bold tracking-tight">
              {selectedContent[localizationKeys.editPhoneNumber]}
            </h1>
            <button 
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation();
                handleCloseModal();
              }}
               className="text-gray-400 hover:text-gray-600 dark:hover:text-primary-veryLight transition-colors bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl"
            >
              <MdClose size={22} />
            </button>
          </div>
          
          <div className="p-8">
            <Formik
              initialValues={{
                phoneNumber: initialPhoneNumber || "",
              }}
              onSubmit={handleSave}
              validationSchema={Yup.object().shape({
                phoneNumber: Yup.string()
                  .required(selectedContent[localizationKeys.required])
                  .matches(
                    /^\+?[0-9]{8,15}$/,
                    selectedContent[localizationKeys.invalidPhoneNumber]
                  ),
              })}
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
                  <Form onSubmit={handleSubmit} className="space-y-6">
                    <div className="w-full relative">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-bold text-gray-700 dark:text-gray-400 mb-3"
                      >
                        {selectedContent[localizationKeys.phone]}
                      </label>

                      <div className={`relative flex items-center w-full rounded-xl border-[1.5px] px-3 py-1 bg-gray-50/30 dark:bg-transparent transition-all duration-300 ${
                        touched.phoneNumber && errors.phoneNumber 
                        ? 'border-red/50' 
                        : 'border-[#E5E7EB] dark:border-[#D0A243]/40 focus-within:border-primary dark:focus-within:border-[#D0A243] focus-within:ring-4 focus-within:ring-[#D0A243]/5'
                      }`}>
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
                          className={`w-full ${isArabic ? "rtl" : "ltr"} text-primary dark:text-white font-medium [&_input]:bg-transparent [&_input]:dark:text-white [&_input]:border-none [&_input]:outline-none [&_input]:h-full`}
                          placeholder={selectedContent[localizationKeys.phoneNumber]}
                          style={{
                            border: "none",
                            boxShadow: "none",
                            outline: "none",
                            padding: "10px 6px",
                            fontSize: "16px"
                          }}
                        />
                      </div>

                      {/* Error Message */}
                      {touched.phoneNumber && errors.phoneNumber && (
                        <div className="flex items-center gap-1.5 mt-2 text-red-500 animate-fade-in">
                          <PiWarningCircle size={16} />
                          <span className="text-xs font-semibold">{errors.phoneNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="flex-1 bg-transparent border-[1.5px] border-[#34415C]/20 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCloseModal();
                        }}
                      >
                        {selectedContent[localizationKeys.cancel]}
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-primary dark:bg-yellow hover:bg-primary-dark text-white dark:text-primary dark:hover:bg-yellow-dark font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex justify-center items-center gap-2"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-[#34415C]/30 border-t-[#34415C] rounded-xl animate-spin"></div>
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
    </>
  );


};


export default EditPhoneNumberModel;
