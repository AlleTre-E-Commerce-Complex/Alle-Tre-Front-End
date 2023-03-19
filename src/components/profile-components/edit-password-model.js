import { useState } from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";
import * as Yup from "yup";

const EditPasswordModel = ({ onReload }) => {
  const [open, setOpen] = useState(false);

  const handleSave = ({ values }) => {
    console.log(values);
  };

  const editPasswordSchema = Yup.object({
    oldPassword: Yup.string()
      .min(8)
      .max(20)
      .trim()
      .required("Required field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    newPassword: Yup.string()
      .min(8)
      .max(20)
      .trim()
      .required("Required field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confarmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], `not match`)
      .required("Required field"),
  });

  return (
    <Modal
      className="sm:w-[368px] w-full h-auto bg-transparent scale-in shadow-none "
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button className="bg-secondary-veryLight text-secondary opacity-100 w-[161px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2">
          Change Password
        </Button>
      }
    >
      <div className="sm:w-[368px] w-full h-auto border-2 border-primary rounded-2xl bg-background px-8">
        <h1 className="text-gray-dark font-semibold text-base pt-10 ">
          Edit Password
        </h1>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confarmpassword: "",
          }}
          onSubmit={handleSave}
          validationSchema={editPasswordSchema}
          enableReinitialize
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className=" w-full ">
                <div className="mt-10 mx-auto ">
                  <FormikInput
                    name="oldPassword"
                    type="password"
                    label="Old Password"
                    placeholder="Old Password"
                  />
                </div>
                <div className="mt-10 mx-auto ">
                  <FormikInput
                    name="newPassword"
                    type="password"
                    label="New Password"
                    placeholder="New Password"
                  />
                </div>
                <div className="mt-10 mx-auto ">
                  <FormikInput
                    name="confarmpassword"
                    type="password"
                    label="Re-Enter Password"
                    placeholder="Re-Enter Password"
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <div className="flex justify-center gap-x-4 my-8">
          <button
            className="border-primary border-[1px] text-primary w-[136px] h-[48px] rounded-lg "
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="bg-primary hover:bg-primary-dark text-white w-[136px] h-[48px] rounded-lg"
            onClick={() => handleSave()}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPasswordModel;
