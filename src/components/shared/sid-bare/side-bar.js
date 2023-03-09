import React from "react";
import { SidebarPusher } from "semantic-ui-react";

const Sidebar = ({ HandleSid, sid }) => {
  return (
    <div>
      <div
        className={
          sid
            ? "fixed z-[100] ltr:left-0 top-0 rtl:right-0 w-full h-full ease-in-out duration-500 "
            : "ease-out duration-500 fixed ltr:left-[-100%] rtl:right-[-100%] z-[500] bottom-0"
        }
      >
        <div className="flex justify-between ">
          <div className="bg-secondary w-[600px] h-screen ">jbfvjhbdfj</div>
          <button
            onClick={HandleSid}
            className={sid ? "w-full" : "hidden"}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
