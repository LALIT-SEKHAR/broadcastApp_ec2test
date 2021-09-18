export const createPeer = () => {
  return new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.ekiga.net" },
      { urls: "stun:stun.schlund.de" },
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
      { urls: "stun:stun.softjoys.com" },
      { urls: "stun:stun.voipbuster.com" },
      { urls: "stun:stun.voipstunt.com" },
      { urls: "stun:stun.xten.com" },
      { urls: "stun:stun.stunprotocol.org" },
      {
        urls: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
      {
        urls: "turn:192.158.29.39:3478?transport=udp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
      {
        urls: "turn:192.158.29.39:3478?transport=tcp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808",
      },
      {
        urls: "turn:numb.viagenie.ca",
        credential: "biDzUg8GhjQth8T",
        username: "lalitasekhar1999@gmail.com",
      },
      {
        urls: "turn:numb.viagenie.ca",
        credential: "biDzUg8GhjQth8T",
        username: "lalitsekhar1999@gmail.com",
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
