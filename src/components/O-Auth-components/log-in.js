import React, { useState } from "react";

import routes from "../../routes";
import { Link, useHistory } from "react-router-dom";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";

import { Button, Form } from "semantic-ui-react";
import OAuthSections from "./O-Auth-sections";
import useAxios from "../../hooks/use-axios";
import { axios } from "../../config/axios-config";
import { toast } from "react-hot-toast";
import api from "../../api";
import auth from "../../utils/auth";
import { useLanguage } from "../../context/language-context";

const LogIn = () => {
  const history = useHistory();
  const [lang] = useLanguage("");

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
              The email address for this account has not yet been verified.
              Please check your inbox. If you cannot find this email, Check
              <span
                onClick={() =>
                  runforgetPassword(
                    axios.post(api.auth.resendVerification, { email: email })
                  )
                    .then((res) => {
                      toast.loading(
                        "A verification mail has been sent to your mail please check it...."
                      );
                      history.push(routes.auth.logIn);
                    })
                    .catch((err) => {
                      toast.error(
                        lang === "en"
                          ? err.message.en
                          : err.message.en || err.message
                      );
                    })
                }
                className="underline text-black cursor-pointer"
              >
                Resend mail again
              </span>
            </p>
          );
        } else toast.error(lang === "en" ? err.message.en : err.message.en);
      });
  };

  const logInSchema = Yup.object({
    email: Yup.string().required("Required field"),
    password: Yup.string().min(3).max(20, "").required("Required field"),
  });

  const { run: runforgetPassword, isLoading: isLoadingorgetPassword } =
    useAxios();
  const forgetPassword = (values) => {
    runforgetPassword(axios.post(api.auth.forgetPassword, values))
      .then((res) => {
        toast.loading(
          "A verification mail has been sent to your mail please check it...."
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
    <div className="flex mt-8 gap-x-3 animate-in z-50">
      <div className="">
        <OAuthSections isLogin={true} />
      </div>
      <div className="mx-5">
        <p className="border-l-[1px] border-gray-dark h-64 my-2 relative left-0.5">
          <p className="absolute -left-[30px] text-gray-dark rotate-90 top-1/2 bg-white px-6">
            OR
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
                <div className="mt-10 mx-auto">
                  <FormikInput
                    name="email"
                    type={"email"}
                    label={"E-mail"}
                    placeholder={"E-mail"}
                  />
                </div>
                <div className="mt-12">
                  <FormikInput
                    name="password"
                    type={"password"}
                    label={"Password"}
                    placeholder={"E-mail"}
                  />
                </div>
                <div className="flex justify-between mt-5 mx-1">
                  <div>
                    <label className="text-gray-med text-sm font-normal cursor-pointer">
                      <input
                        className="mt-1 mr-3 bg-primary authcheckbox"
                        type="checkbox"
                      />
                      Remember Password
                    </label>
                  </div>
                  <Link
                    onClick={() => setIsHidden(true)}
                    // to={routes.auth.enterEmail}
                    className="underline text-primary-dark text-sm font-normal pt-1"
                  >
                    Forget Password
                  </Link>
                </div>
                <div className="flex justify-center ">
                  <Button
                    loading={isLoading}
                    onClick={() => {
                      // history.push(routes.dashboard.app);
                    }}
                    className="bg-primary w-80 h-12 rounded-lg text-white mt-5 font-normal text-base "
                  >
                    Log in
                  </Button>
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
                <div className="mt-10 mx-auto">
                  <FormikInput
                    name="email"
                    type={"email"}
                    label={"E-mail"}
                    placeholder={"E-mail"}
                  />
                </div>
                <div className="flex justify-end mt-2 mx-1">
                  <Link
                    onClick={() => setIsHidden(false)}
                    className="underline text-primary-dark text-sm font-normal pt-1"
                  >
                    Log in
                  </Link>
                </div>
                <div className="flex justify-center ">
                  <Button
                    loading={isLoadingorgetPassword}
                    className="bg-primary w-80 h-12 rounded-lg text-white mt-5 font-normal text-base "
                  >
                    Sent Verification
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

export default LogIn;
