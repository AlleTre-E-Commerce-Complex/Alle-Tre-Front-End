import React, { useState } from "react";

import routes from "../../routes";
import { useHistory } from "react-router-dom";

import * as Yup from "yup";
import { Formik } from "formik";

import { Button, Form } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import { toast } from "react-hot-toast";

import { useQuery } from "../../hooks/use-query";
import useLocalStorage from "../../hooks/use-localstorage";
import useAxios from "../../hooks/use-axios";
import axios from "axios";
import api from "../../api";

import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Field } from "formik";

const ForgetPassword = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const query = useQuery();
  const tokenEdit = query.get("token");
  const [token] = useLocalStorage("tokenEdit", tokenEdit);

  const [isHidden, setIsHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { run, isLoading } = useAxios();
  const resetPassword = (values) => {
    const body = {
      token: tokenEdit || token,
      newPassword: values.password,
    };
    run(axios.post(api.auth.resetCredentials, body))
      .then((res) => {
        setIsHidden(true);
        toast.success(
          lang === "en"
            ? "Your password has been changed successfully"
            : " تم تغيير كلمة المرور الخاصة بك بنجاح",
        );
      })
      .catch((err) => {
        const errorMsg =
          lang === "en"
            ? err?.en || err?.message?.en || err?.message || err || "An error occurred"
            : err?.ar || err?.message?.ar || err?.message || err || "حدث خطأ ما";

        toast.error(errorMsg);
      });
  };

  const logInSchema = Yup.object({
    password: Yup.string()
      .min(8)
      .max(20)
      .trim()
      .required("Required field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
      ),
    confarmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], `not match`)
      .required("Required field"),
  });

  return (
    <div className="w-full max-w-[480px] mt-8 gap-x-3 animate-in z-50 rtl:font-serifAR ltr:font-serifEN">
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
              <Form onSubmit={formik.handleSubmit} className="w-full">
                <div className="w-full">
                  {/* New Password Field */}
                  <div className="flex flex-col mb-10 text-left rtl:text-right">
                    <label className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                      {selectedContent[localizationKeys.newPassword]}
                    </label>
                    <Field name="password">
                      {({ field, form }) => (
                        <div className="w-full">
                          <div className="relative w-full h-[48px]">
                            <input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              className={`w-full h-full rounded-lg bg-primary-dark border px-4 ltr:pr-12 rtl:pl-12 focus:outline-none transition-all text-white placeholder-gray-600 ${
                                form.touched.password && form.errors.password
                                  ? "border-red-600 focus:border-red-600"
                                  : "border-[#d4af37]/40 focus:border-[#d4af37]"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/5 active:scale-90 transition-all text-gray-500 hover:text-[#d4af37]"
                            >
                              {showPassword ? (
                                <HiEye size={20} />
                              ) : (
                                <HiEyeOff size={20} />
                              )}
                            </button>
                          </div>
                          {form.touched.password && form.errors.password && (
                            <div className="text-red-600 text-xs mt-2 font-medium leading-relaxed">
                              {form.errors.password}
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>

                  {/* Re-enter Password Field */}
                  <div className="flex flex-col mb-10 text-left rtl:text-right">
                    <label className="text-[#d4af37] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                      {selectedContent[localizationKeys.reEnterPassword]}
                    </label>
                    <Field name="confarmpassword">
                      {({ field, form }) => (
                        <div className="w-full">
                          <div className="relative w-full h-[48px]">
                            <input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              className={`w-full h-full rounded-lg bg-primary-dark border px-4 ltr:pr-12 rtl:pl-12 focus:outline-none transition-all text-white placeholder-gray-600 ${
                                form.touched.confarmpassword && form.errors.confarmpassword
                                  ? "border-red-600 focus:border-red-600"
                                  : "border-[#d4af37]/40 focus:border-[#d4af37]"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/5 active:scale-90 transition-all text-gray-500 hover:text-[#d4af37]"
                            >
                              {showConfirmPassword ? (
                                <HiEye size={20} />
                              ) : (
                                <HiEyeOff size={20} />
                              )}
                            </button>
                          </div>
                          {form.touched.confarmpassword && form.errors.confarmpassword && (
                            <div className="text-red-600 text-xs mt-2 font-medium leading-relaxed">
                              {form.errors.confarmpassword}
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    loading={isLoading}
                    className="w-full bg-[#d4af37] hover:bg-[#e0b942] text-[#2A3A54] font-bold text-sm tracking-widest uppercase py-3.5 rounded-sm transition-colors shadow-lg shadow-[#d4af37]/20 border-0 m-0"
                  >
                    {selectedContent[localizationKeys.resetPassword]}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div
          className={
            isHidden
              ? "animate-in text-center mx-auto flex flex-col items-center pt-8 pb-12"
              : "animate-out h-0 hidden mx-auto"
          }
        >
          <div className="success-checkmark mb-10 mt-4">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>

          <style>{`
            .success-checkmark {
              width: 80px;
              height: 115px;
              margin: 0 auto;
            }
            .success-checkmark .check-icon {
              width: 80px;
              height: 80px;
              position: relative;
              border-radius: 50%;
              box-sizing: content-box;
              border: 4px solid #d4af37;
            }
            .success-checkmark .check-icon::before {
              top: 3px;
              left: -2px;
              width: 30px;
              transform-origin: 100% 50%;
              border-radius: 100px 0 0 100px;
            }
            .success-checkmark .check-icon::after {
              top: 0;
              left: 30px;
              width: 60px;
              transform-origin: 0 50%;
              border-radius: 0 100px 100px 0;
              animation: rotate-circle 4.25s ease-in;
            }
            .success-checkmark .icon-line {
              height: 5px;
              background-color: #d4af37;
              display: block;
              border-radius: 2px;
              position: absolute;
              z-index: 10;
            }
            .success-checkmark .line-tip {
              top: 46px;
              left: 14px;
              width: 25px;
              transform: rotate(45deg);
              animation: icon-line-tip 0.75s;
            }
            .success-checkmark .line-long {
              top: 38px;
              right: 8px;
              width: 47px;
              transform: rotate(-45deg);
              animation: icon-line-long 0.75s;
            }
            .success-checkmark .icon-circle {
              top: -4px;
              left: -4px;
              z-index: 10;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              border: 4px solid rgba(212, 175, 55, 0.2);
              box-sizing: content-box;
              position: absolute;
            }
            .success-checkmark .icon-fix {
              top: 8px;
              width: 5px;
              left: 26px;
              z-index: 1;
              height: 85px;
              position: absolute;
              transform: rotate(-45deg);
              background-color: transparent;
            }

            @keyframes icon-line-tip {
              0% { width: 0; left: 1px; top: 19px; }
              54% { width: 0; left: 1px; top: 19px; }
              70% { width: 50px; left: -8px; top: 37px; }
              84% { width: 17px; left: 21px; top: 48px; }
              100% { width: 25px; left: 14px; top: 46px; }
            }
            @keyframes icon-line-long {
              0% { width: 0; right: 46px; top: 54px; }
              65% { width: 0; right: 46px; top: 54px; }
              75% { width: 50px; right: 14px; top: 35px; }
              87% { width: 40px; right: 10px; top: 38px; }
              100% { width: 47px; right: 8px; top: 38px; }
            }
            @keyframes rotate-circle {
              0% { transform: rotate(-45deg); }
              5% { transform: rotate(-45deg); }
              12% { transform: rotate(-405deg); }
              100% { transform: rotate(-405deg); }
            }
          `}</style>
          <h2 className="text-[#d4af37] text-2xl font-bold tracking-widest uppercase mb-4">
            {lang === "en" ? "Success!" : "تم بنجاح"}
          </h2>
          <p className="text-gray-300 text-base max-w-[320px] mx-auto leading-relaxed opacity-80">
            {
              selectedContent[
                localizationKeys.thePasswordHasBeenSuccessfullyChanged
              ]
            }
          </p>
          <button
            onClick={() => {
              history.push(routes.app.home);
            }}
            className="w-full max-w-[304px] h-12 bg-[#d4af37] text-[#2A3A54] hover:bg-[#e0b942] rounded-sm mt-10 font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-[#d4af37]/20"
          >
            {selectedContent[localizationKeys.backToHome]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
