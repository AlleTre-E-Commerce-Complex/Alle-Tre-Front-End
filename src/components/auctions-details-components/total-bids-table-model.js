import React from "react";
import { Modal, Table } from "semantic-ui-react";

const TotalBidsTableModel = ({ open, setOpen }) => {
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

          <Table.Body className="my-2">
            <div className="my-2"></div>
            <Table.Row className="bg-background border-none shadow rounded-lg ">
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-l-lg ">
                Cell
              </Table.Cell>
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                Cell
              </Table.Cell>
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                Cell
              </Table.Cell>
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                Cell
              </Table.Cell>
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-r-lg ">
                Cell
              </Table.Cell>
            </Table.Row>
            <div className="my-2"></div>
            <Table.Row className="bg-background border-none shadow rounded-lg ">
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-l-lg ">
                Cell
              </Table.Cell>
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                Cell
              </Table.Cell>
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                Cell
              </Table.Cell>
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center">
                Cell
              </Table.Cell>
              <Table.Cell className="border-none text-gray-dark text-sm font-normal text-center rounded-r-lg ">
                Cell
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </Modal>
  );
};

export default TotalBidsTableModel;
