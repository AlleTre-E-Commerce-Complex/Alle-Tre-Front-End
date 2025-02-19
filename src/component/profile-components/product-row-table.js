import React, { useState } from "react";
import { truncateString } from "../../utils/truncate-string";
import emtyPhotosIcon from "../../../src/assets/icons/emty-photos-icon.svg";
import { useHistory } from "react-router-dom";
import { formatCurrency } from "../../utils/format-currency";
import moment from "moment";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import routes from "../../routes";
import { Dropdown } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import api from "api";

const ProductRowTable = ({
  status,
  title,
  description,
  img,
  price,
  goToDetails,
  createdAt,
  productId,
  onReload,
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const { run, isLoading } = useAxios([]);
  const [currentStatus, setCurrentStatus] = useState(status);

  const statusOptions = {
    IN_PROGRESS: "In Stock",
    OUT_OF_STOCK: "Out of Stock",
    SOLD_OUT: "Sold Out",
  };

  const getDropdownOptions = () => {
    switch (status) {
      case "IN_PROGRESS":
        return [
          {
            key: "OUT_OF_STOCK",
            text: statusOptions.OUT_OF_STOCK,
            value: "OUT_OF_STOCK",
          },
          { key: "SOLD_OUT", text: statusOptions.SOLD_OUT, value: "SOLD_OUT" },
        ];
      case "OUT_OF_STOCK":
        return [
          {
            key: "IN_PROGRESS",
            text: statusOptions.IN_PROGRESS,
            value: "IN_PROGRESS",
          },
          { key: "SOLD_OUT", text: statusOptions.SOLD_OUT, value: "SOLD_OUT" },
        ];
      case "SOLD_OUT":
      default:
        return [
          { key: "SOLD_OUT", text: statusOptions.SOLD_OUT, value: "SOLD_OUT" },
        ];
    }
  };
  const [dropdownValue, setDropdownValue] = useState(currentStatus);
  const handleButtonClick = (value) => {
    setDropdownValue(value);

    run(
      authAxios
        .patch(api.app.productListing.updateProductStatus(productId), {
          status: value,
        })
        .then((res) => {
          setCurrentStatus(value);
          onReload();
          toast.success("Product status updated successfully!");
        })
        .catch((error) => {
          console.log("product row table err", error);
          toast.error("Failed to update status. Please try again.");
        })
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 hover:border-primary shadow-md hover:shadow-lg  py-4 px-4 mb-2 animate-in">
      <div className="flex flex-wrap justify-between overflow-clip ">
        <div className="flex gap-x-4">
          <div className="relative w-28 h-20 rounded-lg bg-[#F9F9F9] cursor-default">
            {img ? (
              <img
                className="w-28 h-20 object-cover rounded-lg"
                src={img ? img : emtyPhotosIcon}
                alt="img"
              />
            ) : (
              <img
                className="w-8 h-8 mx-auto mt-7 object-cover rounded-lg"
                src={emtyPhotosIcon}
                alt="img"
              />
            )}
          </div>
          <div className="flex flex-col md:w-[400px] w-full">
            <div>
              <h1 className="text-gray-dark text-sm font-medium">
                {truncateString(title, 80)}
              </h1>
              <p className="text-gray-med text-xs font-normal pt-1">
                {truncateString(description, 80)}
              </p>
            </div>

            <div className="pt-2 flex sm:flex-row flex-col sm:gap-x-10 gap-y-5">
              <div className="">
                <h1 className="text-gray-veryLight text-[10px] font-normal w-20">
                  Creation Date
                </h1>
                <p className="text-gray-dark text-[10px] font-normal">
                  {moment(createdAt).local().format("MMMM, DD YYYY")}
                </p>
              </div>
              <div>
                <h1 className="text-gray-veryLight text-[10px] font-normal">
                  {selectedContent[localizationKeys.price]}
                </h1>
                <p className="text-gray-dark text-[10px] font-normal">
                  {formatCurrency(price)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {status !== "SOLD_OUT" && (
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 sm:mt-18 mt-5 w-full">
              <div className="w-full flex justify-center">
                <button
                  onClick={() =>
                    handleButtonClick(getDropdownOptions()[0]?.value)
                  }
                  className="border-primary border text-primary hover:bg-primary hover:text-white text-sm font-normal px-4 py-2 w-full sm:w-[120px] h-[40px] rounded-lg"
                >
                  {getDropdownOptions()[0]?.text}
                </button>
              </div>

              <div className="w-full flex justify-center">
                <button
                  onClick={() =>
                    handleButtonClick(getDropdownOptions()[1]?.value)
                  }
                  className="border-primary border text-primary hover:bg-primary hover:text-white text-sm font-normal px-4 py-2 w-full sm:w-[120px] h-[40px] rounded-lg"
                >
                  {getDropdownOptions()[1]?.text}
                </button>
              </div>

              {/* View Details Button - Third Line */}
              <div className="w-full flex justify-center">
                <button
                  onClick={() => history.push(goToDetails)}
                  className="bg-primary hover:bg-primary-dark text-white text-sm font-normal px-4 py-2 w-full sm:w-[120px] h-[40px] rounded-lg"
                >
                  {selectedContent[localizationKeys.viewDetails]}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductRowTable);
