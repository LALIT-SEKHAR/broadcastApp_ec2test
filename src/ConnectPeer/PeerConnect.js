const Webrtc = require("wrtc");

module.exports.createPeer = () => {
  return new Webrtc.RTCPeerConnection({
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
