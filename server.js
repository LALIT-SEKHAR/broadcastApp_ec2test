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
  socket.on("disconnect", function () {
    MEMBERS.forEach((member, index) => {
      if (member.id === socket.id) {
        if (member.level !== "ADMIN") {
          return MEMBERS.splice(index, index);
        }
        //TODO close all the connection
        MEMBERS.splice(0, MEMBERS.length);
      }
    });
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
