import { useState } from "react";

import { Button, Form, Modal } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";

import { Formik } from "formik";
import useAxios from "../../hooks/use-axios";
import FormikInput from "../shared/formik/formik-input";

import api from "../../api";
import { authAxios } from "../../config/axios-config";

import { toast } from "react-hot-toast";

const EditPhoneNumberModel = ({ onReload, oldPhoneNumber }) => {
  const [lang] = useLanguage();

  const [open, setOpen] = useState(false);

  const { run, isLoading } = useAxios([]);
  const handleSave = (values) => {
    const formData = new FormData();
    formData.append("phone", values.phoneNumber);
    run(
      authAxios
        .put(api.app.profile.editPersonalInfo, formData)
        .then((res) => {
          toast.success("The Phone number has been edit successfully");
          setOpen(false);
          onReload();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message?.[lang] ||
              err?.response?.data?.message?.[0] ||
              "oops, something with wrong please make sure everything is in the right place and try again "
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
        <Button className="bg-secondary-veryLight text-secondary opacity-100 w-[73px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2 ">
          Edit
        </Button>
      }
    >
      <div className="sm:w-[368px] w-full h-auto border-2 border-primary rounded-2xl bg-background px-8">
        <h1 className="text-gray-dark font-semibold text-base pt-10 ">
          Edit Phone Number
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
                    label="Phone Number"
                    placeholder="Phone Number"
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
                  Cancel
                </button>
                <Button
                  loading={isLoading}
                  className="bg-primary hover:bg-primary-dark opacity-100 text-base font-normal ltr:font-serifEN rtl:font-serifAR text-white w-[136px] h-[48px] rounded-lg"
                >
                  Save
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