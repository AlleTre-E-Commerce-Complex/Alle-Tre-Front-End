import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import BugReportModal from "../../../component/shared/BugReportModal/BugReportModal";
import BugReportDetailsModal from "../../../component/shared/BugReportModal/BugReportDetailsModal";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { useAuthState } from "../../../context/auth-context";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import { format } from "date-fns";
import { FaChevronRight, FaBug, FaCommentDots } from "react-icons/fa";
import { useSocket } from "../../../context/socket-context";

const Support = () => {
  const [lang] = useLanguage("");
  const { user } = useAuthState();
  const socket = useSocket();
  const selectedContent = content[lang];
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [myReports, setMyReports] = useState([]);

  const { run: runFetchReports, isLoading } = useAxios([]);

  const fetchMyReports = useCallback(() => {
    runFetchReports(
      authAxios.get(api.app.bugReport.myReports).then((res) => {
        setMyReports(res.data.data);
      })
    ).catch((err) => {
      const msg = err?.message;
      const displayMsg = typeof msg === 'object' ? (msg[lang] || msg['en']) : msg;
      toast.error(displayMsg || "Failed to fetch reports");
    });
  }, [runFetchReports, lang]);

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user, fetchMyReports]);

  // Real-time updates for user unread counts and conversation sorting
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewAdminMessage = (data) => {
      setMyReports(prev => {
        const reportIdx = prev.findIndex(r => r.id === data.reportId);
        if (reportIdx !== -1) {
          const report = prev[reportIdx];
          const otherReports = prev.filter(r => r.id !== data.reportId);

          // Only increment if it's an admin message
          const isAdminMsg = !!data.message.adminId;
          const newUnreadCount = isAdminMsg ? (report.userUnreadCount || 0) + 1 : (report.userUnreadCount || 0);

          return [{
            ...report,
            userUnreadCount: newUnreadCount,
            updatedAt: new Date().toISOString()
          }, ...otherReports];
        } else {
          // If the report isn't in the list (e.g., just created), refresh
          fetchMyReports();
          return prev;
        }
      });
    };

    socket.on("new_bug_report_message", handleNewAdminMessage);
    
    return () => {
      socket.off("new_bug_report_message", handleNewAdminMessage);
    };
  }, [socket, user, fetchMyReports]);

  const handleOpenDetails = (id) => {
    setSelectedReportId(id);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: {
        key: localizationKeys.pending,
        color: "bg-red-500",
        shadow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]",
      },
      IN_PROGRESS: {
        key: localizationKeys.inProgress,
        color: "bg-yellow-500",
        shadow: "shadow-[0_0_12px_rgba(234,179,8,0.4)]",
      },
      SOLVED: {
        key: localizationKeys.solved,
        color: "bg-green-500",
        shadow: "shadow-[0_0_12px_rgba(34,197,94,0.4)]",
      },
    };

    const config = statusMap[status] || statusMap.PENDING;
    return (
      <div className="flex items-center justify-center gap-2 leading-none whitespace-nowrap min-w-fit">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary-dark/50 dark:text-white/40 leading-none whitespace-nowrap">
          {selectedContent[config.key] || status}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-145px)] mt-44 max-w-5xl mx-auto px-4 text-center pb-20">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-6 tracking-tight">
          {selectedContent[localizationKeys.support]}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {selectedContent[localizationKeys.howCanWeHelpYou]}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
        {/* Bug Report Card */}
        <div className="group bg-white dark:bg-white/5 p-8 rounded-[2rem] border-2 border-primary-veryLight dark:border-white/10 hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary-veryLight dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <FaBug className="w-10 h-10 text-primary dark:text-primary-light" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">
            {selectedContent[localizationKeys.reportBug]}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {selectedContent[localizationKeys.foundBugDescription]}
          </p>
          <button
            onClick={() => setIsBugReportOpen(true)}
            className="mt-auto w-full sm:w-auto bg-primary hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark text-white py-4 px-10 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95"
          >
            {selectedContent[localizationKeys.reportBug]}
          </button>
        </div>

        {/* Contact Support Card */}
        <div className="group bg-white dark:bg-white/5 p-8 rounded-[2rem] border-2 border-primary-veryLight dark:border-white/10 hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary-veryLight dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <FaCommentDots className="w-10 h-10 text-primary dark:text-primary-light" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">
            {selectedContent[localizationKeys.contactSupport]}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {selectedContent[localizationKeys.contactSupportDescription]}
          </p>
          <div className="flex flex-col gap-4 w-full mt-auto">
            <a
              href="mailto:info@3arbon.com"
              className="w-full bg-white dark:bg-white/10 hover:bg-primary-veryLight dark:hover:bg-white/20 text-primary dark:text-white border-2 border-primary dark:border-white/20 py-4 px-8 rounded-2xl font-semibold transition-all duration-300 text-center active:scale-95"
            >
              {selectedContent[localizationKeys.connectUs]}
            </a>
            <a
              href="tel:+971501400414"
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 text-center shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center gap-3 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+971 501400414</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bug Report History Section */}
      {user && (
        <div className="text-left mt-10 animate-fade-in px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary dark:text-white">
                {selectedContent[localizationKeys.myBugReports]}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedContent[localizationKeys.allYourBugs]}
              </p>
            </div>
          </div>

          {!isLoading && myReports.length === 0 ? (
            <div className="bg-white dark:bg-white/5 rounded-3xl p-12 border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400">
                <FaBug size={32} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {selectedContent[localizationKeys.noBugReportsFound]}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading && myReports.length === 0 ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-40 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />
                ))
              ) : (
                myReports.map((report) => (
                    <div 
                      key={report.id}
                      onClick={() => handleOpenDetails(report.id)}
                      className="group bg-white dark:bg-[#111827]/50 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10 hover:border-primary/30 dark:hover:border-[#d4af37]/30 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] cursor-pointer flex flex-col relative overflow-hidden active:scale-95"
                    >
                    {/* Decorative Background Element */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 dark:bg-white/5 rounded-full blur-3xl group-hover:bg-[#d4af37]/5 transition-colors duration-500" />
                    
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-primary/30 dark:text-white/20 font-mono tracking-widest">{selectedContent[localizationKeys.ref]}: #{report.id}</span>
                        {report.userUnreadCount > 0 && (
                          <div className="flex items-center gap-1.5 bg-red-500 text-white px-2.5 py-1 rounded-full shadow-lg shadow-red-500/20">
                            <span className="text-[8px] font-black uppercase tracking-widest">{selectedContent[localizationKeys.newLabel]}</span>
                            <div className="w-1 h-1 rounded-full bg-white opacity-50" />
                            <span className="text-[8px] font-black">{report.userUnreadCount}</span>
                          </div>
                        )}
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    <p className="text-primary-dark dark:text-gray-100 font-bold text-base line-clamp-2 leading-relaxed mb-6 group-hover:text-primary dark:group-hover:text-[#d4af37] transition-all duration-500">
                      {report.description}
                    </p>
                    
                    <div className="mt-auto flex justify-between items-center pt-6 border-t border-gray-50 dark:border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-primary/20 dark:text-white/10 uppercase tracking-widest">{selectedContent[localizationKeys.established]}</span>
                        <span className="text-[11px] font-black text-gray-400 dark:text-gray-500">
                            {format(new Date(report.createdAt || report.updatedAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:border-transparent group-hover:text-white transition-all duration-500">
                        <FaChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      <BugReportModal 
        open={isBugReportOpen} 
        setOpen={setIsBugReportOpen} 
        onSuccess={fetchMyReports} 
      />
      <BugReportDetailsModal 
        open={isDetailsOpen} 
        setOpen={setIsDetailsOpen} 
        reportId={selectedReportId}
        onNewMessage={fetchMyReports}
      />
    </div>
  );
};

export default Support;
