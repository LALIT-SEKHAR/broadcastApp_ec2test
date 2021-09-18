const Webrtc = require("wrtc");

module.exports.createPeer = () => {
  return new Webrtc.RTCPeerConnection({
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

module.exports.addTracks = ({ mediaStream, peer }) => {
  return mediaStream.getTracks().forEach((track) => {
    peer.addTrack(track, mediaStream);
  });
};

module.exports.createOffer = async ({ peer }) => {
  try {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return peer.localDescription;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.createAnswer = async ({ peer, offer }) => {
  try {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return peer.localDescription;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.handelOnTrack = (e) => {
  console.log(e.track);
};

module.exports.handelOnIceCandidate = ({
  Ice_Candidate,
  level,
  id,
  socket,
}) => {
  let payload = {
    Ice_Candidate: JSON.stringify(Ice_Candidate),
    level,
    id,
  };
  socket.emit("ice_candidate", payload);
};

module.exports.handelOnIceConnectionStateChange = ({ peer }) => {
  if (
    peer.iceConnectionState === "failed" ||
    peer.iceConnectionState === "disconnected"
  ) {
    peer.restartIce();
  }
};

module.exports.setAnswer = ({ peer, answer }) => {
  peer.setRemoteDescription(answer);
};
module.exports.setIceCandidate = async ({ peer, Ice_Candidate }) => {
  peer
    .addIceCandidate(new Webrtc.RTCIceCandidate(JSON.parse(Ice_Candidate)))
    .then()
    .catch((error) => console.log(error));
};
