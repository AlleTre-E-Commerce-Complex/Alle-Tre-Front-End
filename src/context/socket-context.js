import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import auth from "../utils/auth";

const URL = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
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
      const newSocket = io(URL, {
        extraHeaders: headers,
        query: { auctionId: auctionId, userId:userId },
        path: "/socket.io",
      });
      setSocket(newSocket);
    });
  }, [auctionId,userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
