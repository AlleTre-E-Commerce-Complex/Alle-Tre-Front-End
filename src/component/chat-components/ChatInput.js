import React, { useState } from "react";
import { useChat } from "../../context/chat-context";
import { useLanguage } from "../../context/language-context";
import localizationKeys from "../../localization/localization-keys";
import content from "../../localization/content";
import { Icon, Button } from "semantic-ui-react";

const ChatInput = ({ isWidget = false }) => {
  const { sendMessage, activeConversation } = useChat();
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [newMessage, setNewMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeConversation) return null;

  return (
    <div className={`p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 z-20 transition-colors duration-300 ${isWidget ? "rounded-b-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.03)]" : "md:p-6"}`}>
      {/* Quick suggestions */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 no-scrollbar ltr:flex-row rtl:flex-row-reverse">
        {[
          selectedContent[localizationKeys.isItStillAvailable],
          selectedContent[localizationKeys.whatsYourFinalPrice],
          selectedContent[localizationKeys.canISeeIt],
        ].map((text, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(text)}
            className="whitespace-nowrap bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold hover:border-primary hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all shadow-sm"
          >
            {text}
          </button>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        {/* {!isWidget && (
          <Button 
            basic 
            icon 
            circular 
            type="button" 
            onClick={() => setShowOptions(!showOptions)}
            className={`!m-0 h-10 w-10 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 ${showOptions ? 'rotate-45 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Icon name="add" className="!m-0" />
          </Button>
        )} */}
        <div className="flex-1 relative">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={selectedContent[localizationKeys.typeAMessage]}
            rows={1}
            className={`w-full py-2.5 px-4 pr-10 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary/10 focus:border-primary dark:text-white transition-all outline-none resize-none overflow-hidden max-h-32 ${isWidget ? "text-xs" : "text-sm"}`}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          {/* <div className="absolute right-3 bottom-2.5 flex items-center">
            <Icon 
                name="smile outline" 
                className="text-gray-300 dark:text-gray-500 cursor-pointer hover:text-primary dark:hover:text-primary transition-colors text-lg" 
            />
          </div> */}
        </div>
        <Button 
           primary 
           circular 
           icon 
           type="submit"
           disabled={!newMessage.trim()}
           className={`!m-0 shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center ${isWidget ? "h-10 w-10" : "h-12 w-12"} ${!newMessage.trim() ? 'opacity-50' : 'opacity-100'}`}
        >
          <Icon name={lang === 'ar' ? "send" : "send"} className={`!m-0 ${lang === 'ar' ? "rotate-180" : ""}`} />
        </Button>
      </form>

      {/* Expandable Options Drawer */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showOptions ? 'max-h-64 pt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-sm mx-auto pb-4">
          <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setShowOptions(false)}>
            <div className="w-14 h-14 rounded-full bg-[#E5F6E7] dark:bg-green-900/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-transparent dark:border-green-800/50">
              <Icon name="map marker alternate" className="!m-0 text-[1.4rem] text-[#2CB053] dark:text-green-400" />
            </div>
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{lang === 'ar' ? 'الموقع' : 'Location'}</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setShowOptions(false)}>
            <div className="w-14 h-14 rounded-full bg-[#FFF1DE] dark:bg-orange-900/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-transparent dark:border-orange-800/50">
              <Icon name="image" className="!m-0 text-[1.4rem] text-[#FFB038] dark:text-orange-400" />
            </div>
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{lang === 'ar' ? 'المعرض' : 'Gallery'}</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setShowOptions(false)}>
            <div className="w-14 h-14 rounded-full bg-[#E1F0FF] dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-transparent dark:border-blue-800/50">
              <Icon name="camera" className="!m-0 text-[1.4rem] text-[#2D99FF] dark:text-blue-400" />
            </div>
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{lang === 'ar' ? 'الكاميرا' : 'Camera'}</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => setShowOptions(false)}>
            <div className="w-14 h-14 rounded-full bg-[#FFE5F1] dark:bg-pink-900/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-transparent dark:border-pink-800/50">
              <Icon name="file alternate" className="!m-0 text-[1.4rem] text-[#FF4D9B] dark:text-pink-400" />
            </div>
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{lang === 'ar' ? 'مستند' : 'Document'}</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
