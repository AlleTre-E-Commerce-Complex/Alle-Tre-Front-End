import React, { useState } from "react";

import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Trash from "../../../components/shared/lotties-file/trash-lotifile";
import { Button, Modal } from "semantic-ui-react";
import moment from "moment";

import createAuctionimgBGfrom from "../../../../src/assets/img/create_auction_img_BG.png";
import CreaAuctionText from "../../../../src/assets/img/creat_auction_text.png";
import emtyPhotos from "../../../../src/assets/icons/emty-photos-icon.svg";
import TrashIcon from "../../../../src/assets/icons/trash-Icon.png";
import PenIcon from "../../../../src/assets/icons/pen-icon.png";

import { useHistory } from "react-router-dom";
import routes from "../../../routes";

const CreateAuction = () => {
  const history = useHistory();
  return (
    <div className="mt-44 animate-in ">
      <div className="mx-20 h-14 my-7 py-4 ">
        <CreateAuctionBreadcrumb />
      </div>
      <div className="relative">
        <img
          className="w-full h-auto object-cover"
          src={createAuctionimgBGfrom}
          alt="createAuctionimgBGfrom"
        />
        <button
          onClick={() => history.push(routes.createAuction.productDetails)}
          className="w-[304px] h-[48px] text-base font-normal bg-primary hover:bg-primary-dark rounded-lg text-white absolute bottom-[68px] right-[90px]"
        >
          Create Auction Now
        </button>
        <img
          className="w-[700px] absolute bottom-[68px] left-[90px]"
          src={CreaAuctionText}
          alt="CreaAuctionText"
        />
      </div>
      <div className="mx-24 px-2">
        <h1 className="text-black py-5 text-base font-normal">Drafts</h1>
        <div className="grid grid-cols-9">
          <DraftsItem
            img={
              "https://www.transparentpng.com/download/laptop/9oRuDc-refreshed-pavilion-gaming-series-launching-next-month.png"
            }
            itemName="Test Name"
          />
          <DraftsItem
            img={
              "https://sm.pcmag.com/t/pcmag_uk/review/m/microsoft-/microsoft-surface-laptop-go-2_w2a1.1920.jpg"
            }
            itemName="Test Name"
          />
          <DraftsItem
            img={
              "https://es.digitaltrends.com/wp-content/uploads/2022/06/surface-laptop-go-2-feat.jpg?resize=625%2C417&p=1"
            }
            itemName="Test Name"
          />
          <DraftsItem itemName="Test Name" />
          <DraftsItem itemName="Test Name" />
          <DraftsItem itemName="Test Name" />
          <DraftsItem itemName="Test Name" />
          <DraftsItem itemName="Test Name" />
          <DraftsItem itemName="Test Name" />
          <DraftsItem itemName="Test Name" />
        </div>
      </div>
    </div>
  );
};

export const DraftsItem = ({ img, itemName, date }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="w-[154px] h-[139px] rounded-lg border-[1px] border-solid mb-14 relative">
        {img ? (
          <img
            className="w-full h-full rounded-lg object-cover "
            src={img}
            alt="img"
          />
        ) : (
          <div className="w-full h-full rounded-lg object-cover">
            <img className="mx-auto pt-16" src={emtyPhotos} alt="emtyPhotos" />
          </div>
        )}
        <div className="group w-[154px] h-[139px] rounded-lg border-[1px] hover:bg-gradient-to-t hover:from-[#25252562] absolute bottom-0 z-10 ">
          <div className="group-hover:flex justify-center gap-x-9 hidden h-full ">
            <button className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5">
              <img className="p-2.5" src={PenIcon} alt="PenIcon" />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5"
            >
              <img className="p-[9px]" src={TrashIcon} alt="TrashIcon" />
            </button>
          </div>
        </div>
        <p className="text-gray-dark text-sm font-normal text-center pt-2">
          {itemName}
        </p>
        <p className="text-gray-med text-sm font-normal text-center pt-1">
          {moment(date).format("D. MMM. YYYY")}
        </p>
      </div>
      <Modal
        className="w-[392px] h-auto bg-transparent "
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="w-[392px] h-auto border-2 border-primary rounded-2xl bg-background">
          <div className="mt-24">
            <Trash />
          </div>
          <p className="text-gray-dark text-center text-base font-normal pt-8">
            Are you sure you want to delete this draft
          </p>
          <div className="flex justify-center gap-x-10 mt-10 mb-12">
            <button
              onClick={() => setOpen(false)}
              className="w-[136px] h-[48px] bg-white border-[1px] border-primary text-primary rounded-lg text-base font-normal ltr:font-serifEN rtl:font-serifAR"
            >
              Cancel
            </button>
            <Button className="w-[136px] h-[48px] bg-primary text-white rounded-lg text-base font-normal ltr:font-serifEN rtl:font-serifAR">
              Yes,delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateAuction;
