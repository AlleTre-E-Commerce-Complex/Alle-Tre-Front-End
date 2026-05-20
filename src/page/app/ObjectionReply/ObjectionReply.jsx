import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { authAxios } from "../../../config/axios-config";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaCloudUploadAlt, FaTimes, FaFileAlt, FaCheckCircle, FaHistory, FaExclamationTriangle, FaPlay } from "react-icons/fa";
import moment from "moment";
import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
import { Dimmer } from "semantic-ui-react";
import { useAuthState } from "../../../context/auth-context";

const ObjectionReply = () => {
  const { objectionId } = useParams();
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const history = useHistory();
  const { user } = useAuthState();
  const [objection, setObjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();
  
  useEffect(() => {
    moment.locale(lang);
  }, [lang]);
  useEffect(() => {
    const fetchObjection = async () => {
      try {
        const response = await authAxios.get(`/payments-v2/objections/${objectionId}`);
        if (response.data.success) {
          setObjection(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching objection:", error);
        toast.error(selectedContent[localizationKeys.somethingWentWrong]);
      } finally {
        setLoading(false);
      }
    };
    fetchObjection();
  }, [objectionId, selectedContent]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("replyReason", values.replyReason);
    formData.append("replyDescription", values.replyDescription);
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await authAxios.post(
        `/payments-v2/objections/${objectionId}/reply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success(selectedContent[localizationKeys.repliedSuccessfully]);
        history.push("/profile/deposit-details");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error(selectedContent[localizationKeys.somethingWentWrong]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Dimmer active inverted className="fixed w-full h-full top-0 bg-white z-[100]">
      <LoadingTest3arbon />
    </Dimmer>
  );

  if (!objection) return <div className="text-center py-20 dark:text-white">{selectedContent[localizationKeys.somethingWentWrong]}</div>;

  const expiresAt = moment(objection.createdAt).add(2, "days");
  const isExpired = moment().isAfter(expiresAt);
  const hasReplied = !!objection.repliedAt;
  const isSender = objection.userId === user?.id;

  const getStatusBadge = () => {
    const status = objection.status;
    if (status === "SOLVED" || status === "RESOLVED") 
      return { 
        text: selectedContent[localizationKeys.resolved], 
        color: "bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/20",
        icon: <FaCheckCircle className="w-3.5 h-3.5" />
      };
    if (status === "IN_PROGRESS") 
      return { 
        text: selectedContent[localizationKeys.inProgress], 
        color: "bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-500/20",
        icon: <FaHistory className="w-3.5 h-3.5" />
      };
    if (status === "EXPIRED" || isExpired) 
      return { 
        text: selectedContent[localizationKeys.expired], 
        color: "bg-red-600 text-white border-red-700 shadow-lg shadow-red-500/20",
        icon: <FaTimes className="w-3.5 h-3.5" />
      };
    
    return { 
      text: selectedContent[localizationKeys.pending], 
      color: "bg-yellow-500 text-white border-yellow-600 shadow-lg shadow-yellow-500/20",
      icon: <FaExclamationTriangle className="w-3.5 h-3.5" />
    };
  };

  const status = getStatusBadge();

  return (
    <div className="w-full min-h-screen bg-gray-50/50 dark:bg-background animate-in selection:bg-yellow-500/30">
      {/* Immersive Header */}
      <div className="relative bg-white dark:bg-[#111827] border-b border-gray-100 dark:border-white/5 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-5%] w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 py-6 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => history.push("/profile/deposit-details")}
                className="group p-3 bg-gray-50 dark:bg-white/5 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-2xl transition-all duration-300 border border-gray-100 dark:border-white/5 hover:border-yellow-200 dark:hover:border-yellow-500/20 shadow-sm"
              >
                <svg className="w-5 h-5 text-gray-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {selectedContent[localizationKeys.objectionDetails]}
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedContent[localizationKeys.caseId]}</span>
                  <span className="text-sm font-mono text-yellow-600 dark:text-yellow-500 font-bold">#{objection.id}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-md transition-all duration-300 hover:scale-105 ${status.color}`}>
                {status.icon}
                {status.text}
              </div>
              <div className="h-8 w-px bg-gray-100 dark:bg-white/10 hidden sm:block" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{selectedContent[localizationKeys.receivedOn]}</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {moment(objection.createdAt).locale(lang).format("MMM DD, YYYY")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 py-8 md:py-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Product Overview Card */}
            <div className="group bg-white dark:bg-[#111827] rounded-[32px] shadow-xl shadow-black/5 border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/10">
              <div className="flex flex-col md:flex-row">
                {objection.product?.images?.[0] && (
                  <div className="w-full md:w-64 lg:w-72 h-64 md:h-auto flex-shrink-0 relative overflow-hidden">
                    <img
                      src={objection.product.images[0].imageLink}
                      alt={objection.product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}
                <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-500/10 text-[10px] font-black text-yellow-700 dark:text-yellow-500 uppercase rounded-md">{selectedContent[localizationKeys.referenceItem]}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                      {objection.product?.title}
                    </h2>
                    <p className="text-sm font-medium text-gray-400 mb-6">
                      {selectedContent[localizationKeys.systemReference]}: <span className="text-gray-600 dark:text-gray-300 font-bold">{objection.productId}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 group/user transition-colors hover:bg-gray-100 dark:hover:bg-white/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/20 transition-transform group-hover/user:rotate-3">
                      <span className="text-lg font-black text-white">
                        {objection.user?.userName?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{selectedContent[localizationKeys.complainant]}</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white leading-none mb-0.5">{objection.user?.userName}</p>
                      <p className="text-xs font-medium text-gray-500">{objection.user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Immersive Timeline */}
            <div className="relative space-y-12">
              <div className="absolute left-6 md:left-8 top-4 bottom-4 w-1 bg-gradient-to-b from-red-500 via-blue-500 to-amber-500 rounded-full opacity-20 dark:opacity-10" />
              
              {/* Event: Original Objection */}
              <div className="relative pl-16 md:pl-24 group">
                <div className="absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-[20px] shadow-lg shadow-red-500/30 flex items-center justify-center z-10 transition-transform group-hover:scale-110 duration-300">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                <div className="bg-white dark:bg-[#111827] rounded-[32px] shadow-xl shadow-black/5 border border-gray-100 dark:border-white/5 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                      {selectedContent[localizationKeys.step1Objection]}
                    </h3>
                    <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-white/5">
                      {moment(objection.createdAt).locale(lang).format("MMM DD · HH:mm")}
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-5 bg-red-50/30 dark:bg-red-500/5 rounded-2xl border border-red-100/50 dark:border-red-500/10">
                      <p className="text-[10px] font-black text-red-500/60 uppercase mb-2 tracking-widest">{selectedContent[localizationKeys.primaryReason]}</p>
                      <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">{objection.reason}</p>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">{selectedContent[localizationKeys.fullStatement]}</p>
                      <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{objection.description}</p>
                    </div>
                    
                    {objection.documents?.length > 0 && (
                      <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">{selectedContent[localizationKeys.evidenceGallery]} ({objection.documents.length})</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {objection.documents.map((doc, idx) => {
                            const isPdf = doc.imageLink?.toLowerCase().endsWith(".pdf") || doc.imagePath?.toLowerCase().endsWith(".pdf");
                            const isVideo = doc.imageLink?.toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v)$/) || doc.imagePath?.toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v)$/);
                            return (
                              <div
                                key={idx}
                                onClick={() => window.open(doc.imageLink, '_blank')}
                                className="relative aspect-square group/thumb cursor-pointer rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-red-400 transition-all duration-300 shadow-sm hover:shadow-md"
                              >
                                {isPdf ? (
                                  <div className="w-full h-full bg-red-50 dark:bg-red-500/10 flex flex-col items-center justify-center group-hover/thumb:bg-red-100 transition-colors">
                                    <FaFileAlt className="w-6 h-6 text-red-500 mb-1" />
                                    <span className="text-[10px] font-black text-red-600">PDF</span>
                                  </div>
                                ) : isVideo ? (
                                  <div className="w-full h-full relative">
                                    <video src={doc.imageLink} className="w-full h-full object-cover" muted playsInline />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                      <FaPlay className="text-white text-lg drop-shadow-md" />
                                    </div>
                                  </div>
                                ) : (
                                  <img src={doc.imageLink} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" />
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="p-2 bg-white rounded-full text-red-600 shadow-xl scale-0 group-hover/thumb:scale-100 transition-transform">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event: Reply */}
              {hasReplied && (
                <div className="relative pl-16 md:pl-24 group">
                  <div className="absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-[20px] shadow-lg shadow-blue-500/30 flex items-center justify-center z-10 transition-transform group-hover:scale-110 duration-300">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  
                  <div className="bg-white dark:bg-[#111827] rounded-[32px] shadow-xl shadow-black/5 border border-blue-100 dark:border-blue-900/20 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                      <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        {selectedContent[localizationKeys.step2DefenseReply]}
                      </h3>
                      <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-white/5">
                        {moment(objection.repliedAt).locale(lang).format("MMM DD · HH:mm")}
                      </span>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-5 bg-blue-50/30 dark:bg-blue-500/5 rounded-2xl border border-blue-100/50 dark:border-blue-500/10">
                        <p className="text-[10px] font-black text-blue-500/60 uppercase mb-2 tracking-widest">{selectedContent[localizationKeys.defensePosition]}</p>
                        <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">{objection.replyReason}</p>
                      </div>
                      
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">{selectedContent[localizationKeys.counterStatement]}</p>
                        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{objection.replyDescription}</p>
                      </div>
                      
                      {objection.replyDocuments?.length > 0 && (
                        <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">{selectedContent[localizationKeys.defenseEvidence]} ({objection.replyDocuments.length})</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {objection.replyDocuments.map((doc, idx) => {
                              const isPdf = doc.imageLink?.toLowerCase().endsWith(".pdf") || doc.imagePath?.toLowerCase().endsWith(".pdf");
                              const isVideo = doc.imageLink?.toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v)$/) || doc.imagePath?.toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v)$/);
                              return (
                                <div
                                  key={idx}
                                  onClick={() => window.open(doc.imageLink, '_blank')}
                                  className="relative aspect-square group/thumb cursor-pointer rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                  {isPdf ? (
                                    <div className="w-full h-full bg-blue-50 dark:bg-blue-500/10 flex flex-col items-center justify-center group-hover/thumb:bg-blue-100 transition-colors">
                                      <FaFileAlt className="w-6 h-6 text-blue-500 mb-1" />
                                      <span className="text-[10px] font-black text-blue-600">PDF</span>
                                    </div>
                                  ) : isVideo ? (
                                    <div className="w-full h-full relative">
                                      <video src={doc.imageLink} className="w-full h-full object-cover" muted playsInline />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                        <FaPlay className="text-white text-lg drop-shadow-md" />
                                      </div>
                                    </div>
                                  ) : (
                                    <img src={doc.imageLink} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" />
                                  )}
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="p-2 bg-white rounded-full text-blue-600 shadow-xl scale-0 group-hover/thumb:scale-100 transition-transform">
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Event: Final Decision */}
              {objection.finalDecision && (
                <div className="relative pl-16 md:pl-24 group">
                  <div className="absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-[20px] shadow-lg shadow-amber-500/30 flex items-center justify-center z-10 transition-transform group-hover:scale-110 duration-300">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50/90 to-yellow-50/80 dark:from-yellow-500/10 dark:to-orange-500/5 rounded-[32px] shadow-xl shadow-amber-500/5 border border-amber-200/50 dark:border-yellow-500/20 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl overflow-hidden relative">
                    {/* Decorative Background Pattern */}
                    <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-[0.03] pointer-events-none">
                      <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 relative z-10">
                      <h3 className="text-lg md:text-xl font-black text-amber-800 dark:text-yellow-500 uppercase tracking-tight flex items-center gap-3">
                        {selectedContent[localizationKeys.step3FinalDecision]}
                      </h3>
                      <span className="px-3 py-1 bg-amber-100/50 dark:bg-yellow-500/10 rounded-full text-[10px] font-black text-amber-700 dark:text-yellow-500 uppercase tracking-widest border border-amber-200/50 dark:border-yellow-500/20">
                        {moment(objection.finalDecisionAt).locale(lang).format("MMM DD · HH:mm")}
                      </span>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                      <div className="bg-white/80 dark:bg-black/20 backdrop-blur-sm rounded-[24px] p-6 md:p-8 border border-amber-200/30 dark:border-yellow-500/10 shadow-inner">
                        <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-bold italic">
                          "{objection.finalDecision}"
                        </p>
                      </div>
                      
                      {objection.finalDecisionDocuments?.length > 0 && (
                        <div className="pt-4 border-t border-amber-200/30 dark:border-yellow-500/10">
                          <p className="text-[10px] font-black text-amber-700 dark:text-yellow-500 uppercase mb-4 tracking-widest">{selectedContent[localizationKeys.resolutionDocuments]} ({objection.finalDecisionDocuments.length})</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {objection.finalDecisionDocuments.map((doc, idx) => {
                              const isPdf = doc.imageLink?.toLowerCase().endsWith(".pdf") || doc.imagePath?.toLowerCase().endsWith(".pdf");
                              const isVideo = doc.imageLink?.toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v)$/) || doc.imagePath?.toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v)$/);
                              return (
                                <div
                                  key={idx}
                                  onClick={() => window.open(doc.imageLink, '_blank')}
                                  className="relative aspect-square group/thumb cursor-pointer rounded-2xl overflow-hidden border border-amber-200/50 dark:border-yellow-500/20 hover:border-amber-500 transition-all duration-300 shadow-sm"
                                >
                                  {isPdf ? (
                                    <div className="w-full h-full bg-amber-50 dark:bg-yellow-500/10 flex flex-col items-center justify-center group-hover/thumb:bg-amber-100 transition-colors">
                                      <FaFileAlt className="w-6 h-6 text-amber-600 mb-1" />
                                      <span className="text-[10px] font-black text-amber-700">PDF</span>
                                    </div>
                                  ) : isVideo ? (
                                    <div className="w-full h-full relative">
                                      <video src={doc.imageLink} className="w-full h-full object-cover" muted playsInline />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                        <FaPlay className="text-white text-lg drop-shadow-md" />
                                      </div>
                                    </div>
                                  ) : (
                                    <img src={doc.imageLink} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" />
                                  )}
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="p-2 bg-white rounded-full text-amber-600 shadow-xl scale-0 group-hover/thumb:scale-100 transition-transform">
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Section */}
            {!hasReplied && !isExpired && !isSender && (
              <div className="bg-white dark:bg-[#111827] rounded-[32px] shadow-2xl shadow-blue-500/5 border border-gray-100 dark:border-white/5 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      {selectedContent[localizationKeys.draftYourDefense]}
                    </h3>
                    <p className="text-sm font-medium text-gray-400">{selectedContent[localizationKeys.provideYourPerspective]}</p>
                  </div>
                </div>

                <Formik
                  initialValues={{ replyReason: "", replyDescription: "" }}
                  validationSchema={Yup.object({
                    replyReason: Yup.string().required(selectedContent[localizationKeys.required]),
                    replyDescription: Yup.string().required(selectedContent[localizationKeys.required]),
                  })}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-8">
                      <Dimmer active={isSubmitting} inverted className="fixed w-full h-full top-0 bg-white/50 z-[100]">
                        <LoadingTest3arbon />
                      </Dimmer>
                      <div className="grid grid-cols-1 gap-8">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em]">
                            {selectedContent[localizationKeys.replyReason]} <span className="text-red-500">*</span>
                          </label>
                          <Field
                            name="replyReason"
                            placeholder="e.g., Product matches description exactly"
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em]">
                            {selectedContent[localizationKeys.detailedExplanation]} <span className="text-red-500">*</span>
                          </label>
                          <Field
                            as="textarea"
                            name="replyDescription"
                            rows={6}
                            placeholder="Describe in detail why you disagree with the objection..."
                            className="w-full px-6 py-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none leading-relaxed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-[0.2em]">
                          {selectedContent[localizationKeys.supportingDocuments]}
                        </label>
                        <div
                          onClick={() => fileInputRef.current.click()}
                          className="group relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl p-10 md:p-14 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-all duration-300"
                        >
                          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                            <FaCloudUploadAlt className="text-2xl md:text-3xl text-blue-500" />
                          </div>
                          <p className="text-base font-black text-gray-900 dark:text-white mb-1">{selectedContent[localizationKeys.uploadEvidence]}</p>
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
                            {selectedContent[localizationKeys.dragAndDropOrClick]}
                          </span>
                          <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        </div>

                        {files.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-8 p-4 bg-gray-50 dark:bg-white/5 rounded-[24px] border border-gray-100 dark:border-white/5">
                            {files.map((file, idx) => (
                              <div key={idx} className="relative group aspect-square rounded-[18px] overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 shadow-sm transition-transform hover:scale-105">
                                {file.type.startsWith("image/") ? (
                                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50/50 dark:bg-blue-500/5">
                                    <FaFileAlt className="w-8 h-8 text-blue-500/40" />
                                    <span className="text-[8px] font-black text-blue-600 mt-2 truncate max-w-full px-2">{file.name}</span>
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeFile(idx)}
                                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 shadow-xl hover:scale-110 active:scale-90"
                                >
                                  <FaTimes size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="relative text-lg font-black uppercase tracking-[0.1em]">
                          {isSubmitting ? selectedContent[localizationKeys.processing] : selectedContent[localizationKeys.securelySubmitReply]}
                        </span>
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            )}

            {/* Expired Alert */}
            {isExpired && !hasReplied && (
              <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-900/30 rounded-[32px] p-8 md:p-10 flex items-center gap-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-[20px] flex-shrink-0 flex items-center justify-center">
                  <FaTimes className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-red-900 dark:text-red-400 mb-1 uppercase tracking-tight">{selectedContent[localizationKeys.windowClosed]}</h3>
                  <p className="text-sm md:text-base font-medium text-red-700 dark:text-red-500/80 leading-relaxed">{selectedContent[localizationKeys.windowClosedDescription]}</p>
                </div>
              </div>
            )}
          </div>

          {/* Elegant Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-[160px] space-y-6">
              
              {/* Summary Stats Card */}
              <div className="bg-white dark:bg-[#111827] rounded-[32px] shadow-xl shadow-black/5 border border-gray-100 dark:border-white/5 p-8 overflow-hidden relative">
                {/* Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-amber-600" />
                
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">{selectedContent[localizationKeys.summaryIntelligence]}</h4>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center group/stat">
                    <span className="text-sm font-bold text-gray-500 group-hover/stat:text-gray-900 dark:group-hover/stat:text-white transition-colors">{selectedContent[localizationKeys.currentStatus]}</span>
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full shadow-md border flex items-center gap-2 ${status.color}`}>
                      {status.icon}
                      {status.text}
                    </span>
                  </div>
                  
                  <div className="h-px bg-gray-50 dark:bg-white/5" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500">{selectedContent[localizationKeys.lodged]}</span>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900 dark:text-white">{moment(objection.createdAt).locale(lang).format("DD MMM, YYYY")}</p>
                      <p className="text-[10px] font-bold text-gray-400">{moment(objection.createdAt).locale(lang).fromNow()}</p>
                    </div>
                  </div>

                  {objection.repliedAt && (
                    <div className="flex justify-between items-center animate-in">
                      <span className="text-sm font-bold text-gray-500">{selectedContent[localizationKeys.replied]}</span>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900 dark:text-white">{moment(objection.repliedAt).locale(lang).format("DD MMM, YYYY")}</p>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{selectedContent[localizationKeys.responded]}</p>
                      </div>
                    </div>
                  )}

                  {objection.finalDecisionAt && (
                    <div className="flex justify-between items-center animate-in">
                      <span className="text-sm font-bold text-gray-500">{selectedContent[localizationKeys.resolution]}</span>
                      <div className="text-right">
                        <p className="text-sm font-black text-amber-600 dark:text-yellow-500">{moment(objection.finalDecisionAt).locale(lang).format("DD MMM, YYYY")}</p>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{selectedContent[localizationKeys.step3FinalDecision]}</p>
                      </div>
                    </div>
                  )}

                  {!objection.finalDecision && !isExpired && (
                    <div className="pt-4 border-t border-gray-50 dark:bg-white/5">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-500/5 rounded-2xl border border-yellow-100/50 dark:border-yellow-500/10">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="w-4 h-4 text-yellow-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-black text-yellow-700 dark:text-yellow-500 uppercase tracking-wider">{selectedContent[localizationKeys.awaitingResult]}</span>
                        </div>
                        <p className="text-xs font-medium text-yellow-800/70 dark:text-yellow-500/60 leading-relaxed">{selectedContent[localizationKeys.adminReviewDescription]}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Need Help Card */}
              <div className="p-8 bg-gradient-to-br from-gray-900 to-[#111827] rounded-[32px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h5 className="text-white font-black text-lg mb-2 uppercase tracking-tight">{selectedContent[localizationKeys.needAssistance]}</h5>
                  <p className="text-gray-400 text-sm font-medium mb-6 leading-relaxed">{selectedContent[localizationKeys.legalTeamDescription]}</p>
                  <button
                    onClick={() => history.push("/support")}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10 backdrop-blur-md"
                  >
                    {selectedContent[localizationKeys.contactSupport]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectionReply;