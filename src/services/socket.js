const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
const cors = require('cors');
const { writeAllChat, getAllChat } = require("../controllers/socket.Controller");

const app = express();


const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

let connectedUsers = 0;

let sockets = [];

async function initialize() {
  console.log("Connecting to chatting server");

  io.on("connection", (socket) => {
    console.log("A user connected");
    connectedUsers++;
    sockets.push(socket); // Store the socket in an array

    socket.on('chat message', (username, content) => {
      writeAllChat(io, username, content);
    });
    
    socket.on("disconnect", () => {
      console.log("A user disconnected");
      connectedUsers--;
      sockets = sockets.filter(s => s !== socket); // Remove the socket from the array
    });
  });

  server.listen(process.env.SOCKET_PORT, () => {
    console.log(`Socket.IO server listening on port ${process.env.SOCKET_PORT}`);
  });

  // Listen for SIGINT (Ctrl+C) and SIGUSR2 (used by Nodemon) signals and disconnect all sockets
  process.on('SIGINT', disconnectSockets);
  process.on('SIGUSR2', disconnectSockets);
}

function disconnectSockets() {
  sockets.forEach(socket => socket.disconnect());
  process.exit(); // Exit the process after all sockets are disconnected
}


async function close() {
  console.log("Chatting server closing...");
  // Place any cleanup or closing logic here, if needed
}

module.exports.initialize = initialize;
module.exports.close = close;
module.exports.getConnectedUsers = () => connectedUsers;
