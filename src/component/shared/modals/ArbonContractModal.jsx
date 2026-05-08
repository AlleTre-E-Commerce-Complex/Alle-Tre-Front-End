import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useLanguage } from '../../../context/language-context';
import content from '../../../localization/content';
import localizationKeys from '../../../localization/localization-keys';
import { formatCurrency } from '../../../utils/format-currency';
import { IoClose } from 'react-icons/io5';

const ArbonContractModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  buyer, 
  seller, 
  product, 
  arbonAmount 
}) => {
  const [lang, setLang] = useLanguage();
  const selectedContent = content[lang];

  const contractLabels = {
    en: {
      title: "Arbon Deposit Agreement",
      parties: "Parties Details",
      item: "Item Details",
      buyer: "Buyer",
      seller: "Seller",
      name: "Name",
      email: "Email",
      productName: "Product Name",
      price: "Selling Price",
      deposit: "Deposit Amount (Arbon)",
      penalties: "Penalties & Disputes",
      penaltiesText: "If the transaction is not completed within 7 days, the deposit may be forfeited or returned based on the agreement between parties. Disputes shall be settled through Alletre platform mediation.",
      confirm: "Confirm & Proceed to Payment",
    },
    ar: {
      title: "اتفاقية العربون",
      parties: "تفاصيل الأطراف",
      item: "تفاصيل المنتج",
      buyer: "المشتري",
      seller: "البائع",
      name: "الاسم",
      email: "البريد الإلكتروني",
      productName: "اسم المنتج",
      price: "سعر البيع",
      deposit: "مبلغ العربون",
      penalties: "العقوبات والنزاعات",
      penaltiesText: "إذا لم يتم إكمال المعاملة في غضون 7 أيام، فقد يتم مصادرة العربون أو إعادته بناءً على الاتفاق بين الطرفين. يتم تسوية النزاعات من خلال وساطة منصة أليتري.",
      confirm: "تأكيد ومتابعة الدفع",
    }
  };

  const l = contractLabels[lang] || contractLabels.en;
  const isRtl = lang === 'ar';

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="!bg-transparent !border-none !shadow-none !max-w-[750px] w-[95%]"
    >
      <div className={`w-full bg-white dark:bg-[#0F172A] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.4)] flex flex-col ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="bg-primary/95 dark:bg-[#1E293B]/90 backdrop-blur-2xl text-white py-6 sm:py-8 px-6 sm:px-10 flex justify-between items-center border-b border-white/10">
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight leading-none mb-1">
              {l.title}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10 group"
            >
              <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase">
                {lang === 'en' ? 'العربية' : 'English'}
              </span>
            </button>

            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <IoClose size={24} className="sm:w-7 sm:h-7" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10 space-y-8 sm:space-y-10 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {/* Parties Section */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
              {l.parties}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-gray-50/50 dark:bg-white/[0.03] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 space-y-1">
                <p className="text-[9px] sm:text-[10px] font-black text-primary dark:text-yellow uppercase tracking-widest opacity-60 mb-2">{l.buyer}</p>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">{l.name}:</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                    {buyer?.userName || buyer?.name || buyer?.username || buyer?.email?.split('@')[0] || '---'}
                  </span>
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">{l.email}:</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{buyer?.email || '---'}</span>
                </div>
              </div>
              <div className="bg-gray-50/50 dark:bg-white/[0.03] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 space-y-1">
                <p className="text-[9px] sm:text-[10px] font-black text-primary dark:text-yellow uppercase tracking-widest opacity-60 mb-2">{l.seller}</p>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">{l.name}:</span>
                  <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                    {seller?.userName || seller?.name || seller?.username || seller?.email?.split('@')[0] || '---'}
                  </span>
                </div>
                <div className="flex flex-col pt-2">
                  <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase">{l.email}:</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{seller?.email || '---'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Item Section */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
              {l.item}
            </h3>
            <div className="bg-gray-950 dark:bg-white/[0.02] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-900 dark:border-white/10 space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3 sm:pb-4">
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-black uppercase tracking-widest">{l.productName}</span>
                <span className="font-black text-white text-sm sm:text-lg text-right ml-4">{product?.title}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3 sm:pb-4">
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-black uppercase tracking-widest">{l.price}</span>
                <span className="font-black text-white text-sm sm:text-lg">{formatCurrency(product?.ProductListingPrice)}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-[10px] sm:text-[11px] text-primary dark:text-yellow font-black uppercase tracking-[0.15em]">{l.deposit}</span>
                <span className="text-xl sm:text-3xl font-black text-white">{formatCurrency(arbonAmount)}</span>
              </div>
            </div>
          </div>

          {/* Penalties Section */}
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
              {l.penalties}
            </h3>
            <div className="bg-red-50/30 dark:bg-red-950/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-red-100/50 dark:border-red-900/20">
              <p className="text-[10px] sm:text-xs leading-relaxed text-gray-600 dark:text-gray-400 italic">
                {l.penaltiesText}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 sm:px-10 pb-8 sm:pb-12 pt-4 sm:pt-6">
          <button
            onClick={onConfirm}
            className="w-full bg-primary hover:bg-primary-dark dark:bg-yellow dark:hover:bg-yellow-dark text-white dark:text-black h-[60px] sm:h-[80px] rounded-full font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[11px] sm:text-[13px] transition-all duration-300 shadow-2xl shadow-primary/30 dark:shadow-yellow/20 active:scale-95 flex items-center justify-center gap-3 sm:gap-4 relative overflow-hidden group"
          >
            {/* Premium Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-2 ${isRtl ? 'rotate-180 group-hover:-translate-x-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>{l.confirm}</span>
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 20px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
      `}</style>
    </Modal>
  );
};

export default ArbonContractModal;
