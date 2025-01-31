import React, { useEffect, useState } from "react";
import { CreateAuctionBreadcrumb } from "../../../component/shared/bread-crumb/Breadcrumb";
import { Dimmer, Modal } from "semantic-ui-react";
import moment from "moment";

import createAuctionimgBGfrom from "../../../../src/assets/img/DraftImg.jpg";
import emtyPhotos from "../../../../src/assets/icons/emty-photos-icon.svg";
import TrashIcon from "../../../../src/assets/icons/trash-Icon.png";
import PenIcon from "../../../../src/assets/icons/pen-icon.png";

import { useHistory } from "react-router-dom";
import routes from "../../../routes";

import AddLocationModel from "../../../component/create-auction-components/add-location-model";
import useLocalStorage from "../../../hooks/use-localstorage";
import { authAxios } from "../../../config/axios-config";
import useAxios from "../../../hooks/use-axios";
import api from "../../../api";

import { productDetails } from "../../../redux-store/product-details-Slice";
import { useDispatch } from "react-redux";

import { toast } from "react-hot-toast";
import { truncateString } from "../../../utils/truncate-string";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import LodingTestAllatre from "../../../component/shared/lotties-file/loding-test-allatre";

const CreateAuction = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [hasCompletedProfile, setHasCompletedProfile] = useLocalStorage(
    "hasCompletedProfile",
    ""
  );

  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [draftAuctionData, setDraftAuctionData] = useState();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const dispatch = useDispatch();
  const handelCreatOuction = () => {
    if (JSON.parse(hasCompletedProfile)) {
      history.push(routes.app.createAuction.productDetails);
      dispatch(productDetails({}));
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
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div className="mt-44 animate-in  ">
        <div className=" max-w-[1366px] mx-auto h-14 my-7 py-4 sm:block hidden ">
          <CreateAuctionBreadcrumb />
        </div>
        <div className="relative">
          <img
            className="w-full h-auto object-cover  "
            src={createAuctionimgBGfrom}
            alt="createAuctionimgBGfrom"
          />
          <button
            onClick={() => handelCreatOuction()}
            className="w-[304px] h-[48px] text-base font-normal bg-primary hover:bg-primary-dark rounded-lg text-white absolute bottom-[68px] right-[90px] md:block hidden"
          >
            {selectedContent[localizationKeys.createAuctionNow]}
          </button>
          <button
            onClick={() => handelCreatOuction()}
            className="w-[110px] h-[30px] text-base font-normal bg-primary hover:bg-primary-dark rounded-lg text-white absolute bottom-[6px] right-[20px] md:hidden block"
          >
            {selectedContent[localizationKeys.createAuction]}
          </button>
        </div>
        <div className="max-w-[1366px] mx-auto px-2">
          <h1 className="text-gray-dark py-5 text-3xl font-medium text-center mt-5">
            {selectedContent[localizationKeys.drafts]}
          </h1>
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
        <AddLocationModel
          open={open}
          setOpen={setOpen}
          TextButton={selectedContent[localizationKeys.proceed]}
        />
      </div>
    </>
  );
};

export const DraftsItem = ({ img, itemName, date, auctionId, onReload }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const { run, isLoading } = useAxios();
  const deleteAuction = () => {
    run(authAxios.delete(api.app.auctions.delete(auctionId)))
      .then((res) => {
        setOpen(false);
        toast.success(selectedContent[localizationKeys.successDelete]);
        onReload();
      })
      .catch((err) => {
        toast.error(selectedContent[localizationKeys.errorDelete]);
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
            <button
              onClick={() =>
                history.push(routes.app.createAuction.productDetails, {
                  auctionId: auctionId,
                })
              }
              className="w-9 h-9 rounded-full backdrop-blur-md bg-white/50 mt-auto mb-5"
            >
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
          {truncateString(itemName, 15)}
        </p>
        <p
          dir="ltr"
          className="text-gray-med text-sm font-normal text-center pt-1"
        >
          {moment(date).format("D. MMM. YYYY")}
        </p>
      </div>
      <Modal
        className="sm:w-[392px] w-full h-auto bg-transparent "
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="sm:w-[400px] w-full border-2 border-primary h-auto rounded-2xl bg-background pb-6 pt-4">
          <h1 className="text-black font-semibold text-lg text-center">
            {selectedContent[localizationKeys.confirmDeletedraft]}
          </h1>
          <p className="text-gray-dark text-center mx-8 text-base font-normal pt-4">
            {
              selectedContent[
                localizationKeys.areYouSureYouWantToDeleteThisDraft
              ]
            }
          </p>
          <div className="flex justify-center gap-x-6 pt-6">
            <button
              onClick={() => setOpen(false)}
              className="border-gray-400 text-gray-700 border-[1px] w-[120px] h-[40px] rounded-lg text-base font-normal transition-all duration-300 hover:border-primary hover:text-primary"
            >
              {selectedContent[localizationKeys.cancel]}
            </button>
            <button
              loading={isLoading}
              onClick={() => deleteAuction()}
              className="bg-primary text-white w-[120px] h-[40px] rounded-lg text-base font-normal hover:bg-primary-dark"
            >
              {selectedContent[localizationKeys.delete]}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateAuction;
