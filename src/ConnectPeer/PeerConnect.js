const Webrtc = require("wrtc");

module.exports.createPeer = () => {
  return new Webrtc.RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.stunprotocol.org" },
      {
        urls: process.env.STUN_URL,
        credential: process.env.STUN_URL_PASSWORD,
        username: process.env.STUN_USERNAME,
      },
    ],
  });
};

module.exports.addTracks = ({ mediaStream, peer }) => {
  return mediaStream
    .getTracks()
    .forEach((track) => peer.addTrack(track, mediaStream));
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

module.exports.handelOnIceCandidate = ({ Ice_Candidate, peer }) => {
  // console.log(Ice_Candidate);
};

module.exports.setAnswer = ({ peer, answer }) => {
  peer.setRemoteDescription(answer);
};
module.exports.setIceCandidate = ({ peer, Ice_Candidate }) => {
  peer.addIceCandidate(Ice_Candidate);
};
