import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import auth from "../utils/auth";
import { useAuthState } from "./auth-context";

const URL = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
const SocketContext = React.createContext();
export function useSocket() {
  return React.useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = React.useState();
  const { user, logout } = useAuthState();

  useEffect(() => {
    let newSocket;
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
