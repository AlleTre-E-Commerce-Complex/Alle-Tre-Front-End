import React, { useState } from "react";

import routes from "../../routes";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Field, Formik } from "formik";
import { Button, Form } from "semantic-ui-react";
import OAuthSections from "./O-Auth-sections";
import { toast } from "react-hot-toast";
import api from "../../api";
import useAxios from "../../hooks/use-axios";
import { axios } from "../../config/axios-config";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { useDispatch } from "react-redux";
import { Close } from "../../redux-store/auth-model-slice";
import { welcomeBonus } from "../../redux-store/welcom-bonus-slice";
import { useAuthState } from "context/auth-context";
import { store } from "redux-store/store";
import { setBlockedUser } from "redux-store/blocked-user-slice";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const LogIn = ({ currentPAth, isAuthModel, onToggleView }) => {
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const [showPassword, setShowPassword] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const { run, isLoading } = useAxios();

  const dispatch = useDispatch();

  const { login } = useAuthState();

  const logIn = (values) => {
    run(axios.post(api.auth.login, values))
      .then((res) => {
        const { accessToken, hasCompletedProfile, isAddedBonus } =
          res.data.data;
        // if (isAddedBonus) {
        //   dispatch(welcomeBonus(true));
        // }
        login({
          accessToken: accessToken,
        });
        window.localStorage.setItem(
          "hasCompletedProfile",
          JSON.stringify(hasCompletedProfile),
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
                    axios.post(api.auth.resendVerification, {
                      email: values.email,
                    }),
                  )
                    .then((res) => {
                      toast.loading(
                        selectedContent[
                          localizationKeys.aVerificationMailHasBeenSent
                        ],
                      );
                    })
                    .catch((err) => {
                      toast.error(
                        lang === "en"
                          ? err.message.en || err.message
                          : err.message.ar || err.message,
                      );
                    })
                }
                className="underline text-black cursor-pointer px-1"
              >
                {selectedContent[localizationKeys.resendMailAgain]}
              </span>
            </p>,
          );
        } else console.log("google auth error --->", err);
        // Check if the error is a 401 unauthorized
        if (err?.message?.en === "You are not authorized") {
          // Dispatch the action to show the modal
          store.dispatch(setBlockedUser(true));
        } else
          toast.error(
            lang === "en"
              ? err.message.en || err.message
              : err.message.ar || err.message,
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
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
      ),
  });

  const { run: runforgetPassword, isLoading: isLoadingorgetPassword } =
    useAxios();
  const forgetPassword = (values) => {
    runforgetPassword(axios.post(api.auth.forgetPassword, values))
      .then((res) => {
        toast.loading(
          selectedContent[localizationKeys.aVerificationMailHasBeenSent],
        );
        // history.push(routes.auth.logIn);
      })
      .catch((err) => {
        toast.error(
          lang === "en" ? err.message.en : err.message.en || err.message,
        );
      });
  };

  const forgetPasswordSchema = Yup.object({
    email: Yup.string().min(3).required("Required field"),
  });

  return (
    <div className="flex flex-col md:flex-row w-full animate-in z-50 rtl:font-serifAR ltr:font-serifEN">
      <div className="w-full md:w-1/2">
        <OAuthSections
          isLogin={true}
          currentPAth={currentPAth}
          isAuthModel={isAuthModel}
        />
      </div>
      <div className="hidden md:flex items-center">
        <div className="h-[70%] border-l border-[#39485C]"></div>
      </div>
      <div className="w-full md:w-1/2 px-4 md:px-10 mt-10 md:mt-16 flex flex-col justify-center pb-10">
        <div
          className={
            isHidden ? "animate-out h-0 overflow-hidden" : "animate-in"
          }
        >
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={logIn}
            validationSchema={logInSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit} className="w-full">
                <div className="w-full flex flex-col">
                  <div className="flex flex-col mb-8">
                    <label className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                      {selectedContent[localizationKeys.eMailAddress]} 
                    </label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="example@3arbon.com"
                      className="bg-transparent border-b border-[#39485C] text-sm text-gray-300 pb-2 focus:outline-none focus:border-[#d4af37] placeholder-gray-600 transition-colors w-full"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <span className="text-red-500 text-xs mt-1">
                        {formik.errors.email}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col mb-6 relative">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase">
                        {selectedContent[localizationKeys.password]}
                      </label>
                      <span
                        onClick={() => setIsHidden(true)}
                        className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer hover:text-gray-300 transition-colors"
                      >
                        FORGOT?
                      </span>
                    </div>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="bg-transparent border-b border-[#39485C] text-sm text-gray-300 pb-2 pr-8 focus:outline-none focus:border-[#d4af37] placeholder-gray-600 transition-colors w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 bottom-2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? (
                          <VscEye size={18} />
                        ) : (
                          <VscEyeClosed size={18} />
                        )}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <span className="text-red-500 text-xs mt-1">
                        {formik.errors.password}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center mb-8">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-sm border-[#39485C] bg-transparent text-[#d4af37] focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none checked:bg-[#d4af37] border"
                    />
                    <label className="ml-3 text-gray-400 text-[10px] font-bold tracking-[0.15em] uppercase cursor-pointer">
                      {selectedContent[localizationKeys.keepMeSignedIn]} 
                    </label>
                  </div>

                  <Button
                    loading={isLoading}
                    className="w-full bg-[#d4af37] hover:bg-[#e0b942] text-[#2A3A54] font-bold text-sm tracking-widest uppercase py-3.5 rounded-sm transition-colors shadow-lg shadow-[#d4af37]/20 border-0 m-0"
                    type="submit"
                  >
                    {selectedContent[localizationKeys.signIn]}
                  </Button>

                  <div className="mt-10 text-center w-full">
                    <span className="text-gray-500 text-[10px] font-bold tracking-[0.15em] uppercase">
                      {selectedContent[localizationKeys.dontHaveAnAccount]}{" "}
                    </span>
                    <button
                      type="button"
                      onClick={onToggleView}
                      className="text-[#d4af37] text-[10px] font-bold tracking-[0.15em] uppercase hover:text-[#e0b942] transition-colors"
                    >
                      {selectedContent[localizationKeys.createAccount]}
                    </button>
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
              <Form onSubmit={formik.handleSubmit} className="w-full">
                <div className="w-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[#d4af37] text-sm font-bold tracking-widest uppercase">
                      {selectedContent[localizationKeys.resetPassword]}
                    </h3>
                    <span
                      onClick={() => setIsHidden(false)}
                      className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase cursor-pointer hover:text-gray-300 transition-colors"
                    >
                      BACK TO LOGIN
                    </span>
                  </div>

                  <div className="flex flex-col mb-8">
                    <label className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                      {selectedContent[localizationKeys.eMail]} 
                    </label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="example@3arbon.com"
                      className="bg-transparent border-b border-[#39485C] text-sm text-gray-300 pb-2 focus:outline-none focus:border-[#d4af37] placeholder-gray-600 transition-colors w-full"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <span className="text-red-500 text-xs mt-1">
                        {formik.errors.email}
                      </span>
                    )}
                  </div>

                  <Button
                    loading={isLoadingorgetPassword}
                    className="w-full bg-[#d4af37] hover:bg-[#e0b942] text-[#2A3A54] font-bold text-sm tracking-widest uppercase py-3.5 rounded-sm transition-colors shadow-lg shadow-[#d4af37]/20 border-0 m-0"
                    type="submit"
                  >
                    {selectedContent[localizationKeys.sendVerification]}
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
