import React, { useEffect, useState } from "react";
import { Modal } from "semantic-ui-react";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import AddLocationModel from "../../create-auction-components/add-location-model";
import { GoPlus } from "react-icons/go";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import { LocationDetailsCard } from "../../../page/app/profile/profile-settings";
import localizationKeys from "../../../localization/localization-keys";

const MakeDefultLocations = ({
  openMakeDefultLocations,
  setOpenMakeDefultLocations,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [locationData, setLocationData] = useState();
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);
  const { run: runLocationData, isLoading: isLoadingLocationData } = useAxios(
    []
  );
  useEffect(() => {
    runLocationData(
      authAxios.get(api.app.location.get).then((res) => {
        setLocationData(
          res?.data?.data?.sort((a, b) => (a.isMain ? -1 : b.isMain ? 1 : 0))
        );
      })
    );
  }, [runLocationData, forceReload]);
  return (
    <Modal
      className="sm:w-[650px] w-full h-auto bg-transparent scale-in "
      onClose={() => {
        setOpenMakeDefultLocations(false);
      }}
      open={openMakeDefultLocations}
    >
      <div className="sm:w-[650px] w-full h-auto border-2 border-primary rounded-2xl bg-background p-6">
        <h1 className="text-black text-base font-medium pb-4 ">
          Please choose any of your address and make it your main address to
          complete the purchase or bidding process{" "}
        </h1>
        {locationData?.map((e) => {
          return (
            <div className="flex gap-x-5">
              <LocationDetailsCard
                key={e?.id}
                Id={e?.id}
                AddressLable={e?.addressLabel}
                Address={e?.address}
                Country={lang === "en" ? e?.country?.nameEn : e?.country.nameAn}
                City={lang === "en" ? e?.city?.nameEn : e?.city.nameAn}
                PostalCode={e?.zipCode}
                isMain={e?.isMain}
                onReload={onReload}
                setOpenMakeDefultLocations={setOpenMakeDefultLocations}
              />
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default MakeDefultLocations;
