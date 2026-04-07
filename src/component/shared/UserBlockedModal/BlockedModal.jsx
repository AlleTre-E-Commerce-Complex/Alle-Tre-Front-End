import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { setBlockedUser } from "redux-store/blocked-user-slice";
import routes from "routes";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import DropdownLang from "../header-app/dropdown-lang";

const BlockedModal = () => {
  const dispatch = useDispatch();
  const isBlocked = useSelector((state) => state.blockedUser.isBlocked);
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  if (!isBlocked) return null;

  const handleClose = () => {
    dispatch(setBlockedUser(false));
    history.push(routes.app.home);
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[99999] transition-all duration-500">
      <div 
        dir={lang === "ar" ? "rtl" : "ltr"}
        className={`relative overflow-hidden bg-background p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 max-w-md w-full mx-4 animate-fade-in ${lang === "ar" ? "font-serifAR" : "font-serifEN"}`}
      >
        {/* Subtle decorative background element */}
        <div className={`absolute -top-24 w-48 h-48 bg-red/5 dark:bg-red/10 rounded-xl blur-3xl pointer-events-none ${lang === "ar" ? "-right-24" : "-left-24"}`} />
        
        <div className="flex flex-col items-center relative">
          <div className={`absolute ${lang === "ar" ? "left-0" : "right-0"}`}>
            <DropdownLang className="bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-md transition-all duration-300 border border-gray-100 dark:border-white/5 text-sm" />
          </div>

          <div className="w-20 h-20 bg-red/10 dark:bg-red/20 rounded-xl flex items-center justify-center mb-6 mt-10 animate-bounce-subtle">
            <svg className="w-10 h-10 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-primary dark:text-white text-center mb-3">
            {selectedContent[localizationKeys.accessBlocked]}
          </h2>
          
          <p className="text-gray dark:text-gray-dark text-center text-base font-normal leading-relaxed mb-8 max-w-[85%]">
            {selectedContent[localizationKeys.yourAccountIsBlockedByAdminPleaseContactSupport]}
          </p>

          <div className="w-full space-y-4 bg-gray-50 dark:bg-white/5 p-6 rounded-xl mb-8 border border-gray-100 dark:border-white/5">
            <div className={`flex items-center gap-4 text-primary dark:text-gray-dark ${lang === "ar" ? "flex-row-reverse text-right" : "flex-row"}`}>
              <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <svg className="w-5 h-5 text-gray dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <a dir="ltr" href="tel:+971501400414" className="text-base font-medium hover:text-red transition-colors">+971 501400414</a>
            </div>
            
            <div className={`flex items-center gap-4 text-primary dark:text-gray-dark ${lang === "ar" ? "flex-row-reverse text-right" : "flex-row"}`}>
              <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <svg className="w-5 h-5 text-gray dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <a dir="ltr" href="mailto:info@3arbon.com" className="text-base font-medium hover:text-red transition-colors">info@3arbon.com</a>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-yellow text-primary py-3.5 rounded-xl text-sm font-bold uppercase tracking-[2px] transition-all duration-300 ease-in-out hover:bg-yellow-dark shadow-lg shadow-yellow/20 active:scale-[0.98] focus:outline-none"
          >
            {selectedContent[localizationKeys.close]}
          </button>
        </div>
      </div>
    </div>
  );

};

export default BlockedModal;
