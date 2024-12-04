import React, { useState } from "react";

import routes from "../../routes";
import { Link, useHistory } from "react-router-dom";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";

import { Button, Form } from "semantic-ui-react";
import OAuthSections from "./O-Auth-sections";
import { toast } from "react-hot-toast";

import auth from "../../utils/auth";
import api from "../../api";
import useAxios from "../../hooks/use-axios";
import { axios } from "../../config/axios-config";

import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

import { useDispatch } from "react-redux";
import { Close } from "../../redux-store/auth-model-slice";
import { welcomeBonus } from "../../redux-store/welcom-bonus-slice";
import { loginDate } from "../../redux-store/socket-auctionId-slice";
import { useAuthState } from "context/auth-context";

const LogIn = ({ currentPAth, isAuthModel }) => {
  const history = useHistory();

  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const [isHidden, setIsHidden] = useState(false);
  const [email, setEmail] = useState("");

  const { run, isLoading } = useAxios();

  const dispatch = useDispatch();

  const { login } = useAuthState();

  const logIn = (values) => {
    setEmail(values.email);
    run(axios.post(api.auth.login, values))
      .then((res) => {
        const { accessToken, refreshToken, hasCompletedProfile, isAddedBonus } =
          res.data.data;
          if(isAddedBonus){
            dispatch(welcomeBonus(true))
          }
        login({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
        window.localStorage.setItem(
          "hasCompletedProfile",
          JSON.stringify(hasCompletedProfile)
        );
        isAuthModel ? history.push(currentPAth) : history.push(routes.app.home);
        dispatch(Close());
      })
      .catch((err) => {
        if (err.message.en === "Verify your account") {
          toast.error(
            <p className="text-gray-dark text-sm py-2">
              {
                selectedContent[
                  localizationKeys
                    .theEmailAddressForThisAccountHasNotYetBeenVerified
                ]
              }
              <span
                onClick={() =>
                  runforgetPassword(
                    axios.post(api.auth.resendVerification, { email: email })
                  )
                    .then((res) => {
                      toast.loading(
                        selectedContent[
                          localizationKeys.aVerificationMailHasBeenSent
                        ]
                      );
                    })
                    .catch((err) => {
                      toast.error(
                        lang === "en"
                          ? err.message.en || err.message
                          : err.message.ar || err.message
                      );
                    })
                }
                className="underline text-black cursor-pointer px-1"
              >
                {selectedContent[localizationKeys.resendMailAgain]}
              </span>
            </p>
          );
        } else
          toast.error(
            lang === "en"
              ? err.message.en || err.message
              : err.message.ar || err.message
          );
      });
  };

  const logInSchema = Yup.object({
    email: Yup.string().required("Required field"),
    password: Yup.string()
      .min(8)
      .max(20)
      .required("Required field")
      .trim()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
  });

  const { run: runforgetPassword, isLoading: isLoadingorgetPassword } =
    useAxios();
  const forgetPassword = (values) => {
    runforgetPassword(axios.post(api.auth.forgetPassword, values))
      .then((res) => {
        toast.loading(
          selectedContent[localizationKeys.aVerificationMailHasBeenSent]
        );
        // history.push(routes.auth.logIn);
      })
      .catch((err) => {
        toast.error(
          lang === "en" ? err.message.en : err.message.en || err.message
        );
      });
  };

  const forgetPasswordSchema = Yup.object({
    email: Yup.string().min(3).required("Required field"),
  });

  return (
    <div className="flex flex-col md:flex-row  mt-8 gap-x-3 animate-in z-50 rtl:font-serifAR ltr:font-serifEN ">
      <div className="mx-auto md:mx-0">
        <OAuthSections
          isLogin={true}
          currentPAth={currentPAth}
          isAuthModel={isAuthModel}
        />
      </div>
      <div className="mx-5 ">
        <div className="border-l-[1px] border-gray-dark h-64 bg-blue-400 my-2 relative md:block hidden ltr:left-4 rtl:-left-4">
          <p className="absolute -left-[30px]  text-gray-dark md:rotate-90 rotate-0 top-1/2 bg-white px-6">
            {selectedContent[localizationKeys.or]}
          </p>
        </div>
      </div>
      <div className="mx-auto ">
        <div className="border-t-[1px] border-gray-dark w-64  my-2 relative md:hidden left-0.5">
          <p className="absolute text-gray-dark bg-white left-24 -top-3 px-6">
            {selectedContent[localizationKeys.or]}
          </p>
        </div>
      </div>
      <div>
        <div className={isHidden ? "animate-out h-0" : "animate-in"}>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={logIn}
            validationSchema={logInSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="md:mx-6 mx-0 sm:w-[304px] w-full">
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
                      name="password"
                      type={"password"}
                      label={selectedContent[localizationKeys.password]}
                      placeholder={selectedContent[localizationKeys.password]}
                    />
                  </div>
                  <div className="flex justify-between mt-5 mx-1">
                    <div>
                      <label className="text-gray-med text-sm font-normal cursor-pointer">
                        <input
                          className="mt-0.5 ltr:mr-3 rtl:ml-3 bg-primary authcheckbox"
                          type="checkbox"
                        />
                        {selectedContent[localizationKeys.rememberPassword]}
                      </label>
                    </div>
                    <span
                      onClick={() => setIsHidden(true)}
                      className="underline cursor-pointer text-primary-dark text-sm font-normal pt-1"
                    >
                      {selectedContent[localizationKeys.forgetPassword]}
                    </span>
                  </div>
                  <div className="md:flex block justify-center ">
                    <Button
                      loading={isLoading}
                      className="bg-primary hover:bg-primary-dark opacity-100 sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-5 font-normal text-base rtl:font-serifAR ltr:font-serifEN"
                    >
                      {selectedContent[localizationKeys.login]}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className={isHidden ? "animate-in" : "animate-out h-0 hidden"}>
          <Formik
            initialValues={{
              email: "",
            }}
            onSubmit={forgetPassword}
            validationSchema={forgetPasswordSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="md:mx-6 mx-0  sm:w-[304px] w-full ">
                  <div className="mt-10 mx-auto ">
                    <FormikInput
                      name="email"
                      type={"email"}
                      label={selectedContent[localizationKeys.email]}
                      placeholder={selectedContent[localizationKeys.email]}
                    />
                  </div>
                  <div className="flex justify-end mt-2 mx-1">
                    <span
                      onClick={() => setIsHidden(false)}
                      className="underline cursor-pointer text-primary-dark text-sm font-normal pt-1"
                    >
                      {selectedContent[localizationKeys.backToLogin]}
                    </span>
                  </div>
                  <div className="w-full">
                    <Button
                      loading={isLoadingorgetPassword}
                      className="bg-primary hover:bg-primary-dark opacity-100 sm:w-[304px] h-[48px] w-full  rounded-lg text-white mt-5 font-normal text-base font-serifAR "
                    >
                      {selectedContent[localizationKeys.sentVerification]}
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

export default LogIn;
