import Lottie from "react-lottie";

import woooo from "./woooo.json";
import waffer from "./waffer.json";
import ballon from "./ballon.json";
import { useAuthState } from "../../../context/auth-context";
import { useState, useEffect } from "react";
import auth from "../../../utils/auth";
import { io } from "socket.io-client";

const Win = () => {
  const { user, logout } = useAuthState();
  const [IsWinner, setIsWinner] = useState(null);

  useEffect(() => {
    auth.getToken().then((accessToken) => {
      const headers = {
        Authorization: accessToken ? "Bearer " + accessToken : undefined,
      };
      const URL = process.env.REACT_APP_DEV_WEB_SOCKET_URL;
      const newSocket = io(URL, {
        extraHeaders: Object.entries(headers).reduce(
          (acc, [key, value]) =>
            value !== undefined ? { ...acc, [key]: value } : acc,
          {}
        ),
        path: "/socket.io",
      });
      newSocket?.on("auction:winner", (data) => {
        setIsWinner(data);
        console.log("====================================");
        console.log({ "auction:winner": data });
        console.log("====================================");
      });

      return () => {
        newSocket.close();
        logout();
      };
    });
  }, [IsWinner, logout]);

  const wooooOptions = {
    loop: false,
    autoplay: true,
    animationData: woooo,
  };
  const wafferOptions = {
    loop: false,
    autoplay: true,
    animationData: waffer,
  };
  const ballonOptions = {
    loop: false,
    autoplay: true,
    animationData: ballon,
  };

  return IsWinner ? (
    <div className="fixed top-0 w-full z-[500]">
      <Lottie options={wooooOptions} />
      <Lottie options={ballonOptions} />
      {/* <div className="w-[500px] fixed bottom-0 right-0">
        <Lottie options={wafferOptions} />
      </div>
      <div className="w-[500px] fixed bottom-0 left-0 flex">
        <Lottie options={wafferOptions} />
      </div> */}
    </div>
  ) : null;
};

export default Win;
