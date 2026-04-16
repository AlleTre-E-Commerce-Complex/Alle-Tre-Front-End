import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import auth from "../utils/auth";

const getSocketURL = () => {
  try {
    if (process.env.REACT_APP_WEB_SOCKET_URL) return process.env.REACT_APP_WEB_SOCKET_URL;
    
    const apiUrl = process.env.REACT_APP_SERVER_URL || "";
    if (apiUrl) {
      const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      const full = new window.URL(apiUrl, base);
      return `${full.protocol}//${full.host}`;
    }
  } catch (e) {
    console.error("Socket URL Derivation Error:", e);
  }
  return typeof window !== 'undefined' ? window.location.origin : "";
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
