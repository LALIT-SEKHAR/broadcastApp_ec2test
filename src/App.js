import { useEffect, useRef } from "react";
import { getUserMediaStream } from "./helper/mediaStream";
import {
  addTracks,
  createOffer,
  createPeer,
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
    //TODO: make addTrack only for ADMIN
    if (Input.current.value === "ADMIN") {
      addTracks({
        mediaStream: MyMediaStream.current,
        peer: Peer.current,
      });
    } else {
      Peer.current.addTransceiver("video", { direction: "recvonly" });
      Peer.current.addTransceiver("audio", { direction: "recvonly" });
    }
    Peer.current.ontrack = handelOnTrack;
    Peer.current.onicecandidate = (e) => {
      if (e.candidate && e.candidate.candidate) {
        let payload = {
          id: Socket.current.id,
          Ice_Candidate: JSON.stringify(e.candidate),
          level: Input.current.value,
        };
        Socket.current.emit("ice_candidate", payload);
      }
    };
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
        <select name="level" ref={Input}>
          <option value="CLIENT">CLIENT</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button onClick={SendOffer}>Connect</button>
      </div>
      <video id="myVideo" ref={myVideo} autoPlay muted></video>
    </div>
  );
}

export default App;
