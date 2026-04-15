import React, { useState, useRef } from "react";
import { useChat } from "../../context/chat-context";
import { useLanguage } from "../../context/language-context";
import localizationKeys from "../../localization/localization-keys";
import content from "../../localization/content";
import { Icon, Button } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import { compressChatMedia } from "../../utils/compression";

const ChatInput = ({ isWidget = false }) => {
  const { sendMessage, uploadChatFile, activeConversation } = useChat();
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [newMessage, setNewMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("Uploading...");

  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const docRef = useRef(null);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleLocationShare = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setShowOptions(false);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendMessage({
          type: "LOCATION",
          lat: latitude,
          lng: longitude,
          content: `Location: ${latitude}, ${longitude}`,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to get your location");
      }
    );
  };

  const handleFileSelect = async (e, type) => {
    const originalFiles = Array.from(e.target.files);
    if (!originalFiles.length) return;

    setShowOptions(false);
    setIsUploading(true);
    setUploadStatus("Processing..."); // New state or internal tracker
    
    try {
      // Compress files first
      const processedFiles = await Promise.all(
        originalFiles.map(async (file) => {
          if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            return await compressChatMedia(file);
          }
          return file;
        })
      );

      setUploadStatus("Uploading...");
      const uploadedFiles = await uploadChatFile(processedFiles);
      for (const fileData of uploadedFiles) {
        let messageType = "IMAGE";
        if (fileData.fileName.toLowerCase().endsWith(".pdf")) {
          messageType = "DOCUMENT";
        } else if (fileData.fileName.toLowerCase().match(/\.(mp4|mov|avi)$/)) {
          messageType = "VIDEO";
        }

        sendMessage({
          type: messageType,
          attachmentUrl: fileData.fileLink,
          attachmentPath: fileData.filePath,
          content: fileData.fileName,
        });
      }
    } catch (error) {
      console.error("Media processing/upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadStatus("Uploading...");
      e.target.value = null; // Reset input
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
      {/* 1. Expandable Options Drawer (Moved on top) */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showOptions ? 'max-h-[350px] mb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`mx-auto transition-all duration-500 ${isWidget ? "max-w-full" : "max-w-xl md:max-w-2xl px-4"}`}>
          <div className="grid grid-cols-4 gap-4 md:gap-8 justify-items-center">
            {/* Location */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={handleLocationShare}>
              <div className={`rounded-full bg-green-50 dark:bg-green-900/40 flex items-center justify-center transition-all shadow-sm border border-green-100 dark:border-green-800 group-hover:scale-105 active:scale-95 ${isWidget ? "w-10 h-10" : "w-14 h-14 md:w-16 md:h-16"}`}>
                <Icon name="map marker alternate" className={`!m-0 text-green-600 dark:text-green-400 ${isWidget ? "text-lg" : "text-xl md:text-2xl"}`} />
              </div>
              <span className={`font-bold text-gray-700 dark:text-gray-200 text-center ${isWidget ? "text-[10px]" : "text-xs md:text-sm"}`}>{lang === 'ar' ? 'الموقع' : 'Location'}</span>
            </div>
            {/* Gallery */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => galleryRef.current.click()}>
              <div className={`rounded-full bg-orange-50 dark:bg-orange-900/40 flex items-center justify-center transition-all shadow-sm border border-orange-100 dark:border-orange-800 group-hover:scale-105 active:scale-95 ${isWidget ? "w-10 h-10" : "w-14 h-14 md:w-16 md:h-16"}`}>
                <Icon name="image" className={`!m-0 text-orange-600 dark:text-orange-400 ${isWidget ? "text-lg" : "text-xl md:text-2xl"}`} />
              </div>
              <span className={`font-bold text-gray-700 dark:text-gray-200 text-center ${isWidget ? "text-[10px]" : "text-xs md:text-sm"}`}>{lang === 'ar' ? 'المعرض' : 'Gallery'}</span>
            </div>
            {/* Camera */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => cameraRef.current.click()}>
              <div className={`rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center transition-all shadow-sm border border-blue-100 dark:border-blue-800 group-hover:scale-105 active:scale-95 ${isWidget ? "w-10 h-10" : "w-14 h-14 md:w-16 md:h-16"}`}>
                <Icon name="camera" className={`!m-0 text-blue-600 dark:text-blue-400 ${isWidget ? "text-lg" : "text-xl md:text-2xl"}`} />
              </div>
              <span className={`font-bold text-gray-700 dark:text-gray-200 text-center ${isWidget ? "text-[10px]" : "text-xs md:text-sm"}`}>{lang === 'ar' ? 'الكاميرا' : 'Camera'}</span>
            </div>
            {/* Document */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => docRef.current.click()}>
              <div className={`rounded-full bg-pink-50 dark:bg-pink-900/40 flex items-center justify-center transition-all shadow-sm border border-pink-100 dark:border-pink-800 group-hover:scale-105 active:scale-95 ${isWidget ? "w-10 h-10" : "w-14 h-14 md:w-16 md:h-16"}`}>
                <Icon name="file alternate" className={`!m-0 text-pink-600 dark:text-pink-400 ${isWidget ? "text-lg" : "text-xl md:text-2xl"}`} />
              </div>
              <span className={`font-bold text-gray-700 dark:text-gray-200 text-center ${isWidget ? "text-[10px]" : "text-xs md:text-sm"}`}>{lang === 'ar' ? 'مستند' : 'Document'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick suggestions (Moved below options) */}
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

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <Button 
          basic 
          icon 
          type="button" 
          onClick={() => setShowOptions(!showOptions)}
          className={`!m-0 ${isWidget ? "h-[44px] w-[44px] rounded-2xl" : "h-[50px] w-[50px] rounded-2xl"} transition-all duration-300 ${showOptions ? '!bg-primary !text-white shadow-sm' : 'text-gray-500 dark:text-white'}`}
        >
          <Icon name="add" className={`text-primary !m-0 transition-transform duration-300 ${showOptions ? 'rotate-45' : ''}`} />
        </Button>
        <div className="flex-1 relative">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={selectedContent[localizationKeys.typeAMessage]}
            rows={1}
            className={`w-full ${isWidget ? "py-2 px-4 min-h-[44px]" : "py-3 px-6 min-h-[50px]"} pr-12 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-primary/10 focus:border-primary dark:text-white transition-all outline-none resize-none overflow-hidden max-h-32 ${isWidget ? "text-xs" : "text-base"}`}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>
        <Button 
           primary 
           icon 
           type="submit"
           disabled={!newMessage.trim()}
           className={`!m-0 shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center ${isWidget ? "h-[44px] w-[44px] rounded-2xl" : "h-[50px] w-[50px] rounded-2xl"} ${!newMessage.trim() ? 'opacity-50' : 'opacity-100'}`}
        >
          <Icon name={lang === 'ar' ? "send" : "send"} className={`!m-0 ${lang === 'ar' ? "rotate-180" : ""}`} />
        </Button>
      </form>

      {/* Hidden Inputs */}
      <input type="file" ref={galleryRef} className="hidden" accept="image/*,video/*" multiple onChange={(e) => handleFileSelect(e, 'gallery')} />
      <input type="file" ref={cameraRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => handleFileSelect(e, 'camera')} />
      <input type="file" ref={docRef} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileSelect(e, 'document')} />

      {/* Uploading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-[2px] z-30 flex items-center justify-center rounded-2xl transition-all duration-300">
           <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">{uploadStatus}</span>
           </div>
        </div>
      )}
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
