import React, { useState } from "react";

import routes from "../../routes";
import { Link, useHistory } from "react-router-dom";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";

import { Button, Form } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../context/language-context";
import { content } from "../../localization/content";
import { useQuery } from "../../hooks/use-query";
import useLocalStorage from "../../hooks/use-localstorage";
import useAxios from "../../hooks/use-axios";
import axios from "axios";
import api from "../../api";

const ForgetPassword = () => {
  const [lang, setLang] = useLanguage("");
  const langContent = content[lang];
  const history = useHistory();
  const query = useQuery();
  const tokenEdit = query.get("token");
  const [token] = useLocalStorage("tokenEdit", tokenEdit);

  const [isHidden, setIsHidden] = useState(false);

  const { run, isLoading } = useAxios();
  const resetPassword = (values) => {
    const body = {
      token: token,
      newPassword: values.password,
    };
    run(axios.post(api.auth.resetCredentials, body))
      .then((res) => {
        // history.push(routes.auth.logIn);
        setIsHidden(true);
        toast.success(
          lang === "en" ? (
            <p>Your password has been changed successfully</p>
          ) : (
            <p> تم تغيير كلمة المرور الخاصة بك بنجاح</p>
          )
        );
      })
      .catch((err) => {
        toast.error(
          lang === "en" ? err.message.en : err.message.en || err.message
        );
      });
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
        <div className={isHidden ? "animate-out h-0" : "animate-in"}>
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
                        className="mt-1.5 mr-3 bg-primary authcheckbox"
                        type="checkbox"
                      />
                      Remember Password
                    </label>
                  </div>
                  <Link className="underline text-primary-dark text-sm font-normal pt-1 cursor-pointer">
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
                    Reset Password
                  </Button>
                </div>
                {/* <div className="bg-transparent-400 w-full h-14">
                  <lottie-player
                    src="./lottie-player.js"
                    background="transparent"
                    speed="1"
                    autoplay
                  ></lottie-player>
                </div> */}
              </Form>
            )}
          </Formik>
        </div>
        <div
          className={
            isHidden ? "animate-in mx-auto" : "animate-out h-0 hidden mx-auto"
          }
        >
          <p className="text-gray py-8">
            The password has been successfully changed.
          </p>
          <button
            loading={isLoading}
            onClick={() => {
              history.push(routes.auth.logIn);
            }}
            className="bg-white border-[1px] border-primary w-80 h-12 rounded-lg text-primary mt-5 font-normal text-base "
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
