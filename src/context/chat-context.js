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
  const [onlineUsers, setOnlineUsers] = useState({}); // { userId: boolean }

  // Sync ref with state
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Derived global unread count from conversations list
  useEffect(() => {
    const total = conversations.reduce((acc, conv) => acc + (conv.unreadCount > 0 ? 1 : 0), 0);
    setUnreadCount(total);
  }, [conversations]);

  useEffect(() => {
    isChatPageActiveRef.current = isChatPageActive;
  }, [isChatPageActive]);

  const getSocketURL = () => {
    try {
      if (process.env.REACT_APP_WEB_SOCKET_URL) return process.env.REACT_APP_WEB_SOCKET_URL;
      
      const apiUrl = process.env.REACT_APP_SERVER_URL || "";
      if (apiUrl) {
        // Use a safe base for URL constructor
        const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
        const full = new window.URL(apiUrl, base);
        return `${full.protocol}//${full.host}`;
      }
    } catch (e) {
      console.error("Socket URL Derivation Error:", e);
    }

    // FINAL FALLBACK: If we are on 3arbon.com production and env-vars are missing
    if (typeof window !== 'undefined' && window.location.hostname.includes('3arbon.com')) {
      return "https://api.3arbon.com";
    }

    return typeof window !== 'undefined' ? window.location.origin : "";
  };

  const SOCKET_URL = getSocketURL();

  const fetchConversations = async () => {
    try {
      if (!user) return;
      const response = await authAxios.get(`${api.app.chat.conversations}`);
      const conversationList = response.data.data || [];
      
      const presenceMap = {};
      const updatedConversations = conversationList.map((newConv) => {
        const existing = conversations.find((p) => p.id === newConv.id);
        const lastMsg = newConv.messages?.[0];
        const isFromOther = lastMsg && lastMsg.senderId !== user.id;
        const isUnread = lastMsg && !lastMsg.isRead && isFromOther;

        let count = existing?.unreadCount ?? (isUnread ? 1 : 0);
        if (Number(activeConversationRef.current?.id) === Number(newConv.id)) {
          count = 0;
        }
        
        const otherUser = newConv.sellerId === user.id ? newConv.buyer : newConv.seller;
        if (otherUser) {
          // A non-null socketId in DB means they are currently connected to SOME instance
          presenceMap[String(otherUser.id)] = !!otherUser.socketId;
        }

        return { ...newConv, unreadCount: count };
      });

      setOnlineUsers(prev => ({ ...prev, ...presenceMap }));
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    let socket;
    if (user) {
      // Connect to the chat namespace
      auth.getToken().then((accessToken) => {
        const headers = {
          Authorization: accessToken ? `Bearer ${accessToken}` : null,
        };
        socket = io(`${SOCKET_URL}/chat`, {
          auth: {
            token: accessToken,
          },
          extraHeaders: headers,
          query: { userId: String(user.id) },
          path: "/socket.io",
          transports: ["polling", "websocket"],
        });

        socket.on("connect", () => {
          console.log(`[ChatSocket] Connected successfully to ${SOCKET_URL}/chat`);
        });

        socket.on("connect_error", (err) => {
          console.error(`[ChatSocket] Connection Error: ${err.message} (Target: ${SOCKET_URL})`);
        });

        socket.on("new_message", (message) => {
          console.log("DEBUG: Socket received new_message:", message);
          const currentActive = activeConversationRef.current;
          const isCurrentlyViewing = (isWidgetOpenRef.current || isChatPageActiveRef.current) && 
                                    Number(currentActive?.id) === Number(message.conversationId);
          const isFromOther = Number(message.senderId) !== Number(user?.id);

          // Update messages if it belongs to the active conversation
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev;

            if (isCurrentlyViewing) {
              if (!isFromOther) {
                const optimisticIndex = prev.findIndex(
                  (m) => m.isOptimistic && m.content === message.content
                );
                if (optimisticIndex !== -1) {
                  const nextMessages = [...prev];
                  const existingMsg = nextMessages[optimisticIndex];
                  nextMessages[optimisticIndex] = {
                    ...message,
                    isRead: existingMsg.isRead || message.isRead,
                  };
                  return nextMessages;
                }
              }
              return [...prev, message];
            }
            return prev;
          });

          // Update conversation list last message and unread count
          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id === message.conversationId) {
                return { 
                  ...conv, 
                  messages: [message],
                  unreadCount: (!isCurrentlyViewing && isFromOther) 
                    ? (conv.unreadCount || 0) + 1 
                    : 0
                };
              }
              return conv;
            })
          );

          // If we ARE in the active conversation AND viewing it, mark it as read
          if (isCurrentlyViewing && isFromOther) {
            markAsRead(message.conversationId);
            setMessages((prev) => 
              prev.map(m => m.id === message.id ? { ...m, isRead: true } : m)
            );
          }

          // Implicit Presence: Sender is active
          if (isFromOther) {
            setOnlineUsers((prev) => ({ ...prev, [String(message.senderId)]: true }));
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

            // Implicit Presence: Reader is active
            if (Number(readerId) !== Number(user?.id)) {
              setOnlineUsers((prev) => ({ ...prev, [String(readerId)]: true }));
            }
          });

          // Status handlers (Resilient to different event names and ID types)
          const updateStatus = (userId, status) => {
            if (!userId) return;
            setOnlineUsers((prev) => ({ ...prev, [String(userId)]: status }));
          };

          socket.on("user_online", (userId) => updateStatus(userId, true));
          socket.on("user_offline", (userId) => updateStatus(userId, false));
          socket.on("user_status", ({ userId, status }) => updateStatus(userId, status === "online" || status === true));
          socket.on("status_update", ({ userId, isOnline }) => updateStatus(userId, isOnline));

          // Initial list from server
          socket.on("online_users", (usersArray) => {
            if (!Array.isArray(usersArray)) return;
            const statusMap = {};
            usersArray.forEach(id => statusMap[String(id)] = true);
            setOnlineUsers(statusMap);
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
    setMinimized(false);
    // Reset unread count for this conversation in the list
    setConversations(prev => prev.map(c => c.id === conversation.id ? { ...c, unreadCount: 0 } : c));
    
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
      setMinimized(false);
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

  // Background Status Poller (every 45s) to sync offline states
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      fetchConversations();
    }, 45000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
