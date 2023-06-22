import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";

import woooo from "./woooo.json";

import { useAuthState } from "../../../context/auth-context";
import auth from "../../../utils/auth";
import { io } from "socket.io-client";
import { useSocket } from "context/socket-context";

const Win = () => {
  const { user, logout } = useAuthState();
  const [IsWinner, setIsWinner] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    socket?.once("auction:winner", (data) => {
      setIsWinner(data);
    });
    return () => {
      socket.close();
      logout();
    };
  }, []);

  useEffect(() => {
    if (IsWinner) {
      const timeoutId = setTimeout(() => {
        setIsWinner(null);
      }, 10000); // 10 seconds in milliseconds

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [IsWinner]);

  const wooooOptions = {
    loop: true,
    autoplay: true,
    animationData: woooo,
  };

  return IsWinner ? (
    <div className="fixed top-0 w-full h-full z-[500]">
      <div className="flex justify-between">
        <Lottie options={wooooOptions} />
        <Lottie options={wooooOptions} />
        <Lottie options={wooooOptions} />
      </div>
    </div>
  ) : null;
};

export default Win;
