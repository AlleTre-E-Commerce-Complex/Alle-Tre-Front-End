import { useState } from "react";

import { Button, Form, Modal } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";

import { Formik } from "formik";
import useAxios from "../../hooks/use-axios";
import FormikInput from "../shared/formik/formik-input";

import api from "../../api";
import { authAxios } from "../../config/axios-config";

import { toast } from "react-hot-toast";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const EditPhoneNumberModel = ({ onReload, oldPhoneNumber }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const [open, setOpen] = useState(false);

  const { run, isLoading } = useAxios([]);
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
      className="sm:w-[368px] w-full h-auto bg-transparent scale-in shadow-none "
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button className="bg-secondary-veryLight text-secondary opacity-100 w-[73px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2 ltr:font-serifEN rtl:font-serifAR ">
          {oldPhoneNumber
            ? selectedContent[localizationKeys.edit]
            : selectedContent[localizationKeys.add]}
        </Button>
      }
    >
      <div className="sm:w-[368px] w-full h-auto border-2 border-primary rounded-2xl bg-background px-8">
        <h1 className="text-start text-gray-dark font-semibold text-base pt-10 ">
          {selectedContent[localizationKeys.editPhoneNumber]}
        </h1>
        <Formik
          initialValues={{
            phoneNumber: oldPhoneNumber || "",
          }}
          onSubmit={handleSave}
          enableReinitialize
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className=" w-full ">
                <div className="mt-10 mx-auto ">
                  <FormikInput
                    name="phoneNumber"
                    type="text"
                    label={selectedContent[localizationKeys.phoneNumber]}
                    placeholder={selectedContent[localizationKeys.phoneNumber]}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-x-4 my-8">
                <button
                  className="border-primary border-[1px] text-primary w-[136px] h-[48px] rounded-lg "
                  onClick={() => {
                    setOpen(false);
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
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default EditPhoneNumberModel;
