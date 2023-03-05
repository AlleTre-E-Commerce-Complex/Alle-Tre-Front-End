import React, { useEffect, useState } from "react";

import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Trash from "../../../components/shared/lotties-file/trash-lotifile";
import { Button, Modal } from "semantic-ui-react";
import moment from "moment";

import createAuctionimgBGfrom from "../../../../src/assets/img/create_auction_img_BG.png";
import createAuctionimgSm from "../../../../src/assets/img/create_auction_img_SM.png";
import CreaAuctionText from "../../../../src/assets/img/creat_auction_text.png";
import emtyPhotos from "../../../../src/assets/icons/emty-photos-icon.svg";
import TrashIcon from "../../../../src/assets/icons/trash-Icon.png";
import PenIcon from "../../../../src/assets/icons/pen-icon.png";

import { useHistory } from "react-router-dom";
import routes from "../../../routes";
import { Form, Formik } from "formik";
import FormikMultiDropdown from "../../../components/shared/formik/formik-dropdown";
import { hoursOptions } from "../../../utils/hours-options";
import FormikInput from "../../../components/shared/formik/formik-input";
import useLocalStorage from "../../../hooks/use-localstorage";

const CreateAuction = () => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [hasCompletedProfile] = useLocalStorage("hasCompletedProfile", "");
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handelCreatOuction = () => {
    hasCompletedProfile
      ? setOpen(true)
      : history.push(routes.createAuction.productDetails);
  };
  return (
    <div className="mt-44 animate-in ">
      <div className=" max-w-[1366px] mx-auto h-14 my-7 py-4 ">
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
      <AddLocationModel open={open} setOpen={setOpen} />
    </div>
  );
};

export const DraftsItem = ({ img, itemName, date }) => {
  const [open, setOpen] = useState(false);
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

export const AddLocationModel = ({ open, setOpen }) => {
  return (
    <Modal
      className="w-[471px] h-auto bg-transparent "
      onClose={() => setOpen(false)}
      open={open}
    >
      <div className="w-[471px] h-auto border-2 border-primary rounded-2xl bg-background p-6">
        <div>
          <h1 className="text-base font-bold">
            Location is required <span className="text-red-500">*</span>
          </h1>
          <p className="text-gray-med text-xs font-normal pt-1 pb-2 ">
            In order to finish the procedure, we have to get access to<br></br>{" "}
            your location. you can manage them later .
            <span className="text-primary underline cursor-pointer ">
              Manage you addresses
            </span>
          </p>
        </div>
        <div>
          <Formik
            initialValues={{
              City: "",
              Country: "",
              Address: "",
            }}
            // onSubmit={handelProductDetailsdata}
            // validationSchema={ProductDetailsSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="w-full py-6">
                  <FormikMultiDropdown
                    name={"City"}
                    label={"City"}
                    placeholder="Select City"
                    options={hoursOptions}
                  />
                </div>
                <div className="w-full py-6">
                  <FormikMultiDropdown
                    name={"Country"}
                    label={"Country"}
                    placeholder="Select Country"
                    options={hoursOptions}
                  />
                </div>
                <div className="w-full py-6">
                  <FormikInput
                    name="Address"
                    type="text"
                    label="Address"
                    placeholder="Address"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    // loading={isLoading}
                    onClick={() => {
                      // history.push(routes.dashboard.app);
                    }}
                    className="bg-primary w-[163px] h-[48px] rounded-lg text-white  mb-2 font-normal text-base rtl:font-serifAR ltr:font-serifEN"
                  >
                    Proceed
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAuction;
