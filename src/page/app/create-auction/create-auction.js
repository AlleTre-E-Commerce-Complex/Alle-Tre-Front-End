import React, { useEffect, useState } from "react";

import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Trash from "../../../components/shared/lotties-file/trash-lotifile";
import { Button, Dimmer, Loader, Modal } from "semantic-ui-react";
import moment from "moment";

import createAuctionimgBGfrom from "../../../../src/assets/img/create_auction_img_BG.png";
import createAuctionimgSm from "../../../../src/assets/img/create_auction_img_SM.png";
import CreaAuctionText from "../../../../src/assets/img/creat_auction_text.png";
import emtyPhotos from "../../../../src/assets/icons/emty-photos-icon.svg";
import TrashIcon from "../../../../src/assets/icons/trash-Icon.png";
import PenIcon from "../../../../src/assets/icons/pen-icon.png";

import { useHistory } from "react-router-dom";
import routes from "../../../routes";

import useLocalStorage from "../../../hooks/use-localstorage";
import AddLocationModel from "../../../components/create-auction-components/add-location-model";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import { toast } from "react-hot-toast";

const CreateAuction = () => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [draftAuctionData, setDraftAuctionData] = useState();

  const [hasCompletedProfile] = useLocalStorage("hasCompletedProfile", "");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handelCreatOuction = () => {
    if (hasCompletedProfile) {
      history.push(routes.createAuction.productDetails);
    } else setOpen(true);
  };

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const { run, isLoading } = useAxios([]);

  useEffect(() => {
    run(
      authAxios.get(api.app.auctions.getAlldraft).then((res) => {
        setDraftAuctionData(res?.data?.data);
      })
    );
  }, [run, forceReload]);

  return (
    <div className="mt-44 animate-in  ">
      <Dimmer className="animate-pulse" active={isLoading} inverted>
        <Loader active />
      </Dimmer>
      <div className=" max-w-[1366px] mx-auto h-14 my-7 py-4 sm:block hidden ">
        <CreateAuctionBreadcrumb />
      </div>
      <div className="relative">
        <img
          className="w-full h-auto object-cover md:block hidden "
          src={createAuctionimgBGfrom}
          alt="createAuctionimgBGfrom"
        />
        <img
          className="w-full h-auto object-cover  block md:hidden "
          src={createAuctionimgSm}
          alt="createAuctionimgSm"
        />
        <button
          onClick={() => handelCreatOuction()}
          className="w-[304px] h-[48px] text-base font-normal bg-primary hover:bg-primary-dark rounded-lg text-white absolute bottom-[68px] right-[90px] hidden md:block"
        >
          Create Auction Now
        </button>
        <button
          onClick={() => handelCreatOuction()}
          className="w-[128px] h-[32px] text-base font-normal bg-primary hover:bg-primary-dark rounded-lg text-white absolute bottom-[41px] right-[25px] md:hidden block"
        >
          Create Auction
        </button>
        <img
          className="lg:w-[700px] w-[500px] absolute bottom-[68px] left-[90px] hidden md:block"
          src={CreaAuctionText}
          alt="CreaAuctionText"
        />
      </div>
      <div className="max-w-[1366px] mx-auto px-2">
        <h1 className="text-black py-5 text-base font-normal">Drafts</h1>
        <div className="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2">
          {draftAuctionData?.map((e) => (
            <DraftsItem
              auctionId={e?.id}
              img={e && e?.product?.images[0]?.imageLink}
              itemName={e?.product?.title}
              date={e?.createdAt}
              onReload={onReload}
            />
          ))}
        </div>
      </div>
      <AddLocationModel open={open} setOpen={setOpen} TextButton={"Proceed"} />
    </div>
  );
};

export const DraftsItem = ({ img, itemName, date, auctionId, onReload }) => {
  const [open, setOpen] = useState(false);

  const { run, isLoading } = useAxios();
  const deleteAuction = () => {
    run(authAxios.delete(api.app.auctions.delete(auctionId)))
      .then((res) => {
        setOpen(false);
        toast.success(
          "Your auction has been deleted for you from drafting successfully"
        );
        onReload();
      })
      .catch((err) => {
        toast.error(
          "oops, sorry something with wrong please make sure everything is correct and try again"
        );
      });
  };
  return (
    <>
      <div className="w-[154px] h-[139px] rounded-lg border-[1px] border-solid mb-14 relative mx-auto">
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
        className="sm:w-[392px] w-full h-auto bg-transparent "
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="sm:w-[392px] w-full  h-auto border-2 border-primary rounded-2xl bg-background">
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
            <Button
              loading={isLoading}
              onClick={() => deleteAuction()}
              className="w-[136px] h-[48px] bg-primary text-white rounded-lg text-base font-normal ltr:font-serifEN rtl:font-serifAR opacity-100"
            >
              Yes,delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateAuction;
