import { useEffect, useRef } from "react";
import { getUserMediaStream } from "./helper/mediaStream";
import {
  addTracks,
  createOffer,
  createPeer,
  handelOnIceCandidate,
  handelOnTrack,
} from "./helper/peerConnection/ConnectPeer";
import { SocketInit } from "./helper/socketCommunication";

function App() {
  const myVideo = useRef();
  const Socket = useRef();
  const MyMediaStream = useRef();
  const Peer = useRef();
  const Input = useRef();

  useEffect(() => {
    console.log("Mounted");
    getMyStream();
  });

  const getMyStream = async () => {
    const stream = await getUserMediaStream();
    MyMediaStream.current = stream;
    myVideo.current.srcObject = MyMediaStream.current;
    socketConnect();
  };

  const socketConnect = async () => {
    Socket.current = await SocketInit();
  };

  const SendOffer = async () => {
    Peer.current = createPeer();
    addTracks({
      mediaStream: MyMediaStream.current,
      peer: Peer.current,
    });
    Peer.current.ontrack = handelOnTrack;
    Peer.current.onicecandidate = (e) =>
      handelOnIceCandidate({ peer: Peer.current, Ice_Candidate: e.candidate });
    Peer.current.onnegotiationneeded = async () => {
      const offer = await createOffer({ peer: Peer.current });
      let payload = {
        id: Socket.current.id,
        offer,
        level: Input.current.value,
      };
      window.MyPeer = Peer.current;
      Socket.current.emit("offer", payload);
    };
  };

  return (
    <div className="App">
      <div className="infoWarper">
        <h1>Hello</h1>
        <input
          type="text"
          ref={Input}
          defaultValue="client"
          placeholder="enter level"
        />
        <button onClick={SendOffer}>Connect</button>
      </div>
      <video id="myVideo" ref={myVideo} autoPlay muted></video>
    </div>
  );
}

export default App;
