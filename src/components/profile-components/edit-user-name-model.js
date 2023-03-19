import { useState } from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";

const EditUserNameModel = ({ onReload }) => {
  const [open, setOpen] = useState(false);

  const handleSave = ({ values }) => {
    console.log(values);
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
        <Button className="bg-secondary-veryLight text-secondary opacity-100 w-[73px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2">
          Edit
        </Button>
      }
    >
      <div className="sm:w-[368px] w-full h-auto border-2 border-primary rounded-2xl bg-background px-8">
        <h1 className="text-gray-dark font-semibold text-base pt-10 ">
          Edit User name
        </h1>
        <Formik
          initialValues={{
            name: "",
          }}
          onSubmit={handleSave}
          enableReinitialize
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className=" w-full ">
                <div className="mt-10 mx-auto ">
                  <FormikInput
                    name="name"
                    type="text"
                    label="Name"
                    placeholder="Name"
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

export default EditUserNameModel;
