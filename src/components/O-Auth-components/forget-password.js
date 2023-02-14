import React from "react";

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

  console.log("====================================");
  console.log(token);
  console.log("====================================");

  const { run, isLoading } = useAxios();
  const resetPassword = (values) => {
    const body = {
      token: token,
      newPassword: values.password,
    };
    run(axios.post(api.auth.resetCredentials, body))
      .then((res) => {
        history.push(routes.auth.logIn);
        toast.success(
          lang === "en" ? res?.data?.data?.en : res?.data?.data?.ar
        );
      })
      .catch((err) => {
        toast.success(
          lang === "en" ? err?.data?.data?.en : err?.data?.data?.ar
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
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
