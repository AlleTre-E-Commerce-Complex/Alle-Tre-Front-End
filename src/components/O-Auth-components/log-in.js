import React from "react";

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

  const { run, isLoading } = useAxios();
  const logIn = (values) => {
    run(axios.post(api.auth.login, values))
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data;
        auth.setToken({
          newAccessToken: accessToken,
          newRefreshToken: refreshToken,
        });
        toast.error("done");
        // history.push(routes.Dashboard.containers.base);
      })
      .catch((err) => {
        toast.error(lang === "en" ? err.message.en : err.message.en);
      });
  };

  const logInSchema = Yup.object({
    email: Yup.string().min(3).max(20, "").required("Required field"),
    password: Yup.string().min(3).max(20, "").required("Required field"),
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
        <div className="">
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
                    to={routes.auth.enterEmail}
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
          {/* <button onClick={() => toast.loading("Successfully toasted!")}>
            test tost
          </button>
          <button
            onClick={() =>
              toast.error(
                <button
                  onClick={() => console.log("err")}
                  className="underline "
                >
                  ksdcbkjdbscjhdsb
                </button>
              )
            }
          >
            test tost
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default LogIn;
