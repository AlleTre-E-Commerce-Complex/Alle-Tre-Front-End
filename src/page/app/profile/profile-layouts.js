import React, { useState } from "react";
import MyAuctions from "./my-auctions";
import ProfileSettings from "./profile-settings";
import Watshlist from "./watshlist";
import ProfileSideBare from "../../../component/profile-components/profile-side-bare";
import routes from "../../../routes";
import { Route, Switch } from "react-router-dom";
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
    <div className="mt-44 px-2 md:px-4 mx-auto">
      <ProfileSideBare SetSid={SetSid} sid={sid} />

      <div className="md:ltr:ml-[250px] md:rtl:mr-[250px] rtl:mr-0 ltr:ml-0">
        <div className="flex justify-end md:hidden">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="mx-2  border-[1px] border-primary text-red-600 flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition duration-200"
          >
            <MdLogout className="text-xl" />
            <span className="font-medium">
              {selectedContent[localizationKeys.logout]}
            </span>
          </button>
        </div>


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
          <Route path={routes.app.profile.myBids.default} component={MyBids} />
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

      <LogoutModal
        open={logoutModalOpen}
        setOpen={setLogoutModalOpen}
        onLogout={onLogout}
      />
    </div>
  );
};

export default ProfileLayouts;
