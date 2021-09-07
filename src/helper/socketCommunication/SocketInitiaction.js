import { setAnswer } from "helper/peerConnection/ConnectPeer";
import { io } from "socket.io-client";

export const SocketInit = async () => {
  try {
    const socket = await io.connect(process.env.REACT_APP_SERVER_ENDPOINT);
    socket.on("offer", (payload) => {
      console.log("offer: ", payload);
    });
    socket.on("answer", (payload) => {
      setAnswer({ peer: window.MyPeer, answer: payload.answer });
    });
    socket.on("ERROR", (error) => {
      console.log(error);
    });
    return socket;
  } catch (error) {
    console.log(error.message);
  }
};
