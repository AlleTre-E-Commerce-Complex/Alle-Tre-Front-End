import React, { useState } from "react";
import OAuthSections from "./O-Auth-sections";
// import routes from "../../routes";
// import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Field, Formik } from "formik";
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
import { HiEye, HiEyeOff } from "react-icons/hi";

const SignUp = ({ currentPAth, isAuthModel, onToggleView }) => {
  const [showPassword, setShowPassword] = useState(false);
  // const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { run, isLoading } = useAxios();

  const signUp = (values) => {
    run(axios.post(api.auth.signup, values))
      .then((res) => {
        toast.loading(
          selectedContent[localizationKeys.aVerificationMailHasBeenSent],
        );
      })
      .catch((err) => {
        let errorMsg = "";

        if (typeof err.message === "object") {
          errorMsg = lang === "en" ? err.message.en : err.message.ar;
        } else {
          errorMsg = err.message;
        }

        toast.error(errorMsg);
      });
  };

  const signUpSchema = Yup.object({
    userName: Yup.string().min(3).max(20).required("Required field"),
    email: Yup.string().min(3).required("Required field"),
    phone: Yup.string()
      .required(selectedContent[localizationKeys.required])
      .matches(
        /^[+][0-9]+$/,
        selectedContent[localizationKeys.invalidPhoneNumber],
      ),
    password: Yup.string()
      .min(8)
      .max(20)
      .trim()
      .required("Required field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
      ),
  });

  return (
    <div className="flex flex-col md:flex-row w-full animate-in z-50 rtl:font-serifAR ltr:font-serifEN">
      <div className="w-full md:w-1/2">
        <OAuthSections isLogin={false} />
      </div>
      <div className="hidden md:flex items-center">
        <div className="h-[70%] border-l border-[#39485C]"></div>
      </div>
      <div className="w-full md:w-1/2 px-4 md:px-10 mt-6 md:mt-10 flex flex-col justify-center pb-10">
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
            <Form onSubmit={handleSubmit} className="w-full">
              <div className="w-full flex flex-col">
                <div className="flex flex-col mb-6">
                  <label className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                    {selectedContent[localizationKeys.name]}
                  </label>
                  <Field
                    name="userName"
                    type="text"
                    placeholder="John Doe"
                    className="bg-transparent border-b border-[#39485C] text-sm text-gray-300 pb-2 focus:outline-none focus:border-[#d4af37] placeholder-gray-600 transition-colors w-full"
                  />
                  {touched.userName && errors.userName && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.userName}
                    </span>
                  )}
                </div>

                <div className="flex flex-col mb-6">
                  <label className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                    {selectedContent[localizationKeys.eMailAddress]} 
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="example@3arbon.com"
                    className="bg-transparent border-b border-[#39485C] text-sm text-gray-300 pb-2 focus:outline-none focus:border-[#d4af37] placeholder-gray-600 transition-colors w-full"
                  />
                  {touched.email && errors.email && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="flex flex-col mb-6 relative">
                  <label className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                    {selectedContent[localizationKeys.phone]}
                  </label>
                  <PhoneInput
                    id="phone"
                    name="phone"
                    international
                    defaultCountry="AE"
                    value={values.phone || ""}
                    onChange={(value) => setFieldValue("phone", value)}
                    onBlur={handleBlur}
                    className="bg-transparent text-sm text-gray-300 pb-2 transition-colors w-full PhoneInput-auth-dark"
                    placeholder={selectedContent[localizationKeys.phoneNumber]}
                    style={{
                      boxShadow: "none",
                      outline: "none",
                    }}
                  />
                  {/* Style override to make PhoneInput text white in dark mode without rewriting its internals fully */}
                  <style>{`
                    .PhoneInput-auth-dark input {
                      background: transparent;
                      color: #D1D5DB;
                      border: none;
                      outline: none;
                    }
                    .PhoneInput-auth-dark input::placeholder {
                      color: #4B5563;
                    }
                    .PhoneInputCountrySelect {
                      background-color: #2A3A54;
                      color: white;
                    }
                    .PhoneInputCountrySelect option {
                      background-color: #2A3A54;
                      color: white;
                    }
                    .PhoneInput {
                      background: #2A3A54;
                    }
                    .PhoneInputCountry {
                      background: #2A3A54;
                    }
                    .PhoneInputCountryIcon {
                      background: #2A3A54;
                      box-shadow: none;
                    }
                    .PhoneInputInput {
                      background-color: transparent !important;
                      color: #d1d5db !important;
                      border: none ;
                      outline: none ;
                      border-color: #39485C !important;
                      focus-within:border-color:#d4af37 !important;
                    }
                    .PhoneInputCountrySelectArrow {
                      color: #d4af37;
                      opacity: 1;
                      border-bottom-width: 2px;
                      border-right-width: 2px;
                    }
                  `}</style>
                  {touched.phone && errors.phone && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <PiWarningCircle className="mr-1" />
                      {errors.phone}
                    </div>
                  )}
                </div>

                <div className="flex flex-col mb-6 relative">
                  <label className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                    {selectedContent[localizationKeys.password]}
                  </label>
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
                      className="absolute right-1 top-1 p-1.5 rounded-full hover:bg-white/5 active:scale-90 transition-all text-gray-500 hover:text-[#d4af37]"
                    >
                      {showPassword ? (
                        <HiEye size={15} className="transition-opacity duration-300" />
                      ) : (
                        <HiEyeOff size={15} className="transition-opacity duration-300" />
                      )}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <span className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className="mb-6 -mt-2">
                  <TermsAndConditions isFooter={false} />
                </div>

                <Button
                  loading={isLoading}
                  className="w-full bg-[#d4af37] hover:bg-[#e0b942] text-[#2A3A54] font-bold text-sm tracking-widest uppercase py-3.5 rounded-sm transition-colors shadow-lg shadow-[#d4af37]/20 border-0 m-0"
                  type="submit"
                >
                  {selectedContent[localizationKeys.createAccount]}
                </Button>

                <div className="mt-8 text-center w-full">
                  <span className="text-gray-500 text-[10px] font-bold tracking-[0.15em] uppercase">
                    {
                      selectedContent[localizationKeys.alreadyHaveAnAccount]
                    }{" "}
                  </span>
                  <button
                    type="button"
                    onClick={onToggleView}
                    className="text-[#d4af37] text-[10px] font-bold tracking-[0.15em] uppercase hover:text-[#e0b942] transition-colors"
                  >
                    {selectedContent[localizationKeys.signIn]}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
