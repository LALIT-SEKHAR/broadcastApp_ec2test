import { useEffect, useRef, useState } from "react";
import { getUserMediaStream } from "./helper/mediaStream";
import {
  addTracks,
  createOffer,
  createPeer,
  handelOnIceconnectionStateChange,
  handelOnTrack,
} from "./helper/peerConnection/ConnectPeer";
import { SocketInit } from "./helper/socketCommunication";

function App() {
  const myVideo = useRef();
  const Socket = useRef();
  const MyMediaStream = useRef();
  const Peer = useRef();
  const Input = useRef();
  const [IsMuted, setIsMuted] = useState(true);
  const [IsRestart, setIsRestart] = useState(false);

  useEffect(() => {
    console.log("Mounted");
    // getMyStream();
    socketConnect();
  }, [IsRestart]);

  const getMyStream = async () => {
    const stream = await getUserMediaStream();
    MyMediaStream.current = stream;
  };

  const socketConnect = async () => {
    Socket.current = await SocketInit();
  };

  const SendOffer = async () => {
    if (!Peer.current) {
      Peer.current = createPeer();
      //TODO: make addTrack only for ADMIN
      if (Input.current.value === "ADMIN") {
        await getMyStream();
        document.querySelector(".infoWarper").style.display = "none";
        myVideo.current.srcObject = MyMediaStream.current;
        addTracks({
          mediaStream: MyMediaStream.current,
          peer: Peer.current,
        });
      } else {
        console.log("client");
        Peer.current.addTransceiver("video", { direction: "recvonly" });
        Peer.current.addTransceiver("audio", { direction: "recvonly" });
      }
      Peer.current.oniceconnectionstatechange = () =>
        handelOnIceconnectionStateChange({ peer: Peer.current });
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
    }
  };

  const MuteToggle = () => {
    let adminVideo = document.getElementById("AdminVideo");
    adminVideo && setIsMuted(!adminVideo.muted);
    adminVideo && (adminVideo.muted = !adminVideo.muted);
  };
  const EndCall = () => {
    window.Peer && window.Peer.close();
    document.getElementById("AdminVideo") &&
      document.getElementById("AdminVideo").remove();
    setIsRestart(!IsRestart);
    document.querySelector(".infoWarper").style.display = "block";
    document.querySelector("footer").style.display = "none";
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
      <footer>
        <button
          className={`bottom_btn ${!IsMuted && "activeBtn"}`}
          onClick={MuteToggle}
        >
          {IsMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M4.34 2.93L2.93 4.34 7.29 8.7 7 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.38.88-2.18 1.11v2.06c1.34-.3 2.57-.92 3.61-1.75l2.05 2.05 1.41-1.41L4.34 2.93zM10 15.17L7.83 13H5v-2h2.83l.88-.88L10 11.41v3.76zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76zm4.5 8c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
        <button className={"End_btn"} onClick={EndCall}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M18.59 10.52c1.05.51 2.04 1.15 2.96 1.91l-1.07 1.07c-.58-.47-1.21-.89-1.88-1.27v-1.71m-13.2 0v1.7c-.65.37-1.28.79-1.87 1.27l-1.07-1.07c.91-.75 1.9-1.38 2.94-1.9M12 7C7.46 7 3.34 8.78.29 11.67c-.18.18-.29.43-.29.71s.11.53.29.7l2.48 2.48c.18.18.43.29.71.29.27 0 .52-.1.7-.28.79-.73 1.68-1.36 2.66-1.85.33-.16.56-.51.56-.9v-3.1C8.85 9.25 10.4 9 12 9s3.15.25 4.59.73v3.1c0 .4.23.74.56.9.98.49 1.88 1.11 2.67 1.85.18.17.43.28.7.28.28 0 .53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71s-.11-.53-.29-.71C20.66 8.78 16.54 7 12 7z" />
          </svg>
        </button>
      </footer>
    </div>
  );
}

export default App;
