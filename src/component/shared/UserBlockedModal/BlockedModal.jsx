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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999]">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-500 max-w-md w-full mx-4 animate-fade-in">
        <div className="flex flex-col items-center relative">
          <div className="absolute top-0 right-0">
            <DropdownLang className="bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-300 border border-gray-200" />
          </div>

          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mt-12">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            {selectedContent[localizationKeys.accessBlocked]}
          </h2>
          
          <p className="text-gray-700 text-center text-base mb-6">
            {selectedContent[localizationKeys.yourAccountIsBlockedByAdminPleaseContactSupport]}
          </p>

          <div className="w-full space-y-3 bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+97172663004" className="hover:text-primary transition-colors">+971 72663004</a>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@alletre.com" className="hover:text-primary transition-colors">info@alletre.com</a>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="bg-primary text-white px-8 py-2.5 rounded-lg text-base font-medium transition-all duration-300 ease-in-out hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {selectedContent[localizationKeys.close]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedModal;
