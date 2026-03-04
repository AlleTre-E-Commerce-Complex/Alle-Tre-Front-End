import React from "react";
import "./nav-link-header.css";

const NavLinkHeader = ({ title, onClick, isActive, className }) => {
  return (
    <div>
      <p
        onClick={onClick}
        className={`${
          isActive
            ? "active-underline-animation text-yellow font-bold"
            : "hover-underline-animation text-primary-light hover:text-white"
        } lg:text-base text-xs font-bold  transition-colors duration-200 ${className} `}
      >
        {title}
      </p>
    </div>
  );
};

export default NavLinkHeader;
