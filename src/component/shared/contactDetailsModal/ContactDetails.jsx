import useAxios from "hooks/use-axios";
import React, { useEffect, useState } from "react";
import { Dimmer, Modal } from "semantic-ui-react";
import { authAxios } from "config/axios-config";
import api from "api";
import { useAuthState } from "context/auth-context";
import LodingTestAllatre from "../lotties-file/loding-test-allatre";
import content from "localization/content";
import { useLanguage } from "context/language-context";
import localizationKeys from "localization/localization-keys";

const ContactDetails = ({ open, onClose, userType, auctionId }) => {
  const { run, isLoading } = useAxios([]);
  const { user } = useAuthState();
  const [location, setLocation] = useState("");
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const isArabic = lang === "ar";

  useEffect(() => {
    function fetchUserContact() {
      try {
        if (userType === "SELLER") {
          run(
            authAxios
              .get(`${api.app.auctions.getSellerLocation(auctionId)}`)
              .then((res) => {
                setLocation(res?.data?.data);
              })
          );
        } else if (userType === "BUYER") {
          run(
            authAxios
              .get(`${api.app.auctions.getBuyerLocation(auctionId)}`)
              .then((res) => {
                setLocation(res?.data?.data);
              })
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserContact();
  }, [run, userType, auctionId, user?.id]);
  return (
    <Modal
      className="rounded-2xl sm:w-[500px] w-full h-auto bg-background scale-in"
      onClose={onClose}
      open={open}
    >
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>

      <div className="sm:w-[500px] w-full h-auto bg-background rounded-2xl border-2 border-solid border-primary pb-6 shadow-xl">
        <div className="rounded-t-2xl text-black font-semibold p-4 ml-6">
          <h1
            className={`text-xl mt-4 ${isArabic ? " text-right" : "text-left"}`}
          >
            {
              selectedContent[
                userType === "SELLER"
                  ? localizationKeys.sellerContactDetails
                  : localizationKeys.buyerContactDetails
              ]
            }
          </h1>
        </div>

        <div className="mx-6 mt-4">
          <table className="w-full text-left text-md font-normal text-gray-dark">
            <tbody>
              <tr>
                <td className="py-2 font-semibold">
                  {selectedContent[localizationKeys.userName]}:
                </td>
                <td className="py-2">{location.userName}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">
                  {selectedContent[localizationKeys.email]}:
                </td>
                <td className="py-2">{location.email}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">
                  {selectedContent[localizationKeys.address]}:
                </td>
                <td className="py-2">{location.address}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">
                  {selectedContent[localizationKeys.addressLabel]}:
                </td>
                <td className="py-2">{location.addressLabel}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">
                  {selectedContent[localizationKeys.country]}:
                </td>
                <td className="py-2">{location?.country?.nameEn}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">
                  {selectedContent[localizationKeys.city]}:
                </td>
                <td className="py-2">{location?.city?.nameEn}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">
                  {selectedContent[localizationKeys.phoneNumber]}:
                </td>
                <td className="py-2 text-left">
                  <span dir="ltr">{location.phone}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-x-6 p-4">
          <button
            onClick={onClose}
            className="w-[120px] h-[40px] text-sm font-bold text-white rounded-lg bg-primary border border-primary shadow-lg hover:bg-primary-dark hover:text-white"
          >
            {selectedContent[localizationKeys.cancel]}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(ContactDetails);
