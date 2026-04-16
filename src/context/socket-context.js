import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import auth from "../utils/auth";

const getSocketURL = () => {
  const LOG_VERSION = "2.0.4";
  let apiUrl = process.env.REACT_APP_SERVER_URL;

  // SAFE PRODUCTION FALLBACK
  if (typeof window !== 'undefined' && window.location.hostname.includes('3arbon.com')) {
    console.log(`[AuctionSocket] [v${LOG_VERSION}] Production Domain Detected. Using origin fallback.`);
    const base = window.location.origin;
    try {
      if (apiUrl) {
        return new window.URL(apiUrl, base).origin;
      }
    } catch (e) {
      console.warn(`[AuctionSocket] [v${LOG_VERSION}] Failed to parse apiUrl with base:`, e);
    }
    return base;
  }

  try {
    if (apiUrl && apiUrl.trim() !== "") {
      console.log(`[AuctionSocket] [v${LOG_VERSION}] Using Environment Variable:`, apiUrl);
      const base = typeof window !== 'undefined' ? window.location.origin : "http://localhost";
      const SOCKET_URL = new window.URL(apiUrl, base);
      return SOCKET_URL.origin;
    }
  } catch (e) {
    console.error(`[AuctionSocket] [v${LOG_VERSION}] Socket URL Derivation Error:`, e);
  }

  const fallback = typeof window !== 'undefined' ? window.location.origin : "";
  console.log(`[AuctionSocket] [v${LOG_VERSION}] Falling back to:`, fallback);
  return fallback;
};

const SOCKET_URL = getSocketURL();
const SocketContext = React.createContext();
export function useSocket() {
  return React.useContext(SocketContext);
}

export function SocketProvider({ auctionId, children, userId }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    // register-sw.js  (run on app start)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .then(reg => {
            console.log('SW registered', reg);
          }).catch(err => console.error('SW register failed :- ', err));
      }

    auth.getToken().then((accessToken) => {
      const headers = {
        Authorization: accessToken ? "Bearer " + accessToken : null,
      };

      // Ensure auctionId is a string, not an object
      const safeAuctionId = (typeof auctionId === 'object' && auctionId !== null) 
        ? (auctionId.id || "") 
        : (auctionId || "");

      const newSocket = io(SOCKET_URL, {
        extraHeaders: headers,
        query: { auctionId: String(safeAuctionId), userId: String(userId) },
        path: "/socket.io",
        transports: ["polling", "websocket"],
      });

      newSocket.on("connect_error", (err) => {
        console.error("Auction Socket Connection Error:", err.message);
      });

      setSocket(newSocket);
    });
  }, [auctionId,userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
