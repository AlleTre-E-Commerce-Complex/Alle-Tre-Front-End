import React, { useEffect, useState } from "react";
import { Modal, Button, Dropdown } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import api from "api";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { completePaymentData } from "redux-store/complete-payment-slice";
import routes from "routes";
import localizationKeys from "../../../localization/localization-keys";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";

const DeliverySelectingModal = ({
  open,
  setOpen,
  auctionId,
  paymentType,
  lastPrice,
  sellerLocation,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { run, isLoading } = useAxios([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const deliveryOptions = [
    { key: "PICKUP", value: "PICKUP", text: "Pick up yourself" },
    { key: "DELIVERY", value: "DELIVERY", text: "Delivery by company" },
  ];

  const deliveryDescriptions = {
    PICKUP:
      "The buyer is responsible for collecting the item. No delivery fees apply.",
    DELIVERY:
      "The company will arrange delivery, and the buyer will be responsible for the associated delivery fee.",
  };

  const handleDropdownChange = (e, { value }) => {
    setSelectedOption(value);
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      toast.error("Please select a delivery type before proceeding.");
      return;
    }
    try {
      run(
        authAxios.put(`${api.app.auctions.setDeliveryType(auctionId)}`, {
          deliveryType: selectedOption,
        })
      )
        .then((res) => {
          console.log("DeliverySelectingModal", res);
          if (res.data.success) {
            toast.success("Delivery type updated successfully");
            setOpen(false);
            if (paymentType === "PENDING_BIDDING") {
              history.push(routes.app.profile.myBids.completePayment);
              dispatch(
                completePaymentData({
                  auctionsId: auctionId,
                  lastPrice: lastPrice,
                })
              );
            } else if (paymentType === "BUY_NOW") {
              history.push(routes.app.buyNow(auctionId));
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error submitting delivery type:", error);
    }
  };

  return (
    <div>
      <Modal
        className="sm:w-[506px] w-full h-auto bg-transparent scale-in"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          <LodingTestAllatre />
        </Dimmer>

        <div className="w-full h-auto rounded-xl bg-white border-2 border-primary px-2">
          <div className="text-black mt-2 text-center font-semibold py-2 text-xl">
            {selectedContent[localizationKeys.selectTheDeliveryType]}
          </div>

          <div className="px-3 pt-4 pb-2">
            <Dropdown
              placeholder="Select a payment method"
              fluid
              selection
              options={deliveryOptions}
              onChange={handleDropdownChange}
              value={selectedOption}
            />
          </div>
          {selectedOption && (
            <div className="px-3 pb-2 text-left text-red-700 font-semibold text-sm">
              <p>{deliveryDescriptions[selectedOption]}</p>
            </div>
          )}
          {/* Seller Address */}
          <div className="px-3 py-4">
            <div className="bg-white  rounded-lg p-1 shadow-md">
              <h4 className="text-lg font-semibold text-gray-veryDark mb-4 flex items-center">
                {selectedContent[localizationKeys.sellerAddress]}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse ">
                  <tbody>
                    <tr className="bg-gray-100">
                      <td className="p-3 font-medium border border-gray-300 ">
                        {selectedContent[localizationKeys.addressLabel]}:
                      </td>
                      <td className="p-3 border border-gray-300">
                        {sellerLocation?.addressLabel}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium border border-gray-300">
                        {selectedContent[localizationKeys.address]}:
                      </td>
                      <td className="p-3 border border-gray-300">
                        {sellerLocation?.address}:
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="p-3 font-medium border border-gray-300">
                        {selectedContent[localizationKeys.city]}:
                      </td>
                      <td className="p-3 border border-gray-300">
                        {sellerLocation?.city?.nameEn}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium border border-gray-300">
                        {selectedContent[localizationKeys.country]}:
                      </td>
                      <td className="p-3 border border-gray-300">
                        {sellerLocation?.country?.nameEn}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="p-3 font-medium border border-gray-300">
                        {selectedContent[localizationKeys.contactNumber]}:
                      </td>
                      <td className="p-3 border border-gray-300 text-blue-500 hover:underline">
                        {sellerLocation?.phone}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-full  px-3 py-2">
            {sellerLocation?.lat &&
            sellerLocation?.lng &&
            selectedOption === "PICKUP" ? (
              <iframe
                title="Google Map"
                className="w-full h-80 mt-4 rounded-lg"
                src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
                  `${sellerLocation.lat},${sellerLocation.lng}`
                )}&key=${process.env.REACT_APP_GOOGLE_MAP_SECRET_KEY}`}
                allowFullScreen
              />
            ) : null}
          </div>

          {/* Submit Button */}
          <div className="px-3 py-2 text-end mb-4">
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading || !selectedOption}
              className="bg-primary text-white "
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeliverySelectingModal;
