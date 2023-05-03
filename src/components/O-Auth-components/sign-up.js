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
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const SignUp = ({ currentPAth, isAuthModel }) => {
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const { run, isLoading } = useAxios();
  const signUp = (values) => {
    run(axios.post(api.auth.signup, values))
      .then((res) => {
        toast.loading(
          selectedContent[localizationKeys.aVerificationMailHasBeenSent]
        );
      })
      .catch((err) => {
        toast.error(
          lang === "en"
            ? err.message.en || err.message
            : err.message.ar || err.message
        );
      });
  };

  const signUpSchema = Yup.object({
    userName: Yup.string().min(3).max(20).required("Required field"),
    email: Yup.string().min(3).required("Required field"),
    phone: Yup.string().min(3).max(20).required("Required field"),
    password: Yup.string()
      .min(8)
      .max(20)
      .trim()
      .required("Required field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
  });

  return (
    <div className="flex flex-col md:flex-row  gap-x-3 animate-in bg-transparent rtl:font-serifAR ltr:font-serifEN ">
      <div className="mt-5 mx-auto md:mx-0">
        <OAuthSections isLogin={false} />
      </div>
      <div className="mx-5 ">
        <p className="border-l-[1px] mt-10 border-gray-dark h-64 bg-blue-400 my-2 relative md:block hidden ltr:left-4 rtl:-left-4">
          <p className="absolute -left-[30px] text-gray-dark md:rotate-90 rotate-0 top-1/2 bg-white px-6">
            {selectedContent[localizationKeys.or]}
          </p>
        </p>
      </div>
      <div className="mx-auto ">
        <p className="border-t-[1px] border-gray-dark w-64  my-2 relative md:hidden left-0.5">
          <p className="absolute text-gray-dark bg-white left-24 -top-3 px-6">
            {selectedContent[localizationKeys.or]}
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
                <div className="md:mx-6 mx-0 sm:w-[304px] w-full">
                  <div className="mt-10 mx-auto ">
                    <FormikInput
                      name="userName"
                      type={"text"}
                      label={selectedContent[localizationKeys.name]}
                      placeholder={selectedContent[localizationKeys.name]}
                    />
                  </div>
                  <div className="mt-10 mx-auto ">
                    <FormikInput
                      name="email"
                      type={"email"}
                      label={selectedContent[localizationKeys.email]}
                      placeholder={selectedContent[localizationKeys.email]}
                    />
                  </div>
                  <div className="mt-10 mx-auto ">
                    <FormikInput
                      name="phone"
                      type={"text"}
                      label={selectedContent[localizationKeys.phone]}
                      placeholder={selectedContent[localizationKeys.phone]}
                    />
                  </div>
                  <div className="mt-10 mx-auto ">
                    <FormikInput
                      name="password"
                      type={"password"}
                      label={selectedContent[localizationKeys.password]}
                      placeholder={selectedContent[localizationKeys.password]}
                    />
                  </div>
                  <div className="mt-5 mx-1">
                    <div className="mt-2">
                      <label className="text-gray-med text-sm font-normal cursor-pointer  ">
                        <input
                          className="mt-0.5 ltr:mr-3 rtl:ml-3 bg-primary authcheckbox"
                          type="checkbox"
                          required
                        />
                        {
                          selectedContent[
                            localizationKeys.iAgreetotheTermsConditions
                          ]
                        }
                      </label>
                    </div>
                  </div>
                  <div className="">
                    <Button
                      loading={isLoading}
                      onClick={() => {
                        // history.push(routes.dashboard.app);
                      }}
                      className="bg-primary hover:bg-primary-dark opacity-100 sm:w-[304px]  w-full h-[48px] rounded-lg text-white mt-5 font-normal text-base rtl:font-serifAR ltr:font-serifEN "
                    >
                      {selectedContent[localizationKeys.createAccount]}
                    </Button>
                  </div>
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
