import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import userProfileicon from "../../../src/assets/icons/user-Profile-icon.png";
import routes from "../../routes";

const ProfileSideBare = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const ProfileData = useSelector((state) => state.profileData.PofileData);
  console.log(ProfileData);
  return (
    <div className=" h-screen fixed w-[255px] ">
      {/* img */}
      <div className="flex gap-x-4 mx-14 pb-8 pt-3">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={ProfileData?.img ? ProfileData?.img : userProfileicon}
          alt="userProfileicon"
        />
        <div className="pt-1">
          <h1 className="text-base text-gray-dark font-medium">
            {ProfileData?.name}
          </h1>
          <p className="text-xs text-gray-med font-normal">Online</p>
        </div>
      </div>
      {/* content */}
      <div>
        <NavLink
          title="Profile Settings"
          isActive={
            pathname.length === 1 ||
            pathname.startsWith(routes.profile.profileSettings)
          }
          onClick={() => history.push(routes.profile.profileSettings)}
        />
        <NavLink
          title="My Auctions"
          isActive={
            pathname.length === 1 ||
            pathname.startsWith(routes.profile.myAuctions)
          }
          onClick={() => history.push(routes.profile.myAuctions)}
        />
      </div>
    </div>
  );
};

export const NavLink = ({ title, onClick, isActive }) => {
  return (
    <div>
      <p
        onClick={onClick}
        className={`${
          isActive
            ? "bg-primary-light/10 text-primary mx-0 px-10  "
            : "mx-10 px-4 border-b-gray-veryLight border-b-[1px] "
        } text-base text-gray-dark font-normal py-5 cursor-pointer flex`}
      >
        <p
          className={`${
            isActive ? "bg-primary w-2 h-2 rounded-full mt-1.5 mx-4" : ""
          } translate delay-150 duration-150 `}
        ></p>
        <p>{title}</p>
      </p>
    </div>
  );
};
export default ProfileSideBare;
