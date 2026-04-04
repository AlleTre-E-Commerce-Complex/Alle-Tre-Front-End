import React, { useState } from "react";
import { truncateString } from "../../utils/truncate-string";
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
import { MdDeleteOutline } from "react-icons/md";
import ConfirmationModal from "component/shared/delete-modal/delete-modal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const handleDelete = async () => {
    run(
      authAxios
        .delete(status === "DRAFTED" ? api.app.auctions.delete(productId) : api.app.productListing.deleteListedProduct(Product_id))
        .then((res) => {
          onReload();
          toast.success(selectedContent[localizationKeys.successDelete]);
        })
        .catch((error) => {
          toast.error(selectedContent[localizationKeys.oops]);
        })
        .finally(() => {
          setIsDeleteModalOpen(false);
        }),
    );
  };

  return (
    <div className="relative bg-white dark:bg-[#151A23] border border-gray-100 dark:border-gray-800 rounded-xl p-3 md:p-4 mb-4 flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center shadow-sm">
      {/* Wrapper for Image and Content side-by-side on mobile */}
      <div className="flex flex-row gap-3 md:gap-6 w-full md:w-auto flex-grow items-start">
        {/* Image */}
        <div className="w-24 h-24 md:w-48 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 flex items-center justify-center group">
          {img ? (
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={img}
              alt={title || "Product"}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider opacity-60">
                {selectedContent[localizationKeys.noPhotoAdded]}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col gap-1 md:gap-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <span className="text-[#FDC02A] font-bold text-base md:text-lg">
              {formatCurrency(price)}
            </span>
            <span className="bg-gray-100 dark:bg-[#2A3142] text-gray-600 dark:text-gray-300 text-[9px] md:text-[10px] uppercase font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
              {price > 100 ? "PREMIUM" : "NEW ARRIVAL"}
            </span>
          </div>
          <h1 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 md:line-clamp-none">
            {truncateString(title, 80)}
          </h1>
          <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-1 md:gap-4 text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1">
            <div className="flex items-center gap-1 md:gap-1.5 hidden md:flex">
              <svg
                className="w-3 h-3 md:w-4 md:h-4"
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
            <div className="flex items-center gap-1 md:gap-1.5">
              <svg
                className="w-3 h-3 md:w-4 md:h-4"
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
      </div>

      {/* Actions */}
      <div className="flex flex-row items-center gap-1.5 md:gap-2 lg:gap-3 w-full md:w-auto mt-2 md:mt-0 justify-end md:justify-start overflow-x-auto whitespace-nowrap scrollbar-hide">
        {status !== "SOLD_OUT" &&
          status !== "DRAFTED" &&
          getDropdownOptions().map((opt, idx) => (
            <button
              key={opt.key}
              onClick={() => handleButtonClick(opt.value)}
              disabled={isLoading}
              className="px-4 py-2 flex-shrink-0 border border-gray-200 hover:border-gray-500 dark:border-[#2A3142] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A3142] rounded-lg text-sm font-medium transition-colors"
            >
              {opt.text}
            </button>
          ))}

        {(status === "IN_PROGRESS" || status === "DRAFTED") && (
          <button
            onClick={() => {
              history.replace({
                pathname: routes.app.listProduct.default,
                state: {
                  productId: Product_id,
                  auctionId: status === "DRAFTED" ? productId : undefined,
                  isEditing: true,
                },
              });
            }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 xl:px-4 border border-gray-200 hover:border-gray-400 dark:border-[#323D4E] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#404c5e] rounded-lg text-sm font-medium transition-colors"
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
            <span className="hidden xl:inline">
              {selectedContent[localizationKeys.edit]}
            </span>
          </button>
        )}
         <button
          onClick={() => setIsDeleteModalOpen(true)}
          className={`flex-shrink-0 flex items-center justify-center gap-1.5 absolute top-3 md:top-auto ${lang === "ar" ? "left-3 md:left-auto" : "right-3 md:right-auto"} md:static w-9 h-9 md:w-auto md:h-auto px-2 py-1 md:px-3 md:py-1.5 xl:px-4 xl:py-2 bg-red-50/80 dark:bg-red-500/20 backdrop-blur-sm hover:bg-red-100 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-full md:rounded-lg text-sm font-medium transition-all duration-300 border border-red-100 dark:border-red-500/30 shadow-sm hover:shadow-md md:shadow-none z-10 hover:scale-110 md:hover:scale-100 active:scale-95 md:active:scale-100`}
          title={selectedContent[localizationKeys.deleteProduct]}
        >
          <MdDeleteOutline size={18} />
          <span className="hidden lg:inline">{selectedContent[localizationKeys.delete]}</span>
        </button>
        {status !== "DRAFTED" && (
          <button
            onClick={() => history.push(goToDetails)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 xl:px-4 border border-[#FDC02A]/50 text-yellow hover:bg-[#FDC02A]/30 rounded-lg text-sm font-medium transition-colors"
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
            <span className="hidden xl:inline">
              {selectedContent[localizationKeys.details]}
            </span>
          </button>
        )}
      </div>

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={selectedContent[localizationKeys.confirmDeleteProduct]}
        message={selectedContent[localizationKeys.areYouSureYouWantToDeleteThisProduct]}
      />
    </div>
  );
};

export default React.memo(ProductRowTable);
