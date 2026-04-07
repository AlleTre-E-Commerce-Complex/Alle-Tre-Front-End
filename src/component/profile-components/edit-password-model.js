import { useState } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";

import api from "../../api";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";

import { toast } from "react-hot-toast";
import { Form, Modal } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { MdClose } from "react-icons/md";

const EditPasswordModel = ({ onReload }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const [open, setOpen] = useState(false);

  const { run, isLoading } = useAxios([]);
  const handleSave = (values) => {
    run(
      authAxios
        .put(api.app.profile.editCredentialsInfo, values)
        .then((res) => {
          toast.success(
            selectedContent[localizationKeys.thePasswordHasBeenEditSuccessfully]
          );
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

  const editPasswordSchema = Yup.object({
    oldPassword: Yup.string()
      .min(8)
      .max(20)
      .trim()
      .required(selectedContent[localizationKeys.required])
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        selectedContent[
          localizationKeys
            .mustOneUppercaseOneLowercaseOneNumberAndOneSpecialCaseCharacter
        ]
      ),
    newPassword: Yup.string()
      .min(8)
      .max(20)
      .trim()
      .required(selectedContent[localizationKeys.required])
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        selectedContent[
          localizationKeys
            .mustOneUppercaseOneLowercaseOneNumberAndOneSpecialCaseCharacter
        ]
      ),
    confarmpassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], `not match`)
      .required(selectedContent[localizationKeys.required]),
  });

  return (
    <Modal
      className="sm:w-[420px] w-[95%] h-auto bg-transparent scale-in shadow-none"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <button className="bg-primary dark:bg-[#2A3A54] text-white dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-primary-dark dark:hover:bg-primary-light px-4 py-1.5 md:px-6 md:py-2 md:min-w-[120px] text-sm md:text-base font-medium rounded-lg transition-all">
          {selectedContent[localizationKeys.changePassword]}
        </button>
      }
    >
      <div className="w-full h-auto border border-gray-100 dark:border-gray-800/60 rounded-3xl bg-white dark:bg-primary-dark shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-800/50">
          <h1 className="text-[#34415C] dark:text-white text-lg font-bold">
            {selectedContent[localizationKeys.editPassword]}
          </h1>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); setOpen(false); }}
           className="text-gray-400 hover:text-gray-600 dark:hover:text-primary-veryLight transition-colors bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl">
            <MdClose size={20} />
          </button>
        </div>
        <div className="p-6">
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confarmpassword: "",
            }}
            onSubmit={handleSave}
            validationSchema={editPasswordSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="w-full space-y-6">
                  <div className="mx-auto">
                    <FormikInput
                      name="oldPassword"
                      type="password"
                      label={selectedContent[localizationKeys.oldPassword]}
                      placeholder={selectedContent[localizationKeys.oldPassword]}
                    />
                  </div>
                  <div className="mx-auto">
                    <FormikInput
                      name="newPassword"
                      type="password"
                      label={selectedContent[localizationKeys.newPassword]}
                      placeholder={selectedContent[localizationKeys.newPassword]}
                    />
                  </div>
                  <div className="mx-auto">
                    <FormikInput
                      name="confarmpassword"
                      type="password"
                      label={selectedContent[localizationKeys.reEnterPassword]}
                      placeholder={
                        selectedContent[localizationKeys.reEnterPassword]
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-center gap-x-4 mt-8">
                  <button
                    type="button"
                    className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-base font-medium py-3.5 rounded-xl transition-all"
                    onClick={() => setOpen(false)}
                  >
                    {selectedContent[localizationKeys.cancel]}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary dark:bg-yellow hover:bg-primary-dark text-white dark:text-primary dark:hover:bg-yellow-dark text-base font-medium py-3.5 rounded-xl flex justify-center items-center"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      selectedContent[localizationKeys.save]
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Modal>
  );
};

export default EditPasswordModel;
