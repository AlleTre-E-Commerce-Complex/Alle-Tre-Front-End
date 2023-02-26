import React from "react";
import "./nav-link-header.css";

const NavLinkHeader = ({ title, onClick, isActive }) => {
  return (
    <div>
      <p
        onClick={onClick}
        className={`${
          isActive ? "active-underline-animation" : "hover-underline-animation"
        } text-base font-normal `}
      >
        {title}
      </p>
    </div>
  );
};

export default NavLinkHeader;
