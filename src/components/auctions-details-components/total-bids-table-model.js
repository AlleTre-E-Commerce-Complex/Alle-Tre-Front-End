import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Table } from "semantic-ui-react";
import api from "../../api";
import { authAxios, axios } from "../../config/axios-config";
import { useAuthState } from "../../context/auth-context";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";

const TotalBidsTableModel = ({ open, setOpen }) => {
  const { user } = useAuthState();
  const [lang] = useLanguage();
  const { auctionId } = useParams();
  const [totalBids, setTotalBidse] = useState();
  const { run, isLoading } = useAxios([]);

  useEffect(() => {
    if (user)
      run(
        authAxios.get(api.app.auctions.totalBids(auctionId)).then((res) => {
          setTotalBidse(res?.data?.data);
        })
      );
    run(
      axios.get(api.app.auctions.totalBids(auctionId)).then((res) => {
        setTotalBidse(res?.data?.data);
      })
    );
  }, [auctionId, run, user]);

  return (
    <Modal
      className="w-[1070px] h-[523px] rounded-2xl bg-transparent border-2 border-primary"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <div className="w-[1070px] h-[523px] rounded-2xl bg-white border-2 border-primary">
        <Table className="bg-transparent border-none px-2 pt-8 ">
          <Table.Header>
            <Table.Row className="rounded-2xl shadow bg-[#F8F8F8]">
              <Table.HeaderCell className="rounded-l-2xl font-medium text-sm text-gray-dark text-center">
                Series
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
                Bidder Name
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
                Bidding Ending Time
              </Table.HeaderCell>
              <Table.HeaderCell className="font-medium text-sm text-gray-dark text-center">
                Total Bids
              </Table.HeaderCell>
              <Table.HeaderCell className="rounded-r-2xl font-medium text-sm text-gray-dark text-center ">
                Last Bid Amount
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {totalBids?.map((e, index) => (
            <Table.Body className="my-2">
              <div className="my-2"></div>
              <Table.Row className="bg-background border-none shadow rounded-lg ">
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-l-lg ">
                  {index + 1}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                  {e?.userName}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                  {moment(e?.lastBidTime).format("dddd - DD/M/YYYY")}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                  {e?.totalBids}
                </Table.Cell>
                <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-r-lg ">
                  {e?.lastBidAmount}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      </div>
    </Modal>
  );
};

export default TotalBidsTableModel;
