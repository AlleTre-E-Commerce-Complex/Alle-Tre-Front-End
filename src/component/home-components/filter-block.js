import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { motion } from "framer-motion";

const FilterBlock = ({ title, children, isPadding = true, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white dark:bg-[#1e2738] border border-gray-200 dark:border-[#d4af37]/40 rounded-xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mb-4">
      <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer px-4 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-[#2a3648] transition-colors">
        <h3 className="font-bold text-[11px] uppercase tracking-widest text-[#d4af37]">{title}</h3>
        {isExpanded ? (
          <MdKeyboardArrowUp className="text-xl text-[#1e2738] dark:text-gray-300" />
        ) : (
          <MdKeyboardArrowDown className="text-xl text-[#1e2738] dark:text-gray-300" />
        )}
      </div>
      {isExpanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.1, ease: "linear" }} className={isPadding ? "px-4 pb-4" : ""}>
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default FilterBlock;
