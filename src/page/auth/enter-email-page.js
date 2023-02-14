import React from "react";

import { Tab } from "semantic-ui-react";
import useTab from "../../hooks/use-tab";
import routes from "../../routes";

import EnterEmail from "../../components/O-Auth-components/enter-email";

import allatreLogoWhite from "../../../src/assets/logo/allatre-logo-white.svg";
import oAuthFooterImg from "../../../src/assets/img/o-auth-path-footer.svg";
import oAuthImg from "../../../src/assets/img/o-auth-img.png";

const EnterEmailPage = () => {
  const panes = [
    {
      menuItem: "Enter E-mail",
      routes: routes.auth.enterEmail,
      render: () => (
        <div>
          <Tab.Pane className="border-none h-full  animate-in pt-2 flex justify-center ">
            <EnterEmail />
          </Tab.Pane>
        </div>
      ),
    },
  ];
  const { activeIndex, onTabChange } = useTab({ panes });
  return (
    <div className="animate-in  h-screen">
      <div>
        <div className="">
          <div className="relative">
            <img
              className="w-full h-full object-cover"
              src={oAuthImg}
              alt="oAuthImg"
            />
            <img
              className="absolute z-50 top-1/3 ml-40 mt-5 "
              src={allatreLogoWhite}
              alt="allatreLogoWhite"
            />
          </div>
          <div
            className={` mx-auto h-auto w-full relative bottom-[95px] edit-For-reset-password-page-tabs m-0 `}
          >
            <Tab
              menu={{
                secondary: true,
                pointing: true,
                className: "flex flex-wrap text-xl pl-40 m-0",
              }}
              activeIndex={activeIndex}
              onTabChange={onTabChange}
              panes={panes}
            />
          </div>
          <img
            className="w-full fixed bottom-0 -z-10 "
            src={oAuthFooterImg}
            alt="oAuthFooterImg"
          />
        </div>
      </div>
    </div>
  );
};

export default EnterEmailPage;
