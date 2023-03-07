import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AddLocationModel from "../../../components/create-auction-components/add-location-model";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Stepper from "../../../components/shared/stepper/stepper-app";
import routes from "../../../routes";
import { GoPlus } from "react-icons/go";
import { Button, Dimmer, Loader } from "semantic-ui-react";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import { useLanguage } from "../../../context/language-context";

const ShippingDetails = () => {
  const history = useHistory();
  const [lang] = useLanguage();
  const [open, setOpen] = useState(false);
  const [locatonData, setLocationData] = useState();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    run(
      authAxios.get(api.app.location.get).then((res) => {
        setLocationData(res?.data?.data);
      })
    );
  }, [run, forceReload]);

  console.log("====================================");
  console.log(locatonData);
  console.log("====================================");

  return (
    <div className="mt-44 animate-in ">
      <div className=" max-w-[1366px] mx-auto h-14 my-7 py-4 ">
        <CreateAuctionBreadcrumb />
      </div>
      <div className="flex justify-center">
        <Stepper />
      </div>
      <div className=" max-w-[1366px] mx-auto ">
        <h1 className="font-bold text-base text-black pt-6">
          Location Details
        </h1>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mx-auto pt-6">
          <Dimmer className="animate-pulse" active={isLoading} inverted>
            <Loader active />
          </Dimmer>
          {locatonData?.map((e) => (
            <LocationDetailsCard
              id={e?.id}
              AddressLable={e?.addressLabel}
              Address={e?.address}
              Country={lang === "en" ? e?.city?.nameEn : e?.city.nameAn}
              City={lang === "en" ? e?.city?.nameEn : e?.city.nameAn}
              PostalCode={e?.zipCode}
            />
          ))}
          <button
            onClick={() => setOpen(true)}
            className="border-gray-med border-[1px] border-dashed w-[136px] h-[48px] rounded-lg text-base font-normal text-gray-med flex justify-center gap-x-2 "
          >
            <GoPlus className="my-auto" size={16} />
            <p className="my-auto">Add Address</p>
          </button>
        </div>
        <button
          onClick={() => history.push(routes.createAuction.paymentDetails)}
        >
          go to paymentDetails
        </button>
        {/* buttons */}
        <div className=" flex justify-end  mt-28">
          <Button
            onClick={() => {}}
            className="bg-primary sm:w-[304px] w-full h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN"
          >
            next
          </Button>
        </div>
      </div>
      <AddLocationModel
        open={open}
        setOpen={setOpen}
        TextButton={"Add"}
        onReload={onReload}
      />
    </div>
  );
};

export const LocationDetailsCard = ({
  AddressLable,
  Address,
  Country,
  City,
  PostalCode,
  id,
}) => {
  const [IsSelect, setIsSelect] = useState(false);
  return (
    <div
      key={id}
      onClick={() => setIsSelect((p) => !p)}
      className={`${
        IsSelect ? "border-primary" : "border-gray-med"
      } border-[1px] rounded-lg h-[120px] w-full p-5 cursor-pointer`}
    >
      <h1 className="text-gray-dark text-sm">{AddressLable}</h1>
      <p className="text-gray-med text-sm pt-2">{Address}</p>
      <p className="text-gray-veryLight text-sm pt-1">
        {Country},{City}
      </p>
      <p className="text-gray-med text-sm pt-1">{PostalCode}</p>
    </div>
  );
};

export default ShippingDetails;
