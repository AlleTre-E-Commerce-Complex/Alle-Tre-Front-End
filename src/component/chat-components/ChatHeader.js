import React from "react";
import { Icon, Button } from "semantic-ui-react";
import { useChat } from "../../context/chat-context";
import { useAuthState } from "../../context/auth-context";
import { useLanguage } from "../../context/language-context";
import localizationKeys from "../../localization/localization-keys";
import content from "../../localization/content";

const ChatHeader = ({ isWidget = false, onClose, onMinimize, isMinimized }) => {
  const { activeConversation, selectConversation, toggleWidget } = useChat();
  const { user } = useAuthState();
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  if (!activeConversation) return null;

  const otherUser = activeConversation.sellerId === user.id ? activeConversation.buyer : activeConversation.seller;

  const handleBack = () => {
    if (isWidget) {
      toggleWidget(false);
    } else {
      selectConversation(null);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 transition-colors duration-300 ${isWidget ? "rounded-t-2xl shadow-sm md:rounded-t-2xl rounded-none" : ""}`}>
      <div className="flex items-center gap-3">
        <button 
          onClick={handleBack} 
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-gray-300"
        >
          <Icon name="arrow left" />
        </button>
        <div className="relative shrink-0">
          <img
            src={otherUser?.imageLink || "/logo512.png"}
            alt={otherUser?.userName}
            className={`${isWidget ? "w-10 h-10" : "w-12 h-12"} rounded-xl object-cover shadow-sm ring-2 ring-white dark:ring-gray-800`}
            onError={(e) => { e.target.src = "/logo512.png" }}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>
        <div className="min-w-0">
          <h2 className={`font-bold text-gray-800 dark:text-white leading-tight truncate ${isWidget ? "text-sm" : "text-lg"}`}>
            {otherUser?.userName}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="flex w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
              {selectedContent[localizationKeys.online]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {isWidget ? (
          <>
            <Button 
                basic 
                icon 
                circular 
                className="!m-0 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center h-8 w-8"
                onClick={onMinimize}
            >
              <Icon name={isMinimized ? "chevron up" : "chevron down"} className="!m-0 text-gray-500 dark:text-gray-400" />
            </Button>
            <Button 
                basic 
                icon 
                circular 
                className="!m-0 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center h-8 w-8"
                onClick={onClose}
            >
              <Icon name="close" className="!m-0 text-gray-500 dark:text-gray-400" />
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
             <div className="hidden lg:flex flex-col items-end mr-3">
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">
                  {selectedContent[localizationKeys.referringTo]}
                </span>
                <span className="text-xs font-bold text-primary dark:text-yellow-500 truncate max-w-[180px]">
                  {activeConversation.product?.title}
                </span>
              </div>
              <Button basic icon circular className="!p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Icon name="info circle" className="text-gray-400 dark:text-gray-500 !m-0" />
              </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
