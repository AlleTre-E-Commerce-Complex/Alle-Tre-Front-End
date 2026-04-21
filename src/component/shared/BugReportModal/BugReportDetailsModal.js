import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import { format } from "date-fns";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { useSocket } from "../../../context/socket-context";
import { useSupport } from "../../../context/support-context";

const BugReportDetailsModal = ({ open, setOpen, reportId, onNewMessage }) => {
  const [lang] = useLanguage("");
  const { refreshSupportCount } = useSupport();
  const socket = useSocket();
  const [report, setReport] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const selectedContent = content[lang];

  useEffect(() => {
    if (!socket || !reportId || !open) return;

    const room = `bug_report:${reportId}`;
    socket.emit("room:join", room);

    const handleNewMessage = (data) => {
      if (data.reportId === reportId) {
        setReport((prev) => {
          if (!prev) return prev;
          // Check if message already exists (e.g., if this client sent it)
          if (prev.messages.some((m) => m.id === data.message.id)) return prev;
          return {
            ...prev,
            messages: [...prev.messages, data.message],
          };
        });
        if (onNewMessage) onNewMessage();
        refreshSupportCount();
      }
    };

    socket.on("new_bug_report_message", handleNewMessage);

    return () => {
      socket.emit("room:leave", room);
      socket.off("new_bug_report_message", handleNewMessage);
    };
  }, [socket, reportId, open, onNewMessage]);

  const { run: runFetchDetails, isLoading } = useAxios([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchDetails = useCallback(() => {
    runFetchDetails(
      authAxios.get(api.app.bugReport.details(reportId)).then((res) => {
        setReport(res.data.data);
        refreshSupportCount();
      })
    ).catch((err) => {
      const msg = err?.message;
      const displayMsg = typeof msg === 'object' ? (msg[lang] || msg['en']) : msg;
      toast.error(displayMsg || "Failed to fetch details");
    });
  }, [reportId, runFetchDetails, lang]);

  useEffect(() => {
    if (open && reportId) {
      fetchDetails();
      if (onNewMessage) onNewMessage();
    }
  }, [open, reportId, fetchDetails, onNewMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [report?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    authAxios
      .post(api.app.bugReport.addMessage(reportId), { message: newMessage })
      .then((res) => {
        setNewMessage("");
        if (onNewMessage) onNewMessage();
      })
      .catch((err) => {
        toast.error(err.message || "Failed to send message");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return selectedContent[localizationKeys.pending] || status;
      case "IN_PROGRESS":
        return selectedContent[localizationKeys.inProgress] || status;
      case "SOLVED":
        return selectedContent[localizationKeys.solved] || status;
      default:
        return status;
    }
  };

  return (
    <Modal
      className="sm:w-[700px] w-[95%] h-[85vh] bg-transparent scale-in !border-none !shadow-none"
      onClose={() => setOpen(false)}
      open={open}
    >
      <div className="w-full h-full rounded-[2.5rem] bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-white/10 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex flex-col relative">
        {/* High-Contrast Header */}
        <div className="bg-[#0F172A] dark:bg-[#1E293B]/90 backdrop-blur-2xl text-white px-8 py-6 flex justify-between items-center z-10 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center ring-1 ring-white/20">
              <span className="font-black text-xs text-white">#{reportId}</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none capitalize text-white">
                {selectedContent[localizationKeys.details]}
              </h1>
              {report && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${
                    report.status === 'SOLVED' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                    report.status === 'IN_PROGRESS' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  }`} />
                  <span className={`text-[9px] font-black uppercase tracking-widest text-white/70`}>
                    {getStatusLabel(report.status)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 hover:rotate-90 transition-all duration-500">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
          {isLoading && !report ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest text-primary dark:text-white">{selectedContent[localizationKeys.synchronizing]}</p>
            </div>
          ) : report ? (
            <>
              {/* Contextual Intelligence Section */}
              <div className="bg-gray-50/50 dark:bg-white/[0.03] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <FaPaperPlane size={60} className="-rotate-12" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-primary/50 dark:text-white/30 uppercase tracking-[0.3em] mb-3">
                    {selectedContent[localizationKeys.description]}
                  </p>
                  <p className="text-primary-dark dark:text-gray-100 text-base font-semibold leading-relaxed whitespace-pre-wrap italic">
                    "{report.description}"
                  </p>
                  {report.images?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-6">
                      {report.images.map((img, i) => (
                        <a 
                          key={i} 
                          href={img.imageLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/50 dark:border-white/10 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
                        >
                          <img src={img.imageLink} className="w-full h-full object-cover" alt="Attachment" />
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <span className="text-[9px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest bg-gray-100/50 dark:bg-white/5 px-3 py-1 rounded-full">
                      {selectedContent[localizationKeys.established]} {format(new Date(report.createdAt), "hh:mm a, MMM d")}
                    </span>
                  </div>
                </div>
              </div>

              {/* High-Fidelity Discussion Feed */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 opacity-30">
                  <div className="flex-1 h-px bg-primary dark:bg-white" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary dark:text-white">
                    {selectedContent[localizationKeys.chronology]}
                  </span>
                  <div className="flex-1 h-px bg-primary dark:bg-white" />
                </div>

                {report.messages?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 opacity-20 grayscale">
                    <FaPaperPlane size={40} className="mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">{selectedContent[localizationKeys.awaitingResponse]}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {report.messages.map((msg, i) => {
                      const isUser = !!msg.userId;
                      return (
                        <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[85%] rounded-[1.5rem] px-6 py-3 shadow-xl transition-all duration-300 hover:shadow-2xl ${
                            isUser 
                              ? "bg-primary text-white rounded-br-lg" 
                              : "bg-gray-100 dark:bg-white/10 text-primary-dark dark:text-white rounded-bl-lg border border-gray-200/50 dark:border-white/5"
                          }`}>
                           
                            <p className="text-sm font-semibold leading-relaxed">{msg.message}</p>
                          </div>
                          <div className={`mt-2 px-3 flex items-center gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                            <span className="text-[9px] font-black text-primary/30 dark:text-white/20 uppercase tracking-widest">
                                {isUser ? selectedContent[localizationKeys.you] : selectedContent[localizationKeys.supportLabel]}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/10" />
                            <span className="text-[9px] font-black text-primary/30 dark:text-white/20">
                                {format(new Date(msg.createdAt), "hh:mm a")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Minimalist Interactive Area */}
        <div className="p-8 bg-white dark:bg-[#0F172A] border-t border-gray-50 dark:border-white/5">
          <div className="relative group">
            <div className="flex gap-4 items-center bg-gray-50/80 dark:bg-white/[0.03] border-2 border-transparent focus-within:border-primary/20 focus-within:bg-white dark:focus-within:bg-white/[0.05] transition-all duration-500 rounded-[2rem] px-6 py-3 shadow-inner">
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-primary-dark dark:text-white py-2 text-sm font-bold placeholder:text-gray-400 dark:placeholder:text-white/20"
                placeholder={selectedContent[localizationKeys.typeAMessage]}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isSending}
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !newMessage.trim()}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isSending || !newMessage.trim() 
                    ? "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/10 cursor-not-allowed grayscale" 
                    : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 hover:rotate-6"
                }`}
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaPaperPlane size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .scale-in { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleIn {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 20px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
      `}</style>
    </Modal>
  );
};

export default BugReportDetailsModal;
