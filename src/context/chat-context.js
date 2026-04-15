import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthState } from "./auth-context";
import { authAxios } from "../config/axios-config";
import api from "../api";
import io from "socket.io-client";
import auth from "../utils/auth";
import { toast } from "react-hot-toast";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuthState();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const activeConversationRef = React.useRef(null);
  const chatSocketRef = React.useRef(null);
  const [isChatPageActive, setIsChatPageActive] = useState(false);
  const isChatPageActiveRef = React.useRef(false);
  const isWidgetOpenRef = React.useRef(false);

  // Sync ref with state
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    isChatPageActiveRef.current = isChatPageActive;
  }, [isChatPageActive]);

  const URL = process.env.REACT_APP_DEV_WEB_SOCKET_URL;

  const fetchConversations = async () => {
    try {
      if (!user) return;
      const response = await authAxios.get(`${api.app.chat.conversations}`);
      const conversationList = response.data.data || [];
      setConversations(conversationList);
      const totalUnread = conversationList.reduce((acc, conv) => {
        const lastMsg = conv.messages?.[0];
        return acc + (lastMsg && !lastMsg.isRead && lastMsg.senderId !== user.id ? 1 : 0);
      }, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    let socket;
    if (user) {
      // Connect to the chat namespace
      auth.getToken().then((accessToken) => {
        socket = io(`${URL}/chat`, {
          extraHeaders: {
            Authorization: accessToken ? `Bearer ${accessToken}` : null,
          },
          query: { userId: user.id },
          path: "/socket.io",
        });

        socket.on("connect", () => {
          console.log("Connected to chat socket");
        });

        socket.on("new_message", (message) => {
          console.log("DEBUG: Socket received new_message:", message);
          const currentActive = activeConversationRef.current;

          // Update messages if it belongs to the active conversation
          setMessages((prev) => {
            // 1. If we already have this exact database ID, ignore
            if (prev.some((m) => m.id === message.id)) return prev;

            if (currentActive && message.conversationId === currentActive.id) {
              // 2. If it's from ME, check if we have a matching optimistic message to replace
              if (Number(message.senderId) === Number(user?.id)) {
                const optimisticIndex = prev.findIndex(
                  (m) => m.isOptimistic && m.content === message.content
                );
                if (optimisticIndex !== -1) {
                  const nextMessages = [...prev];
                  const existingMsg = nextMessages[optimisticIndex];
                  // Preserve isRead if it was already marked by a socket event
                  nextMessages[optimisticIndex] = {
                    ...message,
                    isRead: existingMsg.isRead || message.isRead,
                  };
                  return nextMessages;
                }
              }
              // 3. Otherwise (received or no optimistic match), append it
              return [...prev, message];
            }
            return prev;
          });

          // Update conversation list last message
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === message.conversationId
                ? { ...conv, messages: [message] }
                : conv
            )
          );

          // Update unread count if not in active conversation OR UI is hidden
          const isCurrentlyViewing = (isWidgetOpenRef.current || isChatPageActiveRef.current) && Number(currentActive?.id) === Number(message.conversationId);

          if (!isCurrentlyViewing) {
            if (Number(message.senderId) !== Number(user?.id)) {
              setUnreadCount((prev) => prev + 1);
            }
          } else {
            // If we ARE in the active conversation AND viewing it, mark it as read if visible
            if (Number(message.senderId) !== Number(user?.id)) {
              // 1. Mark as read on the server
              markAsRead(message.conversationId);
              
              // 2. ALSO mark as read locally right now so it turns blue instantly
              setMessages((prev) => 
                prev.map(m => m.id === message.id ? { ...m, isRead: true } : m)
              );
            }
          }
        });

        socket.on("messages_read", ({ conversationId, readerId }) => {
          console.log("Socket: Received messages_read", { conversationId, readerId });
          const currentActive = activeConversationRef.current;
          
          if (currentActive && Number(conversationId) === Number(currentActive.id)) {
            setMessages((prev) =>
              prev.map((m) =>
                Number(m.senderId) !== Number(readerId) ? { ...m, isRead: true } : m
              )
            );
          }
        });

        setChatSocket(socket);
        chatSocketRef.current = socket;
      });

      fetchConversations();
    }

    return () => {
      if (socket) socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const markAsRead = (conversationId) => {
    if (
      chatSocketRef.current &&
      conversationId &&
      user &&
      document.visibilityState === "visible"
    ) {
      chatSocketRef.current.emit("mark_as_read", {
        conversationId,
        userId: user.id,
      });
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && activeConversation) {
        markAsRead(activeConversation.id);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.id, chatSocket, user]);

  const selectConversation = async (conversation) => {
    if (!conversation) {
      const currentId = activeConversation?.id;
      setActiveConversation(null);
      setMessages([]);
      if (chatSocketRef.current && currentId) {
        chatSocketRef.current.emit("leave_conversation", currentId);
      }
      return;
    }

    setActiveConversation(conversation);
    try {
      const response = await authAxios.get(
        `${api.app.chat.messages(conversation.id)}`
      );
      setMessages(response.data.data || []);
      // Refresh conversations to update unread status locally
      fetchConversations();
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load conversation messages");
      toggleWidget(false);
    }
    const currentSocket = chatSocketRef.current;
    if (currentSocket) {
      currentSocket.emit("join_conversation", conversation.id);
      markAsRead(conversation.id);
    }
  };

  const uploadChatFile = async (files) => {
    try {
      const formData = new FormData();
      if (Array.isArray(files)) {
        files.forEach((file) => formData.append("files", file));
      } else {
        formData.append("files", files);
      }

      const response = await authAxios.post(`${api.app.chat.upload}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error uploading chat file:", error);
      toast.error("Failed to upload file");
      throw error;
    }
  };

  const sendMessage = async (messageData) => {
    if (!activeConversation || !user) return;

    // Support both simple string and complex object
    const payload = typeof messageData === "string" 
      ? { content: messageData, type: "TEXT" } 
      : { ...messageData };

    if (!payload.content && !payload.attachmentUrl && !payload.lat) return;

    // 1. Optimistic Update
    const tempId = Date.now();
    const optimisticMessage = {
      id: tempId,
      conversationId: activeConversation.id,
      senderId: user.id,
      content: payload.content || "",
      type: payload.type || "TEXT",
      attachmentUrl: payload.attachmentUrl,
      lat: payload.lat,
      lng: payload.lng,
      createdAt: new Date().toISOString(),
      isRead: false,
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const response = await authAxios.post(
        `${api.app.chat.messages(activeConversation.id)}`,
        payload
      );

      // 2. Replace optimistic message with real message from server
      const savedMessage = response.data.data;
      if (savedMessage) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? { ...savedMessage, isRead: m.isRead || savedMessage.isRead }
              : m
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      // 3. Rollback on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  const startConversation = async (sellerId, productId) => {
    try {
      const sanitizedProductId = productId ? Number(productId) : undefined;
      
      const response = await authAxios.post(`${api.app.chat.getOrCreate}`, {
        sellerId,
        productId: isNaN(sanitizedProductId) ? undefined : sanitizedProductId,
      });
      
      if (!response.data || response.data.success === false) {
        throw new Error(response.data?.error || "Conversation creation failed");
      }
      
      const newConversation = response.data.data;
      if (!newConversation) {
        throw new Error("Conversation data missing");
      }
      
      await fetchConversations();
      await selectConversation(newConversation);
      return newConversation;
    } catch (error) {
      console.error("Error starting conversation Details:", {
        message: error.message,
        response: error.response?.data,
        sellerId,
        productId
      });
      
      const errorMessage = error.response?.data?.message || error.message || "Could not start conversation. Please try again.";
      toast.error(errorMessage);
      toggleWidget(false);
    }
  };

  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleWidget = (isOpen) => {
    const nextState = isOpen !== undefined ? isOpen : !isWidgetOpen;
    setIsWidgetOpen(nextState);
    isWidgetOpenRef.current = nextState;
    if (!nextState) setIsMinimized(false);
  };

  const setMinimized = (minimized) => {
    setIsMinimized(minimized);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        unreadCount,
        isWidgetOpen,
        isMinimized,
        isChatPageActive,
        setIsChatPageActive,
        selectConversation,
        sendMessage,
        uploadChatFile,
        startConversation,
        fetchConversations,
        toggleWidget,
        setMinimized,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
