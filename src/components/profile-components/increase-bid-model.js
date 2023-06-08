import { useState } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";

import api from "../../api";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";

import { toast } from "react-hot-toast";
import { Button, Form, Modal } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Bids-icon.svg";

const IncreaseBidModel = ({
  onReload,
  auctionId,
  compareValue,
  open,
  setOpen,
}) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  const { run, isLoading } = useAxios();

  const handelSubmitBidButton = (values) => {
    run(authAxios.post(api.app.auctions.submitBid(auctionId), values))
      .then((res) => {
        toast.success(
          selectedContent[localizationKeys.yourAddNewSubmitValueSuccessfully]
        );
        onReload();
        setOpen(false);
      })
      .catch((err) => {
        toast.error(
          lang === "en"
            ? err.message.en || err.message
            : err.message.ar || err.message
        );
      });
  };

  const handelSubmitBidSchema = Yup.object({
    bidAmount: Yup.number().when([], {
      is: () => true,
      then: Yup.number()
        .required(selectedContent[localizationKeys.required])
        .test({
          message: ` You have to increase the bidding rate, noting that the last bidding was in value ${compareValue}`,
          test(value) {
            return value >= compareValue;
          },
        }),
      otherwise: Yup.number().notRequired(),
    }),
  });

  return (
    <Modal
      className="sm:w-[384px] w-full h-auto bg-transparent scale-in shadow-none "
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <div className="sm:w-[384px] w-full h-auto border-2 border-primary rounded-2xl bg-background px-8">
        <div className="text-center pt-11 pb-6">
          <AuctionIcon className="mx-auto" />
          <h1 className="text-gray-dark pt-3 font-semibold">Increase Bid</h1>
        </div>
        <Formik
          initialValues={{
            bidAmount: "",
          }}
          onSubmit={handelSubmitBidButton}
          validationSchema={handelSubmitBidSchema}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className=" w-full ">
                <div className="mx-auto ">
                  <FormikInput
                    name="bidAmount"
                    type="number"
                    placeholder={`min. AED ${compareValue}`}
                  />
                </div>
              </div>
              <div className="flex flex-col my-6">
                <Button
                  loading={isLoading}
                  className="bg-primary hover:bg-primary-dark opacity-100 font-normal text-base ltr:font-serifEN rtl:font-serifAR text-white w-full h-[48px] rounded-lg"
                >
                  Submit new bid
                </Button>
                <button
                  className="text-primary w-full h-[48px] rounded-lg underline "
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default IncreaseBidModel;
