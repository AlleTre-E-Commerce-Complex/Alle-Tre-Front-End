import React, { useState } from "react";
import MyAuctions from "./my-auctions";
import ProfileSettings from "./profile-settings";
import Watshlist from "./watshlist";
import ProfileSideBare from "../../../component/profile-components/profile-side-bare";
import routes from "../../../routes";
import { Route, Switch, useLocation } from "react-router-dom";
import MyBids from "./my-bids";
import MyBidsCompletePayment from "../../../component/profile-components/my-bids-complete-payment";
import Purchased from "./purchased";
import Wallet from "./Wallet";
import Notifications from "./Notifications";
import MyProducts from "./MyProducts";
import { MdLogout } from "react-icons/md";
import LogoutModal from "../../../component/shared/logout-modal/logout-modal";
import { useAuthState } from "../../../context/auth-context";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

const ProfileLayouts = () => {
  const [sid, SetSid] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { logout } = useAuthState();
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const onLogout = () => {
    setLogoutModalOpen(false);
    logout();
  };

  return (
    <div className="pt-44 px-2 md:px-4 mx-auto min-h-screen dark:bg-primary transition-colors duration-300">
      <ProfileSideBare SetSid={SetSid} sid={sid} />

      <div className="md:ltr:ml-[250px] md:rtl:mr-[250px] rtl:mr-0 ltr:ml-0 md:px-6">
        <div className="bg-white dark:bg-primary-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 min-h-[calc(100vh-14rem)] mb-8 ">
          {useLocation().pathname === routes.app.profile.profileSettings && (
            <div className="flex justify-end md:hidden mb-6">
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-300"
              >
                <MdLogout className="text-xl" />
                <span>{selectedContent[localizationKeys.logout]}</span>
              </button>
            </div>
          )}

          <Switch>
            <Route
              path={routes.app.profile.myBids.completePayment}
              component={MyBidsCompletePayment}
            />

            <Route
              path={routes.app.profile.profileSettings}
              component={ProfileSettings}
            />
            <Route
              path={routes.app.profile.myAuctions.default}
              component={MyAuctions}
            />
            <Route
              path={routes.app.profile.myBids.default}
              component={MyBids}
            />
            <Route
              path={routes.app.profile.myProducts.default}
              component={MyProducts}
            />
            <Route path={routes.app.profile.watchlist} component={Watshlist} />
            <Route path={routes.app.profile.purchased} component={Purchased} />
            <Route path={routes.app.profile.wallet} component={Wallet} />
            <Route
              path={routes.app.profile.notifications}
              component={Notifications}
            />
          </Switch>
        </div>
      </div>

      <LogoutModal
        open={logoutModalOpen}
        setOpen={setLogoutModalOpen}
        onLogout={onLogout}
      />
    </div>
  );
};

export default ProfileLayouts;
