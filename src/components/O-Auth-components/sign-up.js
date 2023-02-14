import React from "react";
import OAuthSections from "./O-Auth-sections";

import routes from "../../routes";
import { useHistory } from "react-router-dom";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";

import { Button, Form } from "semantic-ui-react";
import useAxios from "../../hooks/use-axios";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../context/language-context";
import { axios } from "../../config/axios-config";
import api from "../../api";
import auth from "../../utils/auth";

const SignUp = () => {
  const history = useHistory();
  const [lang] = useLanguage("");

  const { run, isLoading } = useAxios();
  const signUp = (values) => {
    run(axios.post(api.auth.signup, values))
      .then((res) => {
        toast.loading(
          "A verification mail has been sent to your mail please check it...."
        );
      })
      .catch((err) => {
        toast.error(
          lang === "en" ? err.message.en : err.message.en || err.message
        );
      });
  };

  const signUpSchema = Yup.object({
    userName: Yup.string().min(3).max(20, "").required("Required field"),
    email: Yup.string().min(3).required("Required field"),
    phone: Yup.string().min(3).max(20, "").required("Required field"),
    password: Yup.string().min(3).max(20, "").required("Required field"),
  });

  return (
    <div className="flex gap-x-3 animate-in bg-background">
      <div className="mt-5">
        <OAuthSections isLogin={false} />
      </div>
      <div className="mx-5">
        <p className="border-l-[1px] border-gray-dark h-64 my-10 left-1.5 relative">
          <p className="absolute -left-[30px] text-gray-dark rotate-90 top-1/2 bg-white px-6">
            OR
          </p>
        </p>
      </div>
      <div>
        <div className="">
          <Formik
            initialValues={{
              userName: "",
              email: "",
              phone: "",
              password: "",
            }}
            onSubmit={signUp}
            validationSchema={signUpSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="mt-8 w-full mx-auto">
                  <FormikInput
                    name="userName"
                    type={"text"}
                    label={"Name"}
                    placeholder={"Name"}
                  />
                </div>
                <div className="mt-8">
                  <FormikInput
                    name="email"
                    type={"email"}
                    label={"E-mail"}
                    placeholder={"E-mail"}
                  />
                </div>
                <div className="mt-8">
                  <FormikInput
                    name="phone"
                    type={"text"}
                    label={"Phone"}
                    placeholder={"Phone"}
                  />
                </div>
                <div className="mt-8">
                  <FormikInput
                    name="password"
                    type={"password"}
                    label={"Password"}
                    placeholder={"Password"}
                  />
                </div>
                <div className="mt-4 mx-1">
                  <div>
                    <label className="text-gray-med text-sm font-normal cursor-pointer">
                      <input
                        className="mt-1 mr-3 bg-primary authcheckbox "
                        type="checkbox"
                      />
                      Remember Password
                    </label>
                  </div>
                  <div>
                    <label className="text-gray-med text-sm font-normal cursor-pointer ">
                      <input
                        className="mt-1 mr-3 bg-primary authcheckbox"
                        type="checkbox"
                        required
                      />
                      I agree to the Terms & Conditions
                    </label>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    loading={isLoading}
                    onClick={() => {
                      // history.push(routes.dashboard.app);
                    }}
                    className="bg-primary w-80 h-12 rounded-lg text-white mt-5 font-normal text-base "
                  >
                    Create Account
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

export default SignUp;
