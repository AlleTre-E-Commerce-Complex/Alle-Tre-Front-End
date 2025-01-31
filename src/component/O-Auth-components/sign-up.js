import React, { useState } from "react";
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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { PiWarningCircle } from "react-icons/pi";
import TermsAndConditions from "component/shared/terms-and-condition/TermsAndCondition";

const SignUp = ({ currentPAth, isAuthModel }) => {
  // const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const isArabic = lang === "ar";
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
    phone: Yup.string()
      .required(selectedContent[localizationKeys.required])
      .matches(
        /^[+][0-9]+$/,
        selectedContent[localizationKeys.invalidPhoneNumber]
      ),
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
      <div className="mt-10 mx-auto md:mx-0">
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
            {({
              values,
              setFieldValue,
              errors,
              touched,
              handleSubmit,
              handleBlur,
            }) => (
              <Form onSubmit={handleSubmit}>
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
                  <div className="w-full">
                    <div className="mt-10 mx-auto">
                      <div
                        className="float-container"
                        lang={lang}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <label
                          htmlFor="phone"
                          className="label_Input_Form phone-label"
                          style={{
                            [isArabic ? "right" : "left"]: 58,
                            textAlign: isArabic ? "right" : "left",
                          }}
                        >
                          {selectedContent[localizationKeys.phone]}
                        </label>
                        <PhoneInput
                          id="phone"
                          name="phone"
                          international
                          defaultCountry="AE"
                          value={values.phoneNumber || ""}
                          onChange={(value) => setFieldValue("phone", value)}
                          onBlur={handleBlur}
                          className={"input_Input_Form phone_Input_Form"}
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
                          }}
                        />
                        {/* Error Message */}
                        {touched.phone && errors.phone && (
                          <div
                            className="text-red-700 text-md mt-1 absolute flex items-center"
                            style={{
                              position: "absolute",
                              top: "100%",
                              [isArabic ? "right" : "left"]: 8,
                            }}
                          >
                            <PiWarningCircle className="mr-2" />
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 mx-auto ">
                    <FormikInput
                      name="password"
                      type={"password"}
                      label={selectedContent[localizationKeys.password]}
                      placeholder={selectedContent[localizationKeys.password]}
                    />
                  </div>
                  <TermsAndConditions isFooter={false} />
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
