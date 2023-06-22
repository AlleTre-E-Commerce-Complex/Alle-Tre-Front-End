import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import auth from "../utils/auth";
import { useAuthState } from "./auth-context";
import { useParams } from "react-router-dom/cjs/react-router-dom";

const URL = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
const SocketContext = React.createContext();
export function useSocket() {
  return React.useContext(SocketContext);
}

export function SocketProvider({ children }) {
  // const { auctionId } = useParams();
  const [socket, setSocket] = useState();
  const { user, logout } = useAuthState();

  const SocketauctionId = window.localStorage.getItem("SocketauctionId");

  useEffect(() => {
    let newSocket;
    if (SocketauctionId)
      auth.getToken().then((accessToken) => {
        const headers = {
          Authorization: accessToken ? "Bearer " + accessToken : undefined,
        };
        const newSocket = io(URL, {
          extraHeaders: Object.entries(headers).reduce(
            (acc, [key, value]) =>
              value !== undefined ? { ...acc, [key]: value } : acc,
            {}
          ),
          query: { auctionId: SocketauctionId },
          path: "/socket.io",
        });
        setSocket(newSocket);
      });
    return () => {
      newSocket.close();
      logout();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
