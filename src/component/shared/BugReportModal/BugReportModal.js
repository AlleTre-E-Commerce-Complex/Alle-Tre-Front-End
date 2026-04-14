import React, { useState } from "react";
import { Modal } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import useAxios from "../../../hooks/use-axios";
import { authAxios, axios } from "../../../config/axios-config";
import api from "../../../api";
import { useAuthState } from "../../../context/auth-context";

const BugReportModal = ({ open, setOpen, onSuccess }) => {
  const [lang] = useLanguage("");
  const { user } = useAuthState();
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [images, setImages] = useState([]);
  const selectedContent = content[lang];
  
  const { run: runBugReport, isLoading } = useAxios([]);

  const onCancelHandler = () => {
    setImages([]);
    setDescription("");
    setEmail("");
    setOpen(false);
  };

  const handleSelectImage = (e) => {
    try {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        toast.error(selectedContent[localizationKeys.max5Images]);
        return;
      }
      if (files.length > 0) {
        setImages([...images, ...files]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmitBugReport = () => {
    if (description === "") {
      toast.error(selectedContent[localizationKeys.PleaseGiveTheDescription] || "Please provide a description");
      return;
    }

    if (!user && email === "") {
      toast.error(selectedContent[localizationKeys.provideEmailAddress]);
      return;
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append(`images`, image);
    });
    formData.append("description", description);
    if (email) {
      formData.append("email", email);
    }

    const axiosInstance = user ? authAxios : axios;

    runBugReport(
      axiosInstance
        .post(api.app.bugReport.create, formData)
        .then((res) => {
          if (res?.data?.success) {
            toast.success(selectedContent[localizationKeys.ThankYouForYourSubmission] || "Thank you for reporting this bug!");
            onCancelHandler();
            if (onSuccess) onSuccess();
          } else {
            toast.error(selectedContent[localizationKeys.SorryYourSubmissionHasFailedPleaseTryAgainLater] || "Submission failed. Please try again later.");
          }
        })
        .catch((err) => {
          const msg = err?.message;
          const displayMsg = typeof msg === 'object' ? (msg[lang] || msg['en']) : msg;
          toast.error(displayMsg || "Something went wrong");
        })
    );
  };

  return (
    <Modal
      className="sm:w-[550px] w-[95%] h-auto bg-transparent scale-in !border-none !shadow-none"
      onClose={onCancelHandler}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <div className="w-full h-auto rounded-[2.5rem] bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-white/10 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex flex-col relative">
        {/* Glassmorphic Header */}
        <div className="bg-primary/95 dark:bg-[#1E293B]/90 backdrop-blur-2xl text-white py-6 px-8 shadow-md rounded-t-[2.4rem] border-b border-white/10">
          <h1 className="text-xl font-black tracking-tight uppercase">{selectedContent[localizationKeys.reportBug] || "Report a Bug"}</h1>
        </div>
        
        <div className="px-8 py-8 space-y-6">
          {!user && (
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-primary/50 dark:text-white/30 uppercase tracking-[0.2em] ml-1">
                {selectedContent[localizationKeys.correspondenceEmail]}
              </label>
              <input
                type="email"
                className="w-full bg-gray-50/50 dark:bg-white/[0.03] border-gray-100 dark:border-white/10 border-2 h-14 rounded-2xl px-5 outline-none focus:border-primary/20 focus:bg-white dark:focus:bg-white/5 text-primary-dark dark:text-white transition-all duration-300 placeholder:text-gray-400 font-bold"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-primary/50 dark:text-white/30 uppercase tracking-[0.2em] ml-1">
              {selectedContent[localizationKeys.issueNarrative]}
            </label>
            <textarea
              className="w-full bg-gray-50/50 dark:bg-white/[0.03] border-gray-100 dark:border-white/10 border-2 h-40 rounded-2xl px-5 py-4 outline-none focus:border-primary/20 focus:bg-white dark:focus:bg-white/5 text-primary-dark dark:text-white transition-all duration-300 placeholder:text-gray-400 font-bold resize-none leading-relaxed"
              placeholder={selectedContent[localizationKeys.detailTheAnomaly]}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <input
              className="hidden"
              type="file"
              multiple
              accept="image/*"
              name="BugImages"
              id="uploadBugImages"
              onChange={handleSelectImage}
            />
            <label
              className="group cursor-pointer border-2 border-dashed border-gray-100 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 block rounded-[2rem] px-6 py-8 text-primary dark:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/5 text-center transition-all duration-500"
              htmlFor="uploadBugImages"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <p className="font-black uppercase tracking-widest text-[11px]">
                        {selectedContent[localizationKeys.attachMedia]}
                    </p>
                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 block">
                        Limit: 5 {selectedContent[localizationKeys.visuals]}
                    </span>
                </div>
              </div>
            </label>
          </div>

          {images.length > 0 && (
            <div className="showImages flex flex-wrap gap-4 mt-2 max-h-[180px] overflow-y-auto p-1 custom-scrollbar">
              {images.map((file, index) => (
                <div key={index} className="relative group w-20 h-20 rounded-2xl overflow-hidden shadow-xl ring-2 ring-transparent hover:ring-primary/30 transition-all duration-300">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="bg-red-500 text-white p-2.5 rounded-xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                      <FaTrash size={14} />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 px-8 pb-10">
          <button
            className={`flex-[2] bg-primary hover:bg-primary-dark text-white h-14 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmitBugReport}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{selectedContent[localizationKeys.processing]}</span>
              </div>
            ) : selectedContent[localizationKeys.dispatchReport]}
          </button>

          <button
            className="flex-1 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-primary dark:text-white border border-gray-100 dark:border-white/10 h-14 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 active:scale-95"
            onClick={onCancelHandler}
            disabled={isLoading}
          >
            {selectedContent[localizationKeys.retreat]}
          </button>
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

export default BugReportModal;
