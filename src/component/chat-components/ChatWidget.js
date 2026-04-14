import React from "react";
import { useChat } from "../../context/chat-context";
import ChatHeader from "./ChatHeader";
import ProductBar from "./ProductBar";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { Icon } from "semantic-ui-react";

const ChatWidget = () => {
  const { isWidgetOpen, isMinimized, toggleWidget, setMinimized, activeConversation } = useChat();

  if (!isWidgetOpen) return null;

  return (
    <div 
      className={`fixed z-[99999] transition-all duration-500 ease-in-out bg-white shadow-2xl flex flex-col border border-gray-100/50 backdrop-blur-xl pointer-events-auto ${
        isMinimized 
          ? "h-[64px] w-[300px] bottom-4 ltr:right-4 rtl:left-4 rounded-xl" 
          : "top-0 md:top-auto bottom-0 md:bottom-6 ltr:right-0 md:ltr:right-6 rtl:left-0 md:rtl:left-6 w-full md:w-[400px] h-full md:h-[600px] rounded-none md:rounded-2xl"
      }`}
    >
      {!activeConversation ? (
        <div className="flex-1 flex flex-col items-center justify-center p-10 relative">
           <button 
             onClick={() => toggleWidget(false)}
             className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
           >
             <Icon name="close" />
           </button>
           <Icon name="circle notched" loading size="big" className="text-primary" />
           <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
             Initializing Chat...
           </p>
        </div>
      ) : (
        <>
          <ChatHeader 
            isWidget={true} 
            isMinimized={isMinimized}
            onMinimize={() => setMinimized(!isMinimized)}
            onClose={() => toggleWidget(false)} 
          />
          
          {!isMinimized && (
            <>
              <ProductBar isWidget={true} />
              <ChatMessageList isWidget={true} />
              <ChatInput isWidget={true} />
            </>
          )}
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .chat-widget-enter {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
