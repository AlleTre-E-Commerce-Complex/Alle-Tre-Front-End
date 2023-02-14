import React from "react";

import routes from "../../routes";
import { useHistory } from "react-router-dom";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";

import { Button, Form } from "semantic-ui-react";
import { toast } from "react-hot-toast";

const ForgetPassword = () => {
  const history = useHistory();

  const resetPassword = (values) => {
    // const body = {
    //   email: values.phoneNumber,
    //   password: values.password,
    // };
  };

  const logInSchema = Yup.object({
    password: Yup.string().min(8).max(20, "").required("Required field"),
    confarmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], `not match`)
      .required("Required field"),
  });

  return (
    <div className="flex mt-8 gap-x-3 animate-in z-50">
      <div>
        <div className="">
          <Formik
            initialValues={{
              password: "",
              confarmpassword: "",
            }}
            onSubmit={resetPassword}
            validationSchema={logInSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="mt-10 mx-auto">
                  <FormikInput
                    name="password"
                    type={"password"}
                    label={"New Password"}
                    placeholder={"New Password"}
                  />
                </div>
                <div className="mt-12">
                  <FormikInput
                    name="confarmpassword"
                    type={"password"}
                    label={"Re-Enter Password"}
                    placeholder={"Re-Enter Password"}
                  />
                </div>
                <div className="flex justify-between mt-5 mx-1">
                  <div>
                    <label className="text-gray-med text-sm font-normal cursor-pointer">
                      <input
                        id="authcheckbox"
                        className="mt-1 mr-3 bg-primary"
                        type="checkbox"
                      />
                      Remember Password
                    </label>
                  </div>
                  <button className="underline text-primary-dark text-sm font-normal pt-1">
                    Forget Password
                  </button>
                </div>
                <div className="flex justify-center ">
                  <Button
                    onClick={() => {
                      // history.push(routes.dashboard.app);
                    }}
                    className="bg-primary w-80 h-12 rounded-lg text-white mt-5 font-normal text-base "
                  >
                    Reset Password
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
