import React, { useState } from "react";
import { Modal } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { Open, Close } from "../../../redux-store/auth-model-slice";
import LogIn from "../../O-Auth-components/log-in";
import SignUp from "../../O-Auth-components/sign-up";
import routes from "routes";

function AuthModel({ currentPAth }) {
  const [isLoginView, setIsLoginView] = useState(true);

  const AuthModelTggle = useSelector(
    (state) => state.toggle.enableOpenAuthModel,
  );
  const dispatch = useDispatch();

  return (
    <Modal
      className="m-0 p-0 md:w-[824px] w-[95%] h-auto md:h-[550px] bg-[#2A3A54] shadow-2xl shadow-black/50 rounded-2xl scale-in overflow-y-scroll md:overflow-visible scrollbar-hide border border-[#39485C]"
      onClose={() => {
        dispatch(Close());
        if (window.location.pathname === routes.app.profile.myBids.pending) {
          window.location.href = routes.app.home;
        }
      }}
      onOpen={() => {
        dispatch(Open());
        setIsLoginView(true); // reset to login view on open
      }}
      open={AuthModelTggle}
    >
      <div className="w-full h-full rounded-2xl bg-[#2A3A54] flex">
        {isLoginView ? (
          <LogIn
            currentPAth={currentPAth}
            isAuthModel
            onToggleView={() => setIsLoginView(false)}
          />
        ) : (
          <SignUp
            currentPAth={currentPAth}
            isAuthModel
            onToggleView={() => setIsLoginView(true)}
          />
        )}
      </div>
    </Modal>
  );
}

export default AuthModel;
