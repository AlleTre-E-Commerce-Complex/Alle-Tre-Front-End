import React, { useState } from "react";
import { Modal, Checkbox } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { IoClose } from "react-icons/io5";
import { TermAndConditionData } from "./TermsAndCondition";

const TermsAndConditionsModal = ({ open, setOpen, onList, onDraft, isLoading }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [agreed, setAgreed] = useState(false);

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
      setAgreed(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="sm:w-[600px] w-[95%] h-auto bg-transparent !border-none !shadow-none"
    >
      <div className="w-full h-auto rounded-[2.5rem] bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-white/10 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-primary/95 dark:bg-[#1E293B]/90 backdrop-blur-2xl text-white py-6 px-8 flex justify-between items-center shadow-md border-b border-white/10">
          <h1 className="text-xl font-black tracking-tight uppercase">
            {selectedContent[localizationKeys.termsAndCondition]}
          </h1>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar">
          <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-5">
            {TermAndConditionData.map((item, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-gray-900 dark:text-white font-black text-lg uppercase tracking-tight">
                  {item.title[lang]}
                </h3>
                <div className="font-medium opacity-80 list-none">
                  {item.parag[lang]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => !isLoading && setAgreed(!agreed)}>
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${agreed ? 'bg-primary border-primary dark:bg-yellow dark:border-yellow' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/5'}`}>
              {agreed && (
                <svg className="w-4 h-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <label className="text-sm font-black text-gray-700 dark:text-gray-300 cursor-pointer select-none">
              {selectedContent[localizationKeys.iAgreetotheTermsConditions]}
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 px-8 pb-10 pt-4">
          <button
            className={`flex-1 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-primary dark:text-white border-2 border-gray-100 dark:border-white/10 h-14 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${isLoading ? 'opacity-40 cursor-not-allowed' : ''}`}
            onClick={onDraft}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            {selectedContent[localizationKeys.saveAsDraft]}
          </button>
          <button
            className={`flex-[2] bg-primary hover:bg-primary-dark dark:bg-yellow dark:hover:bg-yellow-dark text-white dark:text-black h-14 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-xl shadow-primary/20 dark:shadow-yellow/10 active:scale-95 flex items-center justify-center gap-3 ${(!agreed || isLoading) ? 'opacity-40 cursor-not-allowed' : ''}`}
            onClick={onList}
            disabled={!agreed || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>{selectedContent[localizationKeys.processing]}</span>
              </div>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                {selectedContent[localizationKeys.listItem]}
              </>
            )}
          </button>

          
        </div>
      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 20px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
      `}</style>
    </Modal>
  );
};

export default TermsAndConditionsModal;
