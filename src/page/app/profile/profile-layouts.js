import React, { useState } from "react";

import MyAuctions from "./my-auctions";
import ProfileSettings from "./profile-settings";
import Watshlist from "../../../components/profile-components/watshlist";
import ProfileSideBare from "../../../components/profile-components/profile-side-bare";

import routes from "../../../routes";
import { BiMenuAltLeft } from "react-icons/bi";
import { Route, Switch } from "react-router-dom";

const ProfileLayouts = () => {
  const [sid, SetSid] = useState(false);

  return (
    <div className="mt-44 max-w-[1440px] mx-auto ">
      <ProfileSideBare SetSid={SetSid} sid={sid} />
      <button
        className="border-[1px] border-gray-dark text-gray-dark rounded-full md:hidden block mx-4 mb-4"
        onClick={() => SetSid(true)}
      >
        <BiMenuAltLeft size={25} className="m-1" />
      </button>
      <div className="md:ltr:ml-[250px]  md:rtl:mr-[250px]rtl:mr-0 ltr:ml-0 ">
        <Switch>
          <Route
            path={routes.app.profile.profileSettings}
            component={ProfileSettings}
          />
          <Route
            path={routes.app.profile.myAuctions.default}
            component={MyAuctions}
          />
          <Route path={routes.app.profile.watchlist} component={Watshlist} />
        </Switch>
      </div>
    </div>
  );
};

export default ProfileLayouts;
