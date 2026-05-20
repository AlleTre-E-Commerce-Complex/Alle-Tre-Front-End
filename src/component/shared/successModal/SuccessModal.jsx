import React from "react";
import { Modal } from "semantic-ui-react";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import routes from "routes";
import { FaCheck } from "react-icons/fa";

const SuccessModal = ({open, setOpen,message,returnUrl,isWithdrawal,isAddAccount,closeAddNewBankAccountModal}) => {
    const history = useHistory()
    const [lang] = useLanguage(""); 
    const selectedContent = content[lang];
    
    const HandleSubmit = () => {
        setOpen(false)
        if(isAddAccount)
          closeAddNewBankAccountModal(false)
        else if(isWithdrawal)
          history.push(returnUrl)
        else
          history.push(routes.app.profile.myAuctions.active)
    };
  
    return (
      <Modal
        className="w-full h-auto bg-transparent scale-in max-w-md mx-auto"
        onOpen={() => setOpen(true)}
        open={open}
      >
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[80] p-4">
          <div className="bg-white dark:bg-[#1a1c23] border border-gray-100 dark:border-gray-700 rounded-3xl shadow-2xl w-full max-w-[450px] overflow-hidden transform transition-all duration-300 relative animate-fade-in-up text-center p-8">
            
            {/* Custom Premium Success Icon */}
            <div className="mx-auto w-24 h-24 mb-8 relative flex items-center justify-center">
              {/* Animated glow rings */}
              <div className="absolute inset-0 bg-[#d4af37] opacity-20 rounded-full animate-ping" style={{animationDuration: '3s'}}></div>
              <div className="absolute inset-2 bg-[#d4af37] opacity-30 rounded-full animate-pulse"></div>
              
              {/* Solid Check Circle */}
              <div className="relative w-16 h-16 bg-gradient-to-br from-[#eac566] to-[#d4af37] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.5)] z-10 transform transition-transform hover:scale-110 duration-300">
                <FaCheck className="text-gray-900 text-3xl font-bold" />
              </div>
            </div>
            
            {/* Message */}
            <div className="px-2 mb-8">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
                {message}
              </h1>
            </div>
            
            {/* Action Button */}
            <button
              className="w-full sm:w-auto min-w-[160px] px-8 py-3 rounded-xl font-bold text-gray-900 text-base shadow-lg transition-all duration-300 bg-gradient-to-r from-[#eac566] to-[#d4af37] hover:shadow-xl hover:shadow-[#d4af37]/40 transform hover:-translate-y-0.5"
              onClick={HandleSubmit}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    );
}

export default SuccessModal
