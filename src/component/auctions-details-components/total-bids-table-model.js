import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Dimmer, Loader, Modal, Table } from "semantic-ui-react";
import api from "../../api";
import { authAxios, axios } from "../../config/axios-config";
import { useAuthState } from "../../context/auth-context";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import userProfileicon from "../../../src/assets/icons/user-Profile-icon.png";
import backArrowSecandryColor from "../../../src/assets/icons/back_arrow_secandry_color.png";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/format-currency";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import { FaCrown } from "react-icons/fa6";

const TotalBidsTableModel = ({ open, setOpen, auctionsIdB }) => {
  const { user } = useAuthState();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const { auctionId } = useParams();
  const [userID, setUserID] = useState();
  const [totalBids, setTotalBidse] = useState();
  const [openSecondModel, setOpenSecondModel] = useState(false);
  const { run, isLoading } = useAxios([]);

  const loginData = useSelector((state) => state?.loginDate?.loginDate);

  useEffect(() => {
    if (user) {
      if (auctionId) {
        run(
          authAxios.get(api.app.auctions.totalBids(auctionId)).then((res) => {
            setTotalBidse(res?.data?.data);
          })
        );
      } else if (auctionsIdB) {
        run(
          authAxios.get(api.app.auctions.totalBids(auctionsIdB)).then((res) => {
            setTotalBidse(res?.data?.data);
          })
        );
      }
    } else if (auctionId) {
      run(
        axios.get(api.app.auctions.totalBids(auctionId)).then((res) => {
          setTotalBidse(res?.data?.data);
        })
      );
    }
  }, [auctionId, auctionsIdB]);

  return (
    <Modal
      className="w-[calc(100%-32px)] mx-auto md:w-[970px] h-[473px] rounded-2xl bg-white border-2 border-primary"
      onClose={() => {
        setOpen(false);
        document.body.style.overflow = "auto";
      }}
      onOpen={() => {
        setOpen(true);
        document.body.style.overflow = "hidden";
      }}
      open={open}
    >
      {/* Fixed Header & Close Button */}
      <div className="relative bg-white border-b border-gray-200 p-4 rounded-t-2xl">
        <button
          onClick={() => {
            setOpen(false);
            document.body.style.overflow = "auto";
          }}
          className={`absolute top-4 ${
            lang === "ar" ? "left-4" : "right-4"
          } w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-primary`}
        >
          <span className="text-xl">&times;</span>
        </button>
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {selectedContent[localizationKeys.totalBidders]}
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto h-[400px] px-2 md:px-4">
        <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          <LodingTestAllatre />
        </Dimmer>

        <Table className="bg-transparent border-none w-full">
          {/* Fixed Table Header */}
          <Table.Header className="sticky top-0 bg-[#F8F8F8] shadow z-10">
            <Table.Row>
              <Table.HeaderCell className="font-medium text-center py-2">
                {selectedContent[localizationKeys.series]}
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-center py-2">
                {selectedContent[localizationKeys.bidderName]}
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-center py-2">
                {selectedContent[localizationKeys.biddingEndingTime]}
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-center py-2">
                {selectedContent[localizationKeys.totalBids]}
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-center py-2">
                {selectedContent[localizationKeys.lastBidAmount]}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {/* Scrollable Table Body */}
          <Table.Body>
            {totalBids?.map((e, index) => {
              // Find the highest bid amount
              const highestBidAmount = Math.max(
                ...totalBids.map((bid) => Number(bid.lastBidAmount))
              );
              const isHighestBid =
                Number(e?.lastBidAmount) === highestBidAmount;

              return (
                <Table.Row
                  key={index}
                  onClick={() => {
                    setUserID(e?.id);
                    setOpenSecondModel(true);
                  }}
                  className="bg-background border-none shadow rounded-lg mb-2"
                >
                  <Table.Cell
                    className={`text-center relative ${
                      isHighestBid ? "text-primary-dark font-bold" : ""
                    }`}
                  >
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell
                    className={`text-center relative ${
                      isHighestBid ? "text-primary-dark font-bold" : ""
                    }`}
                  >
                    {e?.userName}
                  </Table.Cell>
                  <Table.Cell
                    className={`text-center relative ${
                      isHighestBid ? "text-primary-dark font-bold" : ""
                    }`}
                  >
                    {moment(e?.lastBidTime).format("dddd - DD/M/YYYY")}
                  </Table.Cell>
                  <Table.Cell
                    className={`text-center relative ${
                      isHighestBid ? "text-primary-dark font-bold" : ""
                    }`}
                  >
                    {e?.totalBids}
                  </Table.Cell>
                  <Table.Cell
                    className={`text-center font-bold relative ${
                      isHighestBid ? "text-primary-dark" : ""
                    }`}
                  >
                    {formatCurrency(e?.lastBidAmount)}
                    {isHighestBid && (
                      <div className="group relative inline-block">
                        <FaCrown
                          className={`absolute ml-2 -top-1.5 transform -translate-y-1/2 text-yellow-500 text-lg ${
                            lang === "ar" ? "mr-2" : ""
                          }`}
                        />

                        <div className="absolute  mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-sm py-1 px-2 rounded-md">
                          <div className="flex flex-wrap">
                            <span className="w-full">
                              {selectedContent[localizationKeys.highest]}
                            </span>
                            <span className="w-full">
                              {" "}
                              {selectedContent[localizationKeys.bidder]}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
      <TotalBidsDetailsTableModel
        openSecondModel={openSecondModel}
        setOpenSecondModel={setOpenSecondModel}
        user={user}
        userId={userID}
        totalBids={totalBids}
        auctionId={auctionId ? auctionId : auctionsIdB}
      />
    </Modal>
  );
};
export default TotalBidsTableModel;

export const TotalBidsDetailsTableModel = ({
  openSecondModel,
  setOpenSecondModel,
  user,
  auctionId,
  userId,
  totalBids,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [historyBids, setHistoryBids] = useState();
  const { run, isLoading } = useAxios([]);
  const loginData = useSelector((state) => state?.loginDate?.loginDate);
  useEffect(() => {
    if (totalBids?.length > 0 && openSecondModel && auctionId && userId)
      run(
        (user || loginData?.IsLogIN ? authAxios : axios)
          .get(api.app.auctions.totalBidsDetails(auctionId, userId))
          .then((res) => {
            setHistoryBids(res?.data?.data);
          })
      );
  }, [totalBids, openSecondModel, auctionId, userId]);

  return (
    <Modal
      className="w-[calc(100%-32px)] mx-auto md:w-[1070px] h-auto md:h-[523px] rounded-2xl bg-transparent border-2 border-primary "
      onClose={() => {
        setOpenSecondModel(false);
        document.body.style.overflow = "auto";
      }}
      onOpen={() => {
        setOpenSecondModel(true);
        document.body.style.overflow = "hidden";
      }}
      open={openSecondModel}
    >
      <div className="w-full md:w-[1070px] h-auto md:h-[523px] rounded-2xl bg-white border-2 border-primary overflow-y-auto scrollbar-hide p-4 md:p-6">
        <div className="relative">
          <button
            onClick={() => {
              setOpenSecondModel(false);
              document.body.style.overflow = "auto";
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-primary"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          <Loader active />
        </Dimmer>
        <div className="mt-8">
          <div className="bg-[#F9F9F9] w-full md:w-[266px] h-auto md:h-[423px] rounded-lg static md:fixed ltr:left-4 rtl:right-4 p-4 md:p-0">
            <div
              onClick={() => setOpenSecondModel(false)}
              className="flex mx-2 cursor-pointer "
            >
              <img
                className="w-[w-40px] h-[40px] ltr:rotate-0 rtl:rotate-180"
                src={backArrowSecandryColor}
                alt="backArrowSecandryColor"
              />
              <p className="text-gray-dark font-medium text-sm my-auto pt-0.5">
                {selectedContent[localizationKeys.totalBidders]}
              </p>
            </div>
            <div className="flex gap-x-4 mx-6 pb-8 pt-6">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={
                  historyBids?.biderInfo?.imageLink
                    ? historyBids?.biderInfo?.imageLink
                    : userProfileicon
                }
                alt="userProfileicon"
              />
              <div className="pt-1">
                <h1 className="text-base text-gray-dark font-medium">
                  {historyBids?.biderInfo?.userName}
                </h1>
                <p className="text-xs text-gray-med font-normal">
                  {selectedContent[localizationKeys.online]}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 md:mt-0 overflow-x-auto">
            <Table className="bg-transparent border-none px-2 md:px-5 w-full m-0">
              <Table.Header>
                <Table.Row className="rounded-xl shadow bg-[#F8F8F8]">
                  <Table.HeaderCell className="rounded-l-xl font-medium text-sm text-gray-dark text-center whitespace-nowrap px-4">
                    {selectedContent[localizationKeys.series]}
                  </Table.HeaderCell>
                  <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center whitespace-nowrap px-4">
                    {selectedContent[localizationKeys.biddingTime]}
                  </Table.HeaderCell>
                  <Table.HeaderCell className="rounded-r-xl font-medium text-sm text-gray-dark text-center whitespace-nowrap px-4">
                    {selectedContent[localizationKeys.bidAmount]}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              {historyBids?.bidsHistory?.map((e, index) => (
                <Table.Body key={index} className="my-2">
                  <div className="my-2"></div>
                  <Table.Row className="bg-background border-none shadow rounded-lg">
                    <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-l-lg whitespace-nowrap px-4">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center whitespace-nowrap px-4">
                      {moment(e?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Table.Cell>
                    <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-r-lg whitespace-nowrap px-4">
                      {formatCurrency(e?.amount)}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
