import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import auth from "../utils/auth";

const getSocketURL = () => {
  const LOG_VERSION = "2.0.2";
  let apiUrl = process.env.REACT_APP_SERVER_URL;

  // HEAVY-HANDED PRODUCTION GUARD
  if (typeof window !== 'undefined' && window.location.hostname.includes('3arbon.com')) {
    console.log(`[AuctionSocket] [v${LOG_VERSION}] Production Domain Detected. Forcing API domain.`);
    return "https://api.3arbon.com";
  }

  try {
    if (apiUrl && apiUrl.trim() !== "") {
      console.log(`[AuctionSocket] [v${LOG_VERSION}] Using Environment Variable:`, apiUrl);
      const SOCKET_URL = new window.URL(apiUrl);
      return SOCKET_URL.origin;
    }
  } catch (e) {
    console.error(`[AuctionSocket] [v${LOG_VERSION}] Socket URL Derivation Error:`, e);
  }

  const fallback = typeof window !== 'undefined' ? window.location.origin : "";
  console.log(`[AuctionSocket] [v${LOG_VERSION}] No valid API URL found. Falling back to:`, fallback);
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
            // then request token using this registration (see next snippet)
          }).catch(err => console.error('SW register failed :- ', err));
      }

    auth.getToken().then((accessToken) => {
      const headers = {
        Authorization: accessToken ? "Bearer " + accessToken : null,
      };
      const newSocket = io(SOCKET_URL, {
        extraHeaders: headers,
        query: { auctionId: auctionId, userId: String(userId) },
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
