import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import auth from "../utils/auth";

const URL = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
const SocketContext = React.createContext();
export function useSocket() {
  return React.useContext(SocketContext);
}

export function SocketProvider({ auctionId, children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    auth.getToken().then((accessToken) => {
      const headers = {
        Authorization: accessToken ? "Bearer " + accessToken : null,
      };
      const newSocket = io(URL, {
        extraHeaders: headers,
        query: { auctionId: auctionId },
        path: "/socket.io",
      });
      setSocket(newSocket);
    });
  }, [auctionId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
