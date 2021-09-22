require("dotenv").config();
const express = require("express");
const { MEMBERS } = require("./src/DATABASE");
const { IceCandidateScanner } = require("./src/SocketRoutes/IceCandidate");
const { offerScanner } = require("./src/SocketRoutes/Offer");
const app = express();
const server = require("http").createServer(app);
const Io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

Io.on("connection", (socket) => {
  console.log(`${socket.id} is connected!`);
  socket.on("offer", (payload) => {
    offerScanner({ payload, socket });
  });
  socket.on("ice_candidate", (payload) => {
    IceCandidateScanner({ payload, socket });
  });
  socket.on("answer", (payload) => {
    console.log("answer: ", payload);
  });
  socket.on("CLOSE", (payload) => {
    console.log("close");
    socket.broadcast.emit("CLOSE");
  });
  socket.on("disconnect", function () {
    MEMBERS.forEach((member, index) => {
      if (member.id === socket.id) {
        if (member.level !== "ADMIN") {
          MEMBERS.splice(index, index);
          console.log(member.id, "remove the meet");
          return socket.broadcast.emit("MEMBER_LEAVE", { id: member.id });
        }
        // Removing the ADMIN from the array
        MEMBERS.splice(0, MEMBERS.length);
        // closing all the connection who connected to the ADMIN
        console.log("close");
        socket.broadcast.emit("CLOSE");
      }
    });
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
