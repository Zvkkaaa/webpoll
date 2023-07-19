//gonna use this github also ::: https://github.com/trulymittal/chat-socket.io


const http = require("http");
const socketIO = require("socket.io");
let express = require("express");
const app = express();

const server = http.createServer();
const io = socketIO(server);
let connectedUsers = 0;

async function initialize() {
  console.log("Connecting to chatting server");

  // Place your database initialization code here
  // For example, you can include the code for connecting to PostgreSQL using Sequelize
  const socketRoute = require('../routes/socket.Route');
  app.use("/allChat", socketRoute);
  io.on("connection", (socket) => {
    console.log("A user connected");
    connectedUsers++;

    socket.on("chat message", (message) => {
      console.log("Received message:", message);
      io.emit("chat message", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      connectedUsers--;
    });
  });
  server.listen(process.env.SOCKET_PORT, () => {
    console.log(`Socket.IO server listening on port ${process.env.SOCKET_PORT}`);
  });
}

async function close() {
  console.log("Chatting server closing...");
  // Place any cleanup or closing logic here, if needed
}

module.exports.initialize = initialize;
module.exports.close = close;
module.exports.getConnectedUsers = () => connectedUsers;
