import React from "react";

import ProfileSettings from "./profile-settings";
import ProfileSideBare from "../../../components/profile-components/profile-side-bare";

import { Route, Switch } from "react-router-dom";
import routes from "../../../routes";
import MyAuctions from "./my-auctions";

const ProfileLayouts = () => {
  return (
    <div className="mt-44 ">
      <ProfileSideBare />
      <div className="ml-[250px]">
        <Switch>
          <Route
            path={routes.app.profile.profileSettings}
            component={ProfileSettings}
          />
          <Route
            path={routes.app.profile.myAuctions.default}
            component={MyAuctions}
          />
        </Switch>
      </div>
    </div>
  );
};

export default ProfileLayouts;
