import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { setBlockedUser } from "redux-store/blocked-user-slice";
import routes from "routes";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";

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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[99999]">
      <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-primary max-w-sm w-full">
        <h2 className="text-black font-semibold text-xl text-center mt-4 mb-4">
          {selectedContent[localizationKeys.accessBlocked]}
        </h2>
        <p className="text-gray-700 text-center mx-4 text-base font-normal mb-6">
          {
            selectedContent[
              localizationKeys.yourAccountIsBlockedByAdminPleaseContactSupport
            ]
          }
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClose}
            className="bg-primary text-white w-[120px] h-[40px] rounded-lg text-base font-medium transition-all duration-300 ease-in-out hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {selectedContent[localizationKeys.close]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedModal;
