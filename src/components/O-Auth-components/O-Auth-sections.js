import React, { useEffect, useState } from "react";
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
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/use-axios";
import axios from "axios";
import api from "../../api";
import auth from "../../utils/auth";
import { authentications } from "../../config/firebase-config";

const OAuthSections = ({ isLogin }) => {
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
          })
        )
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
            toast.error("Something is wrong try again later");
          });
      })
      .catch((err) => {
        toast.error("Something is wrong try again later");
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
          })
        )
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
            toast.error("Something is wrong try again later");
          });
      })
      .catch((err) => {
        toast.error("Something is wrong try again later");
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
          })
        )
          .then((res) => {
            const { accessToken, refreshToken } = res.data.data;
            auth.setToken({
              newAccessToken: accessToken,
              newRefreshToken: refreshToken,
            });
            // history.push(routes.Dashboard.containers.base);
            toast.success("done");
          })
          .catch((err) => {
            toast.error("Something is wrong try again later");
          });
      })
      .catch((err) => {
        toast.error("Something is wrong try again later");
      });
  };

  return (
    <div>
      <Loginbutton
        logo={appleIcon}
        onClick={signInWithApple}
        text={isLogin ? "Login with Apple" : "Sign Up with Apple"}
      />
      <Loginbutton
        logo={googleIcon}
        onClick={signInWithGoogle}
        text={isLogin ? "Login with Google" : "Sign Up with Google"}
      />
      <Loginbutton
        logo={facebookIcon}
        onClick={signInWithFacebook}
        text={isLogin ? "Login with Facebook" : "Sign Up with Facebook"}
      />
      <div className={`${isLogin ? "mt-20" : "mt-28"} flex justify-center`}>
        <img src={allatreLogoColor} alt="allatreLogoColor" />
      </div>
    </div>
  );
};

export const Loginbutton = ({ logo, text, onClick }) => {
  return (
    <div>
      <button
        className="flex justify-center w-[327px] h-12 border-[1px] rounded-lg border-primary text-primary my-6 py-2"
        onClick={onClick}
      >
        <img className="mx-4" src={logo} alt="logo" />
        <p className="text-lg font-medium pt-0.5 ">{text}</p>
      </button>
    </div>
  );
};

export default OAuthSections;
