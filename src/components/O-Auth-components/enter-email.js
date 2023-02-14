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
  const forgetPassword = (values) => {
    run(axios.post(api.auth.forgetPassword, values))
      .then((res) => {
        toast.loading(
          "A verification mail has been sent to your mail please check it...."
        );
        history.push(routes.auth.logIn);
      })
      .catch((err) => {
        toast.error(lang === "en" ? err.message.en : err.message.en);
      });
  };

  const forgetPasswordSchema = Yup.object({
    email: Yup.string().min(3).required("Required field"),
  });

  return (
    <div className="flex mt-8 gap-x-3 animate-in z-50">
      <div>
        <div className="">
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
                <div className="flex justify-center ">
                  <Button
                    loading={isLoading}
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
