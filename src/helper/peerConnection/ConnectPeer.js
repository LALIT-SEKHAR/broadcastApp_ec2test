export const createPeer = () => {
  return new RTCPeerConnection({
    iceServers: [
      { urls: "stun:3.108.84.209:3478" },
      {
        urls: "turn:3.108.84.209:3478",
        credential: "lalitsekharbehera",
        username: "area51@donotusethispassword",
      },
    ],
  });
};

export const addTracks = ({ mediaStream, peer }) => {
  return mediaStream.getTracks().forEach((track) => {
    peer.addTrack(track, mediaStream);
  });
};

export const handelOnIceconnectionStateChange = ({ peer }) => {
  if (
    peer.iceConnectionState === "failed" ||
    peer.iceConnectionState === "disconnected" ||
    peer.iceConnectionState === "closed"
  ) {
    peer.restartIce();
  }
};

export const createOffer = async ({ peer }) => {
  try {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return peer.localDescription;
  } catch (error) {
    console.log(error.message);
  }
};

export const createAnswer = async ({ peer, offer }) => {
  try {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return peer.localDescription;
  } catch (error) {
    console.log(error.message);
  }
};

const mediaStream = new MediaStream();
export const handelOnTrack = (e) => {
  mediaStream.addTrack(e.track, mediaStream);
  if (mediaStream.getTracks().length === 2) {
    const holder = document.querySelector(".App");
    const Video = document.createElement("video");
    Video.id = "AdminVideo";
    holder.appendChild(Video);
    Video.srcObject = mediaStream;
    Video.autoplay = true;
    Video.muted = true;
    document.querySelector(".infoWarper").style.display = "none";
    document.querySelector("footer").style.display = "flex";
    window.clientMediaStream = mediaStream;
  }
};

export const handelOnIceCandidate = ({ Ice_Candidate, peer, socket }) => {
  socket.emit("ice_candidate", Ice_Candidate);
};

export const setAnswer = ({ peer, answer }) => {
  peer.setRemoteDescription(answer);
};
export const setIceCandidate = ({ peer, Ice_Candidate }) => {
  peer
    .addIceCandidate(JSON.parse(Ice_Candidate))
    .then()
    .catch((error) => console.log(error));
};
