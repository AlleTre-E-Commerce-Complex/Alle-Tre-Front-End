import React from "react";
import { truncateString } from "../../utils/truncate-string";
import emtyPhotosIcon from "../../../src/assets/icons/emty-photos-icon.svg";
import { useHistory } from "react-router-dom";
import { formatCurrency } from "../../utils/format-currency";
import moment from "moment";

import routes from "../../routes";
import { toast } from "react-hot-toast";
import useAxios from "hooks/use-axios";
import { authAxios } from "config/axios-config";
import api from "api";
import localizationKeys from "localization/localization-keys";
import { useLanguage } from "context/language-context";
import content from "../../localization/content";

const ProductRowTable = ({
  status,
  title,
  img,
  price,
  goToDetails,
  createdAt,
  productId,
  onReload,
  Product_id,
}) => {
  const history = useHistory();
  const { run, isLoading } = useAxios([]);
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const getDropdownOptions = () => {
    switch (status) {
      case "IN_PROGRESS":
        return [
          { key: "OUT_OF_STOCK", text: "Out Stock", value: "OUT_OF_STOCK" },
          { key: "SOLD_OUT", text: "Sold Out", value: "SOLD_OUT" },
        ];
      case "OUT_OF_STOCK":
        return [
          { key: "IN_PROGRESS", text: "In Stock", value: "IN_PROGRESS" },
          { key: "SOLD_OUT", text: "Sold Out", value: "SOLD_OUT" },
        ];
      case "SOLD_OUT":
      default:
        return [{ key: "SOLD_OUT", text: "Sold Out", value: "SOLD_OUT" }];
    }
  };

  const handleButtonClick = (value) => {
    run(
      authAxios
        .patch(api.app.productListing.updateProductStatus(productId), {
          status: value,
        })
        .then((res) => {
          onReload();
          toast.success("Product status updated successfully!");
        })
        .catch((error) => {
          toast.error("Failed to update status. Please try again.");
        }),
    );
  };

  return (
    <div className="bg-white dark:bg-[#151A23] border border-gray-100 dark:border-gray-800 rounded-xl p-4 mb-4 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm">
      {/* Image */}
      <div className="w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          className="w-full h-full object-cover"
          src={img || emtyPhotosIcon}
          alt={title || "Product"}
        />
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[#FDC02A] font-bold text-lg">
            {formatCurrency(price)}
          </span>
          <span className="bg-gray-100 dark:bg-[#2A3142] text-gray-600 dark:text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded">
            {price > 100 ? "PREMIUM" : "NEW ARRIVAL"}
          </span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {truncateString(title, 80)}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mt-1">
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span>SKU: {productId?.toString().substring(0, 8) || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{moment(createdAt).local().format("MMM DD, YYYY")}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        {status !== "SOLD_OUT" &&
          getDropdownOptions().map((opt, idx) => (
            <button
              key={opt.key}
              onClick={() => handleButtonClick(opt.value)}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-200 dark:border-[#2A3142] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A3142] rounded-lg text-sm font-medium transition-colors"
            >
              {opt.text}
            </button>
          ))}

        {status === "IN_PROGRESS" && (
          <button
            onClick={() => {
              history.replace({
                pathname: routes.app.listProduct.default,
                state: { productId: Product_id, isEditing: true },
              });
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-[#323D4E] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#404c5e] rounded-lg text-sm font-medium transition-colors border border-transparent dark:border-[#323D4E]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            {selectedContent[localizationKeys.edit]}
          </button>
        )}

        <button
          onClick={() => history.push(goToDetails)}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#FDC02A]/30 text-[#FDC02A] hover:bg-[#FDC02A]/10 rounded-lg text-sm font-medium transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {selectedContent[localizationKeys.details]}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductRowTable);
