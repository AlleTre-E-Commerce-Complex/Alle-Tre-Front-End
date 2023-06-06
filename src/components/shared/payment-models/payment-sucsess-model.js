import { Modal } from "semantic-ui-react";

import localizationKeys from "../../../localization/localization-keys";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import PaymentSucsess from "../lotties-file/payment-sucsess";
import routes from "../../../routes";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const PaymentSucsessModel = ({ open, setOpen, TextButton, onReload }) => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <Modal
      className="sm:w-[506px] w-full h-auto bg-transparent scale-in "
      onClose={() => {
        setOpen(false);
      }}
      open={open}
    >
      <div className="sm:w-[506px] w-full h-auto border-2 border-primary rounded-2xl bg-background pb-8 pt-2">
        <div>
          <PaymentSucsess />
        </div>
        <h1 className="text-black font-semibold text-base text-center pt-4">
          Payment success
        </h1>
        <p className="text-gray-dark text-center mx-20 text-base font-normal pt-4">
          Your deposit has been successfully transferred, and your auction is
          active now
        </p>
        <div className="flex justify-center gap-x-10 pt-8">
          <button
            onClick={() => {
              pathname.endsWith(`${pathname}/paymentSucsess`)
                ? history.push(pathname)
                : history.push(routes.app.profile.myAuctions.active);
            }}
            className="border-primary text-primary border-[1px] w-[136px] h-[48px] rounded-lg text-base font-normal "
          >
            View auction
          </button>
          <button
            onClick={() => history.push(routes.app.home)}
            className="bg-primary text-white w-[136px] h-[48px] rounded-lg text-base font-normal"
          >
            Back to home
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentSucsessModel;
