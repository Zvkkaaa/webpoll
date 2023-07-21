const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
const cors = require('cors');
const { writeAllChat, getAllChat, handleLogin } = require("../controllers/socket.Controller");

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
let userSockets = {};

async function initialize() {
  console.log("Connecting to chatting server");

  io.on("connection", (socket) => {
    console.log("A user connected");
    connectedUsers++;

    // Listen for the login event to receive the username from the client
    socket.on("login", (username) => {
      console.log(`${username} has connected`);
      
      // Call the controller function for login handling
      handleLogin(username);
      
      // Store the socket with the username in the object
      userSockets[username] = socket;
    });
    
    socket.on('chat message', (username, content) => {
      writeAllChat(io, username, content);
      console.log("message sent: " + content + " from: " + username);
    });

    socket.on('display message', (username) => {
      getAllChat(io, username);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      connectedUsers--;

      // Remove the disconnected socket from the object
      // To do this, we need to find the associated username first.
      const disconnectedUser = Object.keys(userSockets).find((username) => userSockets[username] === socket);
      if (disconnectedUser) {
        delete userSockets[disconnectedUser];
        console.log(`${disconnectedUser} has disconnected`);
      }
    });
  });

  server.listen(process.env.SOCKET_PORT, () => {
    console.log(`Socket.IO server listening on port ${process.env.SOCKET_PORT}`);
  });

  // Listen for SIGINT (Ctrl+C) and SIGUSR2 (used by Nodemon) signals and disconnect all sockets
  process.on('SIGINT', disconnectSockets);
  process.on('SIGUSR2', disconnectSockets);
}

// ... (existing code)

module.exports.handleLogin = handleLogin;
