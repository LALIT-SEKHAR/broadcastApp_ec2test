export const createPeer = () => {
  return new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.stunprotocol.org" },
      {
        urls: process.env.REACT_APP_STUN_URL,
        credential: process.env.REACT_APP_STUN_URL_PASSWORD,
        username: process.env.REACT_APP_STUN_USERNAME,
      },
    ],
  });
};

export const addTracks = ({ mediaStream, peer }) => {
  return mediaStream.getTracks().forEach((track) => {
    peer.addTrack(track, mediaStream);
  });
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

export const handelOnTrack = (e) => {
  const mediaStream = new MediaStream();
  mediaStream.addTrack(e.track, mediaStream);
  if (e.track.kind === "video") {
    const holder = document.querySelector(".App");
    const Video = document.createElement("video");
    Video.id = "AdminVideo";
    holder.appendChild(Video);
    Video.srcObject = mediaStream;
    Video.autoplay = true;
    Video.muted = true;
    document.querySelector(".infoWarper").style.display = "none";
  }
};

export const handelOnIceCandidate = ({ Ice_Candidate, peer, socket }) => {
  // console.log(Ice_Candidate);
  socket.emit("ice_candidate", Ice_Candidate);
};

export const setAnswer = ({ peer, answer }) => {
  peer.setRemoteDescription(answer);
};
export const setIceCandidate = ({ peer, Ice_Candidate }) => {
  peer.addIceCandidate(JSON.parse(Ice_Candidate));
};
