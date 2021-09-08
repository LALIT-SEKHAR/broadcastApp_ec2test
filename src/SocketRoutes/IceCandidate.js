const { setIceCandidate } = require("../ConnectPeer/PeerConnect");
const { MEMBERS } = require("../DATABASE");

module.exports.IceCandidateScanner = ({ payload, socket }) => {
  //finding the sender peer
  MEMBERS.forEach((member, index) => {
    if (member.id === payload.id) {
      //adding ice_candidate to the sender Peer
      setIceCandidate({
        peer: member.peer,
        Ice_Candidate: payload.Ice_Candidate,
      });
    }
  });
};
