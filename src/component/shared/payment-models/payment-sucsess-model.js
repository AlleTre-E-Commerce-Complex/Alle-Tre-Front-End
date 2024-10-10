import { Modal } from "semantic-ui-react";

import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import routes from "../../../routes";
import PaymentSucsess from "../lotties-file/payment-sucsess";

const PaymentSucsessModel = ({ open, setOpen, TextButton, onReload }) => {
  const [lang, setLang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { pathname } = useLocation();
  const bidAmountPathName = useSelector((state) => state?.bidAmount);
  return (
    <Modal
      className="sm:w-[506px] w-full h-auto bg-transparent scale-in "
      onClose={() => {setOpen(false);}}
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
              pathname.endsWith(`${routes.app.home}/payDeposite`)
                ? history.goBack(history.goBack())
                : pathname.endsWith(`${routes.app.home}/complete-pay`)
                ? history.push(routes.app.profile.myBids.default)
                : pathname.endsWith(`${routes.app.home}/buyNow`)
                ? history.push(routes.app.profile.purchased)
                : history.push(routes.app.profile.myAuctions.active);
            }}
            className="border-primary text-primary border-[1px] w-[136px] h-[48px] rounded-lg text-base font-normal "
          >
            {pathname.endsWith(`${routes.app.home}/complete-pay`)
              ? " View Bids"
              : pathname.endsWith(`${routes.app.home}/buyNow`)
              ? "View Purchased"
              : " View auction"}
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
