import React, { useEffect, useRef } from "react";
import { useChat } from "../../context/chat-context";
import { useAuthState } from "../../context/auth-context";
import { useLanguage } from "../../context/language-context";
import localizationKeys from "../../localization/localization-keys";
import content from "../../localization/content";
import { Icon } from "semantic-ui-react";
import moment from "moment";

const ChatMessageList = ({ isWidget = false }) => {
  const { messages, activeConversation } = useChat();
  const { user } = useAuthState();
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!activeConversation) return null;

  return (
    <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar relative transition-colors duration-300 ${isWidget ? "min-h-[300px]" : ""}`}>
      {/* Stay Safe Warning */}
      <div className="text-center mb-6">
        <div className={`inline-block bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl font-medium shadow-sm leading-relaxed backdrop-blur-sm transition-colors duration-300 ${isWidget ? "text-[10px] px-3 py-1.5" : "text-xs px-5 py-2.5"}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
             <Icon name="shield alternate" className="!m-0" />
             <span className="font-bold uppercase tracking-wider">{selectedContent[localizationKeys.staySafeOnAlletre]}</span>
          </div>
          {selectedContent[localizationKeys.staySafeMessage]}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full opacity-30 dark:opacity-40 py-10 text-gray-500 dark:text-gray-400">
           <Icon name="comments" size="huge" />
           <p className="mt-2 font-bold uppercase tracking-widest text-xs">Starting new chat</p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isMe = Number(msg.senderId) === Number(user?.id);
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const isGroupHeader = !prevMsg || prevMsg.senderId !== msg.senderId;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`max-w-[85%] ${isWidget ? "max-w-[90%]" : "md:max-w-[70%]"} ${isGroupHeader ? 'mt-3' : 'mt-0.5'}`}>
                <div
                  className={`p-2.5 px-4 rounded-2xl shadow-sm relative group transition-colors duration-300 ${
                    isMe
                      ? "bg-primary text-white rounded-tr-none ltr:ml-auto rtl:mr-auto"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700"
                  } ${isWidget ? "text-xs" : "text-sm"}`}
                >
                  {msg.content}
                </div>
                <div className={`flex items-center gap-1.5 mt-1 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold opacity-60">
                    {moment(msg.createdAt).format("HH:mm A")}
                  </span>
                  {isMe && (
                    <Icon 
                      name="check" 
                      size="tiny" 
                      className={`!m-0 ${msg.isRead ? "text-blue-400" : "text-gray-300"}`} 
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .animate-in {
          animation: in 0.3s ease-out forwards;
        }
        @keyframes in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChatMessageList;
