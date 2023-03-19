import React from "react";
import { Route, Switch } from "react-router-dom";
import ProfileSettings from "../../../components/profile-components/profile-settings";
import ProfileSideBare from "../../../components/profile-components/profile-side-bare";
import routes from "../../../routes";

const ProfileLayouts = () => {
  return (
    <div className="mt-44 ">
      <ProfileSideBare />
      <div className="ml-[250px]">
        <Switch>
          <Route
            path={routes.profile.profileSettings}
            component={ProfileSettings}
          />
        </Switch>
      </div>
    </div>
  );
};

export default ProfileLayouts;
