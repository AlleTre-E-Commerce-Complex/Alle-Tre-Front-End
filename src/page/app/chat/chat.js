import React, { useEffect } from "react";
import { useChat } from "../../../context/chat-context";
import { useAuthState } from "../../../context/auth-context";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";
import { Icon } from "semantic-ui-react";
import moment from "moment";
import "moment/locale/ar";
import ChatHeader from "../../../component/chat-components/ChatHeader";
import ProductBar from "../../../component/chat-components/ProductBar";
import ChatMessageList from "../../../component/chat-components/ChatMessageList";
import ChatInput from "../../../component/chat-components/ChatInput";

const Chat = () => {
  const {
    conversations,
    activeConversation,
    selectConversation,
    unreadCount,
    setIsChatPageActive,
  } = useChat();
  const { user } = useAuthState();
  const [lang] = useLanguage();
  const selectedContent = content[lang];

  useEffect(() => {
    setIsChatPageActive(true);
    return () => setIsChatPageActive(false);
  }, [setIsChatPageActive]);

  useEffect(() => {
    moment.locale(lang);
  }, [lang]);

  return (
    <div className="chat-page-container mt-32 md:mt-40 mb-0 md:mb-10 px-0 md:px-4 w-full max-w-7xl mx-auto flex flex-col md:flex-row h-[calc(100dvh-12rem)] md:h-[75vh] bg-white dark:bg-gray-900 rounded-none md:rounded-2xl shadow-none md:shadow-2xl overflow-hidden border-0 md:border border-gray-100 dark:border-gray-800 transition-colors duration-300">
      {/* Sidebar: Conversations List */}
      <div className={`w-full md:w-80 lg:w-96 flex-1 md:flex-none border-r border-gray-100 dark:border-gray-800 flex flex-col min-h-0 overflow-hidden ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-gray-50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-800/20">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-between">
            {selectedContent[localizationKeys.chats]}
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                {unreadCount}
              </span>
            )}
          </h1>
          <div className="mt-4 relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={selectedContent[localizationKeys.search]} 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white transition-all text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center opacity-60">
              <Icon name="chat" size="huge" className="mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {selectedContent[localizationKeys.noConversationsYet]}
              </p>
            </div>
          ) : (
            conversations.map((conv) => {
              const lastMsg = conv.messages[0];
              const isSelected = activeConversation?.id === conv.id;
              const otherUser = conv.sellerId === user.id ? conv.buyer : conv.seller;
              const unread = lastMsg && !lastMsg.isRead && lastMsg.senderId !== user.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 border-l-4 ${
                    isSelected 
                      ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-inner" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={otherUser?.imageLink || "/logo512.png"}
                      alt={otherUser?.userName}
                      className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-2 ring-white dark:ring-gray-800"
                      onError={(e) => { e.target.src = "/logo512.png" }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold truncate ${unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 font-semibold'}`}>
                        {otherUser?.userName}
                      </h3>
                      <span className="text-[10px] text-gray-400 shrink-0 font-medium uppercase">
                        {lastMsg ? moment(lastMsg.createdAt).format("HH:mm") : ""}
                      </span>
                    </div>
                    <p className={`text-sm truncate flex items-center gap-1 ${unread ? "text-gray-900 dark:text-gray-200 font-bold" : "text-gray-500 dark:text-gray-400"}`}>
                      {lastMsg?.senderId === user.id && <Icon name="reply" size="small" className="mr-0.5 opacity-50" />}
                      {lastMsg?.content || selectedContent[localizationKeys.noMessagesYet]}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md font-bold truncate max-w-[120px]">
                        {conv.product?.title}
                      </span>
                    </div>
                  </div>
                  {unread && <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]"></div>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Area: Messages */}
      <div className={`flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50 dark:bg-gray-900 relative ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="w-64 h-64 mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center animate-pulse">
                <Icon name="comments" size="huge" className="text-primary/20 dark:text-primary/10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {selectedContent[localizationKeys.yourConversations]}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
              {selectedContent[localizationKeys.selectConversationFromSidebar]}
            </p>
          </div>
        ) : (
          <>
            <ChatHeader isWidget={false} />
            <ProductBar isWidget={false} />
            <ChatMessageList isWidget={false} />
            <ChatInput isWidget={false} />
          </>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Chat;
