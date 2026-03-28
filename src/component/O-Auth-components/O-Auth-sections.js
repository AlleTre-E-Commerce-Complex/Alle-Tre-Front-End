import React from "react";

import {
  signInWithPopup,
  // FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithRedirect,
  // linkWithCredential,
  // fetchSignInMethodsForEmail,
} from "firebase/auth";

import { FaGoogle, FaApple } from "react-icons/fa";
// import facebookIcon from "../../../src/assets/icons/Fcaebook-icon.svg";
// import allatreLogoColor from "../../../src/assets/logo/allatre-logo-color.svg";
import allatreLogoWhite from "../../../src/assets/logo/3arbon-main.svg";

import { authentications } from "../../config/firebase-config";
import useAxios from "../../hooks/use-axios";
import { toast } from "react-hot-toast";
// import auth from "../../utils/auth";
import api from "../../api";
import axios from "axios";

import content from "../../localization/content";
import { useLanguage } from "../../context/language-context";
import localizationKeys from "../../localization/localization-keys";

import { useHistory } from "react-router-dom";
import routes from "../../routes";

import { useDispatch } from "react-redux";
import { Close } from "../../redux-store/auth-model-slice";
import { welcomeBonus } from "../../redux-store/welcom-bonus-slice";
// import { loginDate } from "../../redux-store/socket-auctionId-slice";
import { useAuthState } from "context/auth-context";
import { store } from "redux-store/store";
import { setBlockedUser } from "redux-store/blocked-user-slice";

const OAuthSections = ({ isLogin, currentPAth, isAuthModel }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const history = useHistory();

  const dispatch = useDispatch();
  const { login } = useAuthState();

  const { run, isLoading } = useAxios();
  // const signInWithApple = () => {
  //   const provider = new OAuthProvider("apple.com");
  //   signInWithPopup(authentications, provider)
  //     .then((res) => {
  //       run(
  //         axios.post(api.auth.aAuth, {
  //           userName: res?._tokenResponse?.displayName || null,
  //           email: res?._tokenResponse?.email || null,
  //           idToken: res?._tokenResponse?.idToken || null,
  //           phone: res?._tokenResponse?.phoneNumber || null,
  //           oAuthType: "APPLE",
  //         })
  //       )
  //         .then((res) => {
  //           const {
  //             accessToken,
  //             refreshToken,
  //             hasCompletedProfile,
  //             isAddedBonus,
  //           } = res.data.data;
  //           if (isAddedBonus) {
  //             dispatch(welcomeBonus(true));
  //           }
  //           login({
  //             accessToken: accessToken,
  //             refreshToken: refreshToken,
  //           });
  //           window.localStorage.setItem(
  //             "hasCompletedProfile",
  //             JSON.stringify(hasCompletedProfile)
  //           );
  //           isAuthModel
  //             ? history.push(currentPAth)
  //             : history.push(routes.app.home);
  //           dispatch(Close());
  //         })
  //         .catch((err) => {
  //           console.log("google auth error --->", err);
  //           // Check if the error is a 401 unauthorized
  //           if (err?.message?.en === "You are not authorized") {
  //             // Dispatch the action to show the modal
  //             store.dispatch(setBlockedUser(true));
  //           }
  //           toast.error(
  //             selectedContent[
  //               localizationKeys.somethingWentWrongPleaseTryAgainLater
  //             ]
  //           );
  //         });
  //     })
  //     .catch((err) => {
  //       toast.error(
  //         selectedContent[
  //           localizationKeys.somethingWentWrongPleaseTryAgainLater
  //         ]
  //       );
  //     });
  // };

  const signInWithApple = () => {
    const provider = new OAuthProvider("apple.com");

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isWebView = (() => {
      const standalone = window.navigator.standalone;
      const userAgent = window.navigator.userAgent.toLowerCase();
      return (
        standalone === false ||
        window.matchMedia("(display-mode: standalone)").matches ||
        userAgent.includes("wv") ||
        userAgent.includes("applix") // Adjust this string for Applix user agent if needed
      );
    })();

    const handleAuthResponse = (res) => {
      if (!res?._tokenResponse?.idToken) {
        // No token, likely user cancelled
        return;
      }

      run(
        axios.post(api.auth.aAuth, {
          userName: res?._tokenResponse?.displayName || null,
          email: res?._tokenResponse?.email || null,
          idToken: res?._tokenResponse?.idToken || null,
          phone: res?._tokenResponse?.phoneNumber || null,
          oAuthType: "APPLE",
        }),
      )
        .then((res) => {
          const {
            accessToken,
            // refreshToken,
            hasCompletedProfile,
            isAddedBonus,
          } = res.data.data;

          // if (isAddedBonus) dispatch(welcomeBonus(true));

          login({
            accessToken,
            //  refreshToken,
          });

          localStorage.setItem(
            "hasCompletedProfile",
            JSON.stringify(hasCompletedProfile),
          );

          isAuthModel
            ? history.push(currentPAth)
            : history.push(routes.app.home);

          dispatch(Close());
        })
        .catch((err) => {
          console.log("apple auth error --->", err);
          if (err?.message?.en === "You are not authorized") {
            store.dispatch(setBlockedUser(true));
          } else {
            // Only show error toast for actual errors, not for cancellations
            toast.error(
              selectedContent[
                localizationKeys.somethingWentWrongPleaseTryAgainLater
              ],
            );
          }
        });
    };

    if (isIOS && isWebView) {
      // Fallback for iOS WebView (e.g., Applix)
      console.log("Apple sign in with redirect");
      signInWithRedirect(authentications, provider)
        .then(handleAuthResponse)
        .catch((err) => {
          console.error("Redirect login error:", err);
          // Don't show error for user cancellation
          if (
            err.code !== "auth/popup-closed-by-user" &&
            err.code !== "auth/cancelled-popup-request"
          ) {
            toast.error(
              selectedContent[
                localizationKeys.somethingWentWrongPleaseTryAgainLater
              ],
            );
          }
        });
    } else {
      // Standard popup login
      console.log("Apple sign in with pop");

      signInWithPopup(authentications, provider)
        .then(handleAuthResponse)
        .catch((err) => {
          console.error("Popup login error:", err);
          // Don't show error for user cancellation
          if (
            err.code !== "auth/popup-closed-by-user" &&
            err.code !== "auth/cancelled-popup-request"
          ) {
            toast.error(
              selectedContent[
                localizationKeys.somethingWentWrongPleaseTryAgainLater
              ],
            );
          }
        });
    }
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    signInWithPopup(authentications, provider)
      .then((res) => {
        run(
          axios.post(api.auth.aAuth, {
            userName: res?._tokenResponse?.displayName || null,
            email: res?._tokenResponse?.email || null,
            idToken: res?._tokenResponse?.idToken || null,
            phone: res?._tokenResponse?.phoneNumber || null,
            oAuthType: "GOOGLE",
          }),
        )
          .then((res) => {
            const {
              accessToken,
              // refreshToken,
              hasCompletedProfile,
              isAddedBonus,
            } = res.data.data;
            // if (isAddedBonus) {
            //   dispatch(welcomeBonus(true));
            // }
            login({
              accessToken: accessToken,
              // refreshToken: refreshToken,
            });
            window.localStorage.setItem(
              "hasCompletedProfile",
              JSON.stringify(hasCompletedProfile),
            );
            isAuthModel
              ? history.push(currentPAth)
              : history.push(routes.app.home);
            dispatch(Close());
          })
          .catch((err) => {
            console.log("google auth error --->", err);
            // Check if the error is a 401 unauthorized
            if (err?.message?.en === "You are not authorized") {
              // Dispatch the action to show the modal
              store.dispatch(setBlockedUser(true));
            }
            toast.error(
              selectedContent[
                localizationKeys.somethingWentWrongPleaseTryAgainLater
              ],
            );
          });
      })
      .catch((err) => {
        console.log("google auth error ==>:", err);
        console.log("google auth error ==>:2", err?.code);
        if (err.code !== "auth/cancelled-popup-request") {
          toast.error(
            selectedContent[
              localizationKeys.somethingWentWrongPleaseTryAgainLater
            ],
          );
        }
      });
  };

  // const signInWithFacebook = () => {
  //   console.log('face book auth test 1')
  //   const provider = new FacebookAuthProvider();
  //   signInWithPopup(authentications, provider)
  //     .then((res) => {
  //       console.log('face book auth test 2 response from facebook :',res)

  //       run(
  //         axios.post(api.auth.aAuth, {
  //           userName: res?._tokenResponse?.displayName || null,
  //           email: res?._tokenResponse?.email || null,
  //           idToken: res?._tokenResponse?.idToken || null,
  //           phone: res?._tokenResponse?.phoneNumber || null,
  //           oAuthType: "FACEBOOK",
  //         })
  //       )
  //         .then((res) => {
  //       console.log('face book auth test 3')

  //           const { accessToken, refreshToken, hasCompletedProfile, isAddedBonus } =
  //             res.data.data;
  //             console.log('isAddedBonus',isAddedBonus)
  //             if(isAddedBonus){
  //               dispatch(welcomeBonus(true))
  //             }
  //           login({
  //             accessToken: accessToken,
  //             refreshToken: refreshToken,
  //           });
  //           window.localStorage.setItem(
  //             "hasCompletedProfile",
  //             JSON.stringify(hasCompletedProfile)
  //           );
  //           isAuthModel
  //             ? history.push(currentPAth)
  //             : history.push(routes.app.home);
  //           dispatch(Close());
  //         })
  //         .catch((err) => {
  //   console.log('face book auth test 4 error 1:',err)

  //           toast.error(
  //             selectedContent[
  //               localizationKeys.somethingWentWrongPleaseTryAgainLater
  //             ]
  //           );
  //         });
  //     })
  //     .catch((err) => {
  //   console.log('face book auth test 4 error 2:',err)

  //       toast.error(
  //         selectedContent[
  //           localizationKeys.somethingWentWrongPleaseTryAgainLater
  //         ]
  //       );
  //     });
  // };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 md:px-10 h-full mt-6 md:mt-0">
      <div className="w-[328px] mx-auto flex flex-col items-center">
        <div className="mb-8 md:mb-12 lg:-mt-32 md:-mt-20 mt-0">
          <img
            src={allatreLogoWhite}
            alt="allatreLogoWhite"
            className="w-28 md:w-32"
          />
        </div>

        <p className="hidden md:block text-yellow text-xs font-bold tracking-[0.2em] uppercase mb-4 w-full">
          {isLogin
            ? selectedContent[localizationKeys.privateAccess]
            : selectedContent[localizationKeys.createFreeAccount]}
        </p>

        <p className="hidden md:block text-primary-light text-lg mb-10 w-full leading-relaxed font-serif">
          {isLogin
            ? selectedContent[
                localizationKeys.signInToAccessYourExclusiveCollection
              ]
            : selectedContent[localizationKeys.beginYourCollectionJourney]}
        </p>

        <Loginbutton
          icon={<FaApple size={20} className="text-yellow" />}
          onClick={signInWithApple}
          text={isLogin ? "Continue with Apple" : "Continue with Apple"}
        />
        <Loginbutton
          icon={<FaGoogle size={18} className="text-yellow" />}
          onClick={signInWithGoogle}
          text={isLogin ? "Continue with Google" : "Continue with Google"}
        />
      </div>
    </div>
  );
};

export const Loginbutton = ({ icon, text, onClick }) => {
  return (
    <div className="w-full flex justify-center md:justify-center">
      <button
        className="flex items-center justify-center gap-4 w-[328px] h-[48px] rounded-md bg-[#39485C] hover:bg-[#4a5c75] text-white my-2 transition-colors duration-300 shadow-sm border border-[#4a5c75]"
        onClick={onClick}
      >
        <div className="flex justify-center items-center">{icon}</div>
        <p className="text-[10.5px] font-bold tracking-[0.15em] uppercase m-0 pt-[2px]">
          {text}
        </p>
      </button>
    </div>
  );
};

export default OAuthSections;
