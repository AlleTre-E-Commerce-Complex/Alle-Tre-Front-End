import React from "react";
import { useHistory } from "react-router-dom";
import routes from "../../routes";
import { Icon, Button } from "semantic-ui-react";
import { useChat } from "../../context/chat-context";
import { useAuthState } from "../../context/auth-context";
import { useLanguage } from "../../context/language-context";
import localizationKeys from "../../localization/localization-keys";
import content from "../../localization/content";

const ChatHeader = ({ isWidget = false, onClose, onMinimize, isMinimized }) => {
  const { activeConversation, selectConversation, toggleWidget, onlineUsers } = useChat();
  const { user } = useAuthState();
  const [lang] = useLanguage();
  const history = useHistory();
  const selectedContent = content[lang];

  if (!activeConversation) return null;

  const otherUser = activeConversation.sellerId === user.id ? activeConversation.buyer : activeConversation.seller;
  // Resilient check: try socket state (string-safe) then fallback to API data
  const isOnline = onlineUsers[String(otherUser?.id)] ?? otherUser?.isOnline;

  const handleBack = () => {
    if (isWidget) {
      toggleWidget(false);
    } else {
      selectConversation(null);
    }
  };

  const handleExpand = () => {
    toggleWidget(false);
    history.push(routes.app.chat);
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-white dark:bg-[#0b1120] border-b border-gray-100 dark:border-blue-900/30 sticky top-0 z-20 transition-colors duration-300 ${isWidget ? "rounded-t-2xl shadow-sm md:rounded-t-2xl rounded-none" : ""}`}>
      <div className="flex-1 min-w-0 flex items-center gap-3">
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
            className={`${isWidget ? "w-9 h-9" : "w-12 h-12"} rounded-xl object-cover shadow-sm ring-2 ring-white dark:ring-gray-800`}
            onError={(e) => { e.target.src = "/logo512.png" }}
          />
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white dark:border-gray-900 rounded-full shadow-sm transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 truncate">
            <h2 className={`font-bold text-gray-800 dark:text-white leading-tight truncate ${isWidget ? "text-xs" : "text-lg"}`}>
              {otherUser?.userName}
            </h2>
            <span className={`text-[9px] font-bold uppercase tracking-wider shrink-0 transition-colors duration-300 ${isOnline ? 'text-green-600' : 'text-gray-500/60'}`}>
              {selectedContent[isOnline ? localizationKeys.online : localizationKeys.offline]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        {isWidget ? (
          <>
            <button 
                onClick={handleExpand}
                className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary dark:text-yellow-500 hover:bg-primary/5 dark:hover:bg-yellow-500/10 rounded-md transition-all mr-1"
            >
              {selectedContent[localizationKeys.expand]}
            </button>
            <button 
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-500 dark:text-gray-400 group"
                onClick={onMinimize}
                title={isMinimized ? "Maximize" : "Minimize"}
            >
              <Icon name={isMinimized ? "chevron up" : "chevron down"} className="!m-0 !p-0 leading-none flex items-center justify-center" />
            </button>
            <button 
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 group"
                onClick={onClose}
                title="Close"
            >
              <Icon name="close" className="!m-0 !p-0 leading-none flex items-center justify-center" />
            </button>
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
              <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-400 dark:text-gray-500">
                <Icon name="info circle" className="!m-0" />
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
