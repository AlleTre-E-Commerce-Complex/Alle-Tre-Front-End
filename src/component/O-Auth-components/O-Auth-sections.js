import React from "react";

import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";

import appleIcon from "../../../src/assets/icons/Apple-icon.svg";
import googleIcon from "../../../src/assets/icons/Google-icon.svg";
import facebookIcon from "../../../src/assets/icons/Fcaebook-icon.svg";
import allatreLogoColor from "../../../src/assets/logo/allatre-logo-color.svg";

import { authentications } from "../../config/firebase-config";
import useAxios from "../../hooks/use-axios";
import { toast } from "react-hot-toast";
import auth from "../../utils/auth";
import api from "../../api";
import axios from "axios";

import content from "../../localization/content";
import { useLanguage } from "../../context/language-context";
import localizationKeys from "../../localization/localization-keys";

import { useHistory } from "react-router-dom";
import routes from "../../routes";

import { useDispatch } from "react-redux";
import { Close } from "../../redux-store/auth-model-slice";
import { loginDate } from "../../redux-store/login-date-slice";
import { useAuthState } from "context/auth-context";

const OAuthSections = ({ isLogin, currentPAth, isAuthModel }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const history = useHistory();

  const dispatch = useDispatch();
  const { login } = useAuthState();

  const { run } = useAxios();
  const signInWithApple = () => {
    const provider = new OAuthProvider("apple.com");
    signInWithPopup(authentications, provider)
      .then((res) => {
        run(
          axios.post(api.auth.aAuth, {
            userName: res?._tokenResponse?.displayName || null,
            email: res?._tokenResponse?.email || null,
            idToken: res?._tokenResponse?.idToken || null,
            phone: res?._tokenResponse?.phoneNumber || null,
            oAuthType: "APPLE",
          })
        )
          .then((res) => {
            const { accessToken, refreshToken, hasCompletedProfile } =
              res.data.data;
            login({
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
            window.localStorage.setItem(
              "hasCompletedProfile",
              JSON.stringify(hasCompletedProfile)
            );
            isAuthModel
              ? history.push(currentPAth)
              : history.push(routes.app.home);
            dispatch(Close());
            dispatch(loginDate({ IsLogIN: true }));
          })
          .catch((err) => {
            toast.error(
              selectedContent[
                localizationKeys.somethingWentWrongPleaseTryAgainLater
              ]
            );
          });
      })
      .catch((err) => {
        toast.error(
          selectedContent[
            localizationKeys.somethingWentWrongPleaseTryAgainLater
          ]
        );
      });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentications, provider)
      .then((res) => {
        run(
          axios.post(api.auth.aAuth, {
            userName: res?._tokenResponse?.displayName || null,
            email: res?._tokenResponse?.email || null,
            idToken: res?._tokenResponse?.idToken || null,
            phone: res?._tokenResponse?.phoneNumber || null,
            oAuthType: "GOOGLE",
          })
        )
          .then((res) => {
            const { accessToken, refreshToken, hasCompletedProfile } =
              res.data.data;
            login({
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
            window.localStorage.setItem(
              "hasCompletedProfile",
              JSON.stringify(hasCompletedProfile)
            );
            isAuthModel
              ? history.push(currentPAth)
              : history.push(routes.app.home);
            dispatch(Close());
            dispatch(loginDate({ IsLogIN: true }));
          })
          .catch((err) => {
            toast.error(
              selectedContent[
                localizationKeys.somethingWentWrongPleaseTryAgainLater
              ]
            );
          });
      })
      .catch((err) => {
        toast.error(
          selectedContent[
            localizationKeys.somethingWentWrongPleaseTryAgainLater
          ]
        );
      });
  };

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(authentications, provider)
      .then((res) => {
        run(
          axios.post(api.auth.aAuth, {
            userName: res?._tokenResponse?.displayName || null,
            email: res?._tokenResponse?.email || null,
            idToken: res?._tokenResponse?.idToken || null,
            phone: res?._tokenResponse?.phoneNumber || null,
            oAuthType: "FACEBOOK",
          })
        )
          .then((res) => {
            const { accessToken, refreshToken, hasCompletedProfile } =
              res.data.data;
            login({
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
            window.localStorage.setItem(
              "hasCompletedProfile",
              JSON.stringify(hasCompletedProfile)
            );
            isAuthModel
              ? history.push(currentPAth)
              : history.push(routes.app.home);
            dispatch(Close());
            dispatch(loginDate({ IsLogIN: true }));
          })
          .catch((err) => {
            toast.error(
              selectedContent[
                localizationKeys.somethingWentWrongPleaseTryAgainLater
              ]
            );
          });
      })
      .catch((err) => {
        toast.error(
          selectedContent[
            localizationKeys.somethingWentWrongPleaseTryAgainLater
          ]
        );
      });
  };

  return (
    <div>
      <Loginbutton
        logo={appleIcon}
        onClick={signInWithApple}
        text={
          isLogin
            ? selectedContent[localizationKeys.loginWithApple]
            : selectedContent[localizationKeys.signupwithApple]
        }
      />
      <Loginbutton
        logo={googleIcon}
        onClick={signInWithGoogle}
        text={
          isLogin
            ? selectedContent[localizationKeys.loginwithGoogle]
            : selectedContent[localizationKeys.signupwithGoogle]
        }
      />
      <Loginbutton
        logo={facebookIcon}
        onClick={signInWithFacebook}
        text={
          isLogin
            ? selectedContent[localizationKeys.loginwithFacebook]
            : selectedContent[localizationKeys.signupwithFacebook]
        }
      />
      <div
        className={`${
          isLogin ? "mt-20" : "mt-28"
        } md:flex justify-center hidden`}
      >
        <img src={allatreLogoColor} alt="allatreLogoColor" />
      </div>
    </div>
  );
};

export const Loginbutton = ({ logo, text, onClick }) => {
  return (
    <div>
      <button
        className="flex justify-start w-[328px] h-[48px] border-[1px] rounded-lg border-primary text-primary my-6 py-2 ltr:pl-[60px] rtl:pr-5"
        onClick={onClick}
      >
        <img className="mx-4" src={logo} alt="logo" />
        <p className="text-lg font-medium pt-0.5 ">{text}</p>
      </button>
    </div>
  );
};

export default OAuthSections;
