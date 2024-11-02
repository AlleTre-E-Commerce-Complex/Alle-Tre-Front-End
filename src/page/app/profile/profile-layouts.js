import React, { useState } from "react";
import MyAuctions from "./my-auctions";
import ProfileSettings from "./profile-settings";
import Watshlist from "./watshlist";
import ProfileSideBare from "../../../component/profile-components/profile-side-bare";
import routes from "../../../routes";
import { BiMenuAltLeft } from "react-icons/bi";
import { Route, Switch } from "react-router-dom";
import MyBids from "./my-bids";
import MyBidsCompletePayment from "../../../component/profile-components/my-bids-complete-payment";
import Purchased from "./purchased";
import Wallet from "./Wallet";

const ProfileLayouts = () => {
  const [sid, SetSid] = useState(false);

  return (
    <div className="mt-44 max-w-[1440px] mx-auto ">
      <ProfileSideBare SetSid={SetSid} sid={sid} />
      <button
        className="border-[1px] fixed bg-white  border-gray-dark mt-9 text-gray-dark rounded-full md:hidden block mx-4 mb-4 z-20"
        onClick={() => SetSid(true)}
      >
        <BiMenuAltLeft size={25} className="m-1" />
      </button>
      <div className="md:ltr:ml-[250px] md:rtl:mr-[250px] rtl:mr-0 ltr:ml-0 ">
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
          <Route path={routes.app.profile.watchlist} component={Watshlist} />
          <Route path={routes.app.profile.purchased} component={Purchased} />
          <Route path={routes.app.profile.wallet} component={Wallet} />
        </Switch>
      </div>
    </div>
  );
};

export default ProfileLayouts;
