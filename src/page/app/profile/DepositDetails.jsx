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
import { FaShieldAlt, FaHistory, FaCheckCircle, FaExclamationTriangle, FaFileAlt, FaChevronRight, FaTimes } from "react-icons/fa";

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

  const stats = {
    total: deposits.length,
    disputed: deposits.filter(d => d.arbonStatus === "DISPUTED").length,
    resolved: deposits.filter(d => d.objections?.[0]?.finalDecision).length
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 dark:bg-background animate-in selection:bg-primary/30 pb-20">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-[100]"
        active={isLoading}
        inverted
      >
        <LoadingTest3arbon />
      </Dimmer>

      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-white dark:bg-[#111827] border-b border-gray-100 dark:border-white/5 py-10 md:py-16 mb-8">
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-5%] w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FaHistory className="text-primary text-xl" />
                </div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{selectedContent[localizationKeys.transactionRegistry]}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                {selectedContent[localizationKeys.depositDetails]}
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{selectedContent[localizationKeys.activeClaims]}</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stats.total}</span>
              </div>
              <div className="w-px h-10 bg-gray-100 dark:bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{selectedContent[localizationKeys.inDispute]}</span>
                <span className="text-2xl font-black text-red-500 leading-none">{stats.disputed}</span>
              </div>
              <div className="w-px h-10 bg-gray-100 dark:bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">{selectedContent[localizationKeys.successfullyResolved]}</span>
                <span className="text-2xl font-black text-green-500 leading-none">{stats.resolved}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {deposits.length === 0 && !isLoading ? (
          <div className="bg-white dark:bg-[#111827] rounded-[32px] p-12 md:p-20 text-center border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/5 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
              <FaFileAlt className="text-4xl text-gray-300 dark:text-gray-700" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">{selectedContent[localizationKeys.emptyRegistry]}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
              {selectedContent[localizationKeys.noResultsFound]}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {deposits.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-[#111827] rounded-[32px] p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
              >
                {/* Product Visualization */}
                <div 
                  className="relative w-full lg:w-48 h-48 lg:h-40 flex-shrink-0 rounded-[24px] overflow-hidden bg-gray-50 dark:bg-white/5 cursor-pointer shadow-inner"
                  onClick={() => history.push(routes.app.listProduct.details(item.id))}
                >
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0].imageLink}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-white/5">
                      <FaFileAlt className="text-2xl text-gray-300 mb-2" />
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        {selectedContent[localizationKeys.noPhotoAdded]}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Core Intel */}
                <div className="flex-grow min-w-0 w-full lg:w-auto">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                      <span className="text-sm font-black text-primary tracking-tight">
                        {formatCurrency(item.arbonAmount, "AED")}
                      </span>
                    </div>
                    
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      item.arbonStatus === "PAID" 
                        ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:border-green-500/20" 
                        : item.arbonStatus === "DISPUTED"
                        ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:border-red-500/20"
                        : "bg-gray-50 text-gray-600 border-gray-100 dark:bg-white/5 dark:border-white/10"
                    }`}>
                      {item.arbonStatus}
                    </div>
                  </div>

                  <h3 
                    className="text-2xl font-black text-gray-900 dark:text-white mb-2 truncate cursor-pointer hover:text-primary transition-colors leading-tight"
                    onClick={() => history.push(routes.app.listProduct.details(item.id))}
                  >
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {moment(item.arbonPaidAt || item.createdAt).format("MMM DD, YYYY · HH:mm")}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-500">
                        {item.arbonBuyer?.userName?.charAt(0)?.toUpperCase()}
                      </div>
                      {selectedContent[localizationKeys.buyer]}: <span className="text-gray-900 dark:text-white font-bold">{item.arbonBuyer?.userName || "N/A"}</span>
                    </div>
                  </div>

                  {/* Dispute Intelligence */}
                  {(() => {
                    const objection = item.objections?.[0];
                    if (!objection) return null;

                    const status = objection.status;
                    const isResolved = status === "SOLVED" || status === "RESOLVED";
                    const isExpiredNoReply = status === "EXPIRED" || (!objection.repliedAt && moment().isAfter(moment(objection.createdAt).add(2, 'days')));

                    let badgeProps = { text: selectedContent[localizationKeys.pending], color: "bg-yellow-500 text-white border-yellow-600 shadow-yellow-500/10", icon: <FaExclamationTriangle /> };
                    if (isResolved) badgeProps = { text: selectedContent[localizationKeys.resolved], color: "bg-amber-500 text-white border-amber-600 shadow-amber-500/10", icon: <FaCheckCircle /> };
                    else if (status === "IN_PROGRESS") badgeProps = { text: selectedContent[localizationKeys.inProgress], color: "bg-blue-600 text-white border-blue-700 shadow-blue-500/10", icon: <FaHistory /> };
                    else if (isExpiredNoReply) badgeProps = { text: selectedContent[localizationKeys.expired], color: "bg-red-600 text-white border-red-700 shadow-red-500/10", icon: <FaTimes /> };

                    return (
                      <div className="mt-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${badgeProps.color}`}>
                          {isResolved ? <FaCheckCircle /> : <FaExclamationTriangle />}
                          {badgeProps.text}
                        </div>
                        
                        {isResolved && (
                          <div className="mt-4 p-5 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/5 rounded-[24px] border border-amber-100 dark:border-amber-900/20 relative group/decision transition-all hover:bg-white dark:hover:bg-white/5">
                            <div className="absolute top-[-8px] left-6 px-3 py-0.5 bg-amber-500 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-amber-500/20">
                              {selectedContent[localizationKeys.officialResolution]}
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed mb-4">
                              {objection.finalDecision}
                            </p>
                            {objection.finalDecisionDocuments?.length > 0 && (
                              <div className="flex flex-wrap gap-3">
                                {objection.finalDecisionDocuments.map((doc, idx) => (
                                  <a
                                    key={doc.id}
                                    href={doc.imageLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-amber-500 hover:text-amber-500 transition-all shadow-sm group/file"
                                  >
                                    <FaFileAlt className="text-amber-500 opacity-50 group-hover/file:opacity-100" />
                                    {selectedContent[localizationKeys.evidence]} {idx + 1}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Tactical Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto mt-2 md:mt-0 relative z-10">
                  {item.userId === user?.id && 
                    item.arbonStatus === "PAID" && 
                    item.arbonPaidAt && 
                    moment().diff(moment(item.arbonPaidAt), 'days') <= 7 && (
                    <button
                      onClick={() => handleRelease(item.id)}
                      className="group relative h-12 px-8 bg-green-600 hover:bg-green-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 overflow-hidden"
                    >
                      <FaShieldAlt className="text-green-300 group-hover:scale-110 transition-transform" />
                      <span>{selectedContent[localizationKeys.releaseDeposit]}</span>
                    </button>
                  )}
                  
                  {item.userId === user?.id && item.arbonStatus === "PAID" && !item.objections?.[0] && (
                    <button
                      onClick={() => handleObjectionClick(item)}
                      className="h-12 px-8 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-300 border border-red-100 dark:border-red-500/20"
                    >
                      {selectedContent[localizationKeys.objection]}
                    </button>
                  )}

                  {(item.arbonStatus === "DISPUTED" || item.objections?.[0]) && item.objections?.[0] && (() => {
                    const objection = item.objections[0];
                    const isExpired = moment().isAfter(moment(objection.createdAt).add(2, 'days'));
                    const hasReplied = !!objection.repliedAt;
                    const isSender = objection.userId === user?.id;
                    const isResolved = objection.status === "SOLVED" || objection.status === "RESOLVED";

                    return (
                      <button
                        onClick={() => history.push(`/objection/${objection.id}`)}
                        className={`h-12 px-8 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-lg group ${
                          isResolved
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20'
                            : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
                        }`}
                      >
                        <span>
                          {isResolved
                            ? selectedContent[localizationKeys.viewDecision]
                            : hasReplied || isSender || isExpired
                              ? selectedContent[localizationKeys.viewObjection]
                              : selectedContent[localizationKeys.replyToObjection]
                          }
                        </span>
                        <FaChevronRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                      </button>
                    );
                  })()}

                  <button
                    onClick={() => history.push(routes.app.listProduct.details(item.id))}
                    className="h-12 px-8 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-300 border border-gray-100 dark:border-white/10"
                  >
                    {selectedContent[localizationKeys.viewDetails]}
                  </button>
                </div>

                {/* Subtle Decorative Background Element */}
                <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 bg-primary/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
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
