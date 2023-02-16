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

const LogIn = () => {
  const history = useHistory();

  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const [isHidden, setIsHidden] = useState(false);
  const [email, setEmail] = useState("");

  const { run, isLoading } = useAxios();

  const logIn = (values) => {
    setEmail(values.email);
    run(axios.post(api.auth.login, values))
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data;
        auth.setToken({
          newAccessToken: accessToken,
          newRefreshToken: refreshToken,
        });
        toast.success("done");
        // history.push(routes.Dashboard.containers.base);
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
                      history.push(routes.auth.logIn);
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
    password: Yup.string().min(3).max(20).required("Required field"),
  });

  const { run: runforgetPassword, isLoading: isLoadingorgetPassword } =
    useAxios();
  const forgetPassword = (values) => {
    runforgetPassword(axios.post(api.auth.forgetPassword, values))
      .then((res) => {
        toast.loading(
          selectedContent[localizationKeys.aVerificationMailHasBeenSent]
        );
        history.push(routes.auth.logIn);
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
    <div className="flex flex-col md:flex-row  mt-8 gap-x-3 animate-in z-50">
      <div className="mx-auto md:mx-0">
        <OAuthSections isLogin={true} />
      </div>
      <div className="mx-5 ">
        <p className="border-l-[1px] border-gray-dark h-64 bg-blue-400 my-2 relative md:block hidden left-0.5">
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
                <div className="mx-6 md:mx-0">
                  <div className="mt-10 mx-auto flex md:block justify-center">
                    <FormikInput
                      name="email"
                      type={"email"}
                      label={selectedContent[localizationKeys.email]}
                      placeholder={selectedContent[localizationKeys.email]}
                    />
                  </div>
                  <div className="mt-12 mx-auto flex md:block justify-center">
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
                          className="mt-1 ltr:mr-3 rtl:ml-3 bg-primary authcheckbox"
                          type="checkbox"
                        />
                        {selectedContent[localizationKeys.rememberPassword]}
                      </label>
                    </div>
                    <Link
                      onClick={() => setIsHidden(true)}
                      // to={routes.auth.enterEmail}
                      className="underline text-primary-dark text-sm font-normal pt-1"
                    >
                      {selectedContent[localizationKeys.forgetPassword]}
                    </Link>
                  </div>
                  <div className="flex justify-center ">
                    <Button
                      loading={isLoading}
                      onClick={() => {
                        // history.push(routes.dashboard.app);
                      }}
                      className="bg-primary w-80 h-12 rounded-lg text-white mt-5 font-normal text-base font-serifAR "
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
                <div className="mx-6 md:mx-0">
                  <div className="mt-10 mx-auto flex md:block justify-center">
                    <FormikInput
                      name="email"
                      type={"email"}
                      label={selectedContent[localizationKeys.email]}
                      placeholder={selectedContent[localizationKeys.email]}
                    />
                  </div>
                  <div className="flex justify-end mt-2 mx-1">
                    <Link
                      onClick={() => setIsHidden(false)}
                      className="underline text-primary-dark text-sm font-normal pt-1"
                    >
                      {selectedContent[localizationKeys.backToLogin]}
                    </Link>
                  </div>
                  <div className="flex justify-center ">
                    <Button
                      loading={isLoadingorgetPassword}
                      className="bg-primary w-80 h-12 rounded-lg text-white mt-5 font-normal text-base font-serifAR "
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
