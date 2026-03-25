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
            className="fixed inset-0 bg-black/50 z-[100] md:hidden"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl z-[101] md:hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L12 12L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="pb-8">
                {children}
              </div>

              <div className="flex gap-4 mt-4 mb-2">
                <button 
                  onClick={() => {
                    onClear?.();
                    onClose();
                  }}
                  className="flex-1 py-4 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200"
                >
                  {selectedContent[localizationKeys.clear]}
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold"
                >
                  {selectedContent[localizationKeys.applyFilters]}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterModal;
