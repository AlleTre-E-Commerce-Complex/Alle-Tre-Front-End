import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import localizationKeys from 'localization/localization-keys';
import { useLanguage } from '../../context/language-context';
import content from '../../localization/content';

const MobileFilterModal = ({ isOpen, onClose, onClear, title, children }) => {

   const [lang] = useLanguage();
  const selectedContent = content[lang];
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[1000] md:hidden"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl z-[1001] md:hidden max-h-[90vh] flex flex-col shadow-2xl"
          >
            {/* Modal Header */}
            <div className="p-6 pb-2 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L12 12L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-hide">
              <div className="pb-4">
                {children}
              </div>
            </div>

            {/* Fixed Footer at the bottom */}
            <div className="p-6 pt-3 pb-24 border-t border-gray-100 dark:border-gray-800 flex gap-4 bg-white dark:bg-gray-900 px-6">
              <button 
                onClick={() => {
                  onClear?.();
                  onClose();
                }}
                className="flex-1 py-3.5 border border-gray-300 dark:border-gray-600 rounded-lg font-bold text-gray-700 dark:text-gray-200 transition-colors active:bg-gray-50"
              >
                {selectedContent[localizationKeys.clear]}
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-3.5 bg-[#1a1e26] dark:bg-white text-white dark:text-[#1a1e26] rounded-lg font-bold transition-transform active:scale-[0.98]"
              >
                {selectedContent[localizationKeys.applyFilters]}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterModal;
