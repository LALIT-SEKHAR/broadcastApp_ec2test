require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const Io = require("socket.io")(server);

Io.on("connection", (socket) => {
  console.log(`${socket.id} is connected!`);
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
