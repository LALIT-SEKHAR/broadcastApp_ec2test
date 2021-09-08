const {
  createPeer,
  addTracks,
  handelOnIceCandidate,
  createAnswer,
} = require("../ConnectPeer/PeerConnect");
const { MEMBERS } = require("../DATABASE");

module.exports.offerScanner = ({ payload, socket }) => {
  // Check for any Exceptions 🕵️‍♂️
  if (payload.level === "ADMIN") {
    if (MEMBERS.length > 0) {
      return socket.emit("ERROR", { message: "already an ADMIN is present" });
    }
    return SendAnswerToAdmin({ payload, socket });
  }
  if (MEMBERS.length === 0) {
    return socket.emit("ERROR", { message: "ADMIN is not present" });
  }
  SendAnswerToClient({ payload, socket });
};

// this for ADMIN
const SendAnswerToAdmin = async ({ payload, socket }) => {
  const peer = createPeer();
  MEMBERS.push({
    id: payload.id,
    peer,
    level: payload.level,
  });
  MEMBERS.forEach(async (member, index) => {
    if (member.id === payload.id) {
      member.peer.ontrack = (e) => {
        MEMBERS[index].mediaStream = e.streams;
      };
      MEMBERS[index].peer.onicecandidate = (e) => {
        if (e.candidate) {
          handelOnIceCandidate({
            socket,
            Ice_Candidate: e.candidate,
            id: member.id,
            level: member.level,
          });
        }
      };
      const answer = await createAnswer({
        peer: MEMBERS[index].peer,
        offer: payload.offer,
      });
      let newPayload = {
        to: MEMBERS[index].id,
        from: "server",
        answer,
      };
      socket.emit("answer", newPayload);
    }
  });
};

//this for everyone except ADMIN | for now |
const SendAnswerToClient = async ({ payload, socket }) => {
  const peer = createPeer();
  MEMBERS.push({
    id: payload.id,
    peer,
    level: payload.level,
  });
  MEMBERS.forEach(async (member, index) => {
    if (member.id === payload.id) {
      addTracks({
        mediaStream: MEMBERS[0].mediaStream[0],
        peer: MEMBERS[index].peer,
      });
      MEMBERS[index].peer.onicecandidate = (e) => {
        if (e.candidate) {
          handelOnIceCandidate({
            socket,
            Ice_Candidate: e.candidate,
            id: member.id,
            level: member.level,
          });
        }
      };
      const answer = await createAnswer({
        peer: MEMBERS[index].peer,
        offer: payload.offer,
      });
      let newPayload = {
        to: MEMBERS[index].id,
        from: "server",
        answer,
      };
      socket.emit("answer", newPayload);
    }
  });
};
