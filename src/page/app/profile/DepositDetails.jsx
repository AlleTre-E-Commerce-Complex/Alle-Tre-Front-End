import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import useAxios from "../../../hooks/use-axios";
import { Dimmer } from "semantic-ui-react";
import routes from "../../../routes";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
import localizationKeys from "../../../localization/localization-keys";
import { formatCurrency } from "../../../utils/format-currency";
import moment from "moment";
import { toast } from "react-hot-toast";
import ObjectionModal from "../../../component/shared/modals/ObjectionModal";
import { useAuthState } from "../../../context/auth-context";

const DepositDetails = () => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const history = useHistory();
  const { user } = useAuthState();
  const [deposits, setDeposits] = useState([]);
  const [forceReload, setForceReload] = useState(false);
  const { run, isLoading } = useAxios([]);

  const [isObjectionModalOpen, setIsObjectionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    run(
      authAxios.get(api.app.payments.depositDetails).then((res) => {
        setDeposits(res?.data?.data || []);
      })
    );
  }, [run, forceReload]);

  const handleRelease = (productId) => {
    toast.promise(
      authAxios.post(api.app.payments.releaseArbon, { productId }),
      {
        loading: "Releasing deposit...",
        success: () => {
          setForceReload((p) => !p);
          return "Deposit released successfully";
        },
        error: (err) => err?.response?.data?.message || "Failed to release deposit",
      }
    );
  };

  const handleObjectionClick = (product) => {
    setSelectedProduct(product);
    setIsObjectionModalOpen(true);
  };

  return (
    <div className="mx-4 sm:mx-0 sm:ltr:ml-4 sm:rtl:mr-4 animate-in">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white"
        active={isLoading}
        inverted
      >
        <LoadingTest3arbon />
      </Dimmer>

      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedContent[localizationKeys.depositDetails]}
          </h1>
        </div>

        {deposits.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white dark:bg-[#151A23] border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {selectedContent[localizationKeys.noResultsFound]}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {deposits.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#151A23] border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div 
                  className="w-24 h-24 md:w-32 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 cursor-pointer"
                  onClick={() => history.push(routes.app.listProduct.details(item.id))}
                >
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0].imageLink}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 uppercase text-[10px]">
                      {selectedContent[localizationKeys.noPhotoAdded]}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#FDC02A] font-bold">
                      {formatCurrency(item.arbonAmount, "AED")}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.arbonStatus === "PAID" 
                        ? "bg-green-100 text-green-700" 
                        : item.arbonStatus === "DISPUTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {item.arbonStatus}
                    </span>
                  </div>
                  <h3 
                    className="text-lg font-bold text-gray-900 dark:text-white truncate cursor-pointer hover:text-primary"
                    onClick={() => history.push(routes.app.listProduct.details(item.id))}
                  >
                    {item.title}
                  </h3>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-xs text-gray-500">{moment(item.arbonPaidAt || item.createdAt).format("MMM DD, HH:mm")} • Buyer: {item.arbonBuyer?.userName || "N/A"}</p>
                  
                  {item.arbonStatus === "DISPUTED" && item.objections?.[0] && (() => {
                    const objection = item.objections[0];
                    const isLate = objection.repliedAt && moment(objection.repliedAt).isAfter(moment(objection.createdAt).add(2, "days"));
                    const isExpiredNoReply = !objection.repliedAt && moment().isAfter(moment(objection.createdAt).add(2, "days"));
                    
                    if (isLate) return <span className="mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded w-fit">Late Reply</span>;
                    if (isExpiredNoReply) return <span className="mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded w-fit">Expired</span>;
                    if (objection.repliedAt) return <span className="mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded w-fit">Replied</span>;
                    return null;
                  })()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                  {item.userId === user?.id && 
                    item.arbonStatus === "PAID" && 
                    item.arbonPaidAt && 
                    moment().diff(moment(item.arbonPaidAt), 'days') <= 7 && (
                    <button
                      onClick={() => handleRelease(item.id)}
                      className="flex-grow md:flex-grow-0 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      {selectedContent[localizationKeys.releaseDeposit]}
                    </button>
                  )}
                  {item.userId === user?.id && item.arbonStatus === "PAID" && !item.objections?.[0] && (
                    <button
                      onClick={() => handleObjectionClick(item)}
                      className="flex-grow md:flex-grow-0 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors"
                    >
                      {selectedContent[localizationKeys.objection]}
                    </button>
                  )}
                  {(item.arbonStatus === "DISPUTED" || item.objections?.[0]) && item.objections?.[0] && (() => {
                    const objection = item.objections[0];
                    const isExpired = moment().isAfter(moment(objection.createdAt).add(2, "days"));
                    const hasReplied = !!objection.repliedAt;
                    const isSender = objection.userId === user?.id;

                    // If it's expired and no reply was made, and it's not the sender, we might want to still show "Details" instead of hiding
                    // Or if you strictly want to hide the "Reply" action:
                    return (
                      <button
                        onClick={() => history.push(`/objection/${objection.id}`)}
                        className="flex-grow md:flex-grow-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors"
                      >
                        {hasReplied || isSender || isExpired
                          ? selectedContent[localizationKeys.viewObjection]
                          : selectedContent[localizationKeys.replyToObjection]
                        }
                      </button>
                    );
                  })()}
                  <button
                    onClick={() => history.push(routes.app.listProduct.details(item.id))}
                    className="flex-grow md:flex-grow-0 px-4 py-2 border border-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-bold rounded-lg transition-colors"
                  >
                    {selectedContent[localizationKeys.viewDetails]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isObjectionModalOpen && (
        <ObjectionModal
          open={isObjectionModalOpen}
          setOpen={setIsObjectionModalOpen}
          product={selectedProduct}
          onSuccess={() => setForceReload((p) => !p)}
        />
      )}
    </div>
  );
};

export default DepositDetails;
