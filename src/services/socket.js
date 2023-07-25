const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
const cors = require('cors');
const { writeAllChat, getAllChat, getChat,getChats,writedm } = require("../controllers/socket.Controller");
const { connect } = require("http2");

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
    console.log("chatting server is online...");
    // console.log(connectedUsers);
    // Listen for the login event to receive the username from the client
    socket.on("Login", (username) => {
      console.log(`${username} has connected`);
      // Store the ssocket with the username in the object
      connectedUsers++;
      userSockets[username] = socket;
    });
    
    socket.on('all chat', (data) => {
      writeAllChat(io, data);
      console.log(connectedUsers);
      // console.log("message sent: " + data.reciept + " from: " + data.username);
    });

    socket.on('dm', (data) => {
      writedm(io, data);
      // console.log("message sent: " + data.reciept + " from: " + data.username);
    });
    socket.on('disco',(sender,reciept)=>{
      getChat(io,sender,reciept);
    });
    socket.on('display all chat', (userid) => {
      getAllChat(io, userid);
    });

    socket.on('display dm', (sender, reciept) => {
      getChats(io, sender,reciept);
    });

    socket.on("close", username => {
      console.log(`${username}'s disconnected`);
      connectedUsers--;
      // Remove the disconnected socket from the object
      // To do this, we need to find the associated username first.
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
  Object.values(userSockets).forEach(socket => socket.disconnect());
  process.exit(); // Exit the process after all sockets are disconnected
}

async function close() {
  console.log("Chatting server closing...");
  // Place any cleanup or closing logic here, if needed
}

module.exports.initialize = initialize;
module.exports.close = close;
module.exports.getConnectedUsers = () => connectedUsers;
