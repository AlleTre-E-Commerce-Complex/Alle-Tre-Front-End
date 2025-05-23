import React from "react";
import { Modal, Tab } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { Open, Close } from "../../../redux-store/auth-model-slice";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LogIn from "../../O-Auth-components/log-in";
import SignUp from "../../O-Auth-components/sign-up";
import oAuthFooterImg from "../../../../src/assets/img/o-auth-path-footer.svg";
import routes from "routes";

function AuthModel({ currentPAth }) {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];

  const AuthModelTggle = useSelector(
    (state) => state.toggle.enableOpenAuthModel
  );
  const dispatch = useDispatch();

  const panes = [
    {
      menuItem: `${selectedContent[localizationKeys.login]}`,
      render: () => (
        <div>
          <Tab.Pane className="border-[2px] border-primary h-auto py-32 rounded-2xl animate-in  pt-10 flex justify-center z-30  ">
            <LogIn currentPAth={currentPAth} isAuthModel />
            <img
              className="w-full object-cover h-28 fixed bottom-0  -z-10 "
              src={oAuthFooterImg}
              alt="oAuthFooterImg"
            />
          </Tab.Pane>
        </div>
      ),
    },

    {
      menuItem: `${selectedContent[localizationKeys.signup]}`,
      render: () => (
        <div>
          <Tab.Pane className="border-[2px] border-primary h-auto py-7 rounded-2xl animate-in md:pt-10 flex justify-center z-30 ">
            <SignUp currentPAth={currentPAth} isAuthModel />
            <img
              className="w-full object-cover h-28 fixed bottom-0 -z-10 "
              src={oAuthFooterImg}
              alt="oAuthFooterImg"
            />
          </Tab.Pane>
        </div>
      ),
    },
  ];
  return (
    <Modal
      className="m-0 p-0 md:w-[824px] w-auto h-[493px] sm:h-auto bg-transparent shadow-none rounded-2xl scale-in overflow-y-scroll scrollbar-hide "
      onClose={() => {
        dispatch(Close());
        if (window.location.pathname === "/alletre/profile/my-bids/pending") {
          window.location.href = `${routes.app.home}?page=1&perPage=24&productPage=1&auctionPage=1`;
        }
      }}
      
      onOpen={() => dispatch(Open())}
      open={AuthModelTggle}
    >
      <div className="w-full h-auto rounded-2xl ">
        <div
          className={` mx-auto w-full h-full  bottom-[50px] edit-For-o-auth-tabs m-0 `}
        >
          <Tab
            menu={{
              secondary: true,
              pointing: true,
              className:
                "flex flex-wrap text-xl ltr:md:pl-28  rtl:md:pr-28  ltr:pl-2 rtl:pr-2 m-0 border-none  ",
            }}
            panes={panes}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AuthModel;
