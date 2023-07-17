let express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require('path');
const app = express();
const port = process.env.PORT;

// // Set up view engine
// app.set('view engine', 'ejs');
// app.set('views', './src/views');

//copy code from this github if it's necessary https://github.com/bradtraversy/chatcord

//const indexRoute = require('./routes/index.Route');
const loginRoute = require('../routes/login.Route');
const usersRoute = require('../routes/users.Route');
const pollsRoute = require('../routes/polls.Route');
const poll_answerRoute = require('../routes/poll_answer.Route');
const poll_attendanceRoute = require('../routes/poll_attendance.Route');
const commentsRoute = require('../routes/comments.Route');
//db table add 
const Users = require('../models/users')
const Poll = require('../models/polls')
const Poll_Answer =require('../models/poll_answer')
const Poll_Attendances = require('../models/poll_attendance')
const Comments = require('../models/comments')
const Upload = require('../models/upload');
const ChatMessage = require('../models/chatMessage');
const allChat = require('../models/allChat');

// const scheduler = require("./scheduler"); // устгаж болохгүй!!!
//uuganaaa
function initialize() {
  const app = express();
  app.use(morgan("dev"));
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: false }));
  app.use(
    express.json({
      limit: "50mb",
    })
  );
  app.use(
    express.urlencoded({
      limit: "50mb",
    })
  );
  app.use(
    helmet.hidePoweredBy(),
    helmet.noSniff(),
    helmet.xssFilter(),
    helmet.contentSecurityPolicy(),
    helmet.crossOriginEmbedderPolicy(),
    helmet.frameguard()
  );
  app.use(cors());
  app.use(express.json());
  
  const loginRoute = require('../routes/login.Route');
  const usersRoute = require('../routes/users.Route');
  const pollsRoute = require('../routes/polls.Route');
  const poll_answerRoute = require('../routes/poll_answer.Route');
  const poll_attendanceRoute = require('../routes/poll_attendance.Route');
  const commentsRoute = require('../routes/comments.Route');
  const uploadRoute = require('../routes/upload.Route');
  const socketRoute = require('../routes/socket.Route');


  app.use('/auth', loginRoute);
  app.use('/user', usersRoute);
  app.use('/poll', pollsRoute);
  app.use('/answers', poll_answerRoute);
  app.use('/attendance', poll_attendanceRoute);
  app.use('/comment', commentsRoute);
  app.use('/image',uploadRoute );
  app.use('/uploads', express.static(path.join(__dirname, '../src/upload'))); // Serve static files from the 'src/upload' folder
  app.use('/socket',socketRoute);
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/upload/index.html'));
  });
  

  app.use("/public", express.static("public"));
 // const API = require("./src/const/api/Api");
  // //use api
  // app.use(API.usersApi, usersRoute );
  // app.use(API.loginApi, loginRoute );
  // app.use(API.pollsApi, pollsRoute );
  // app.use(API.poll_answerApi, poll_answerRoute );
  // app.use(API.poll_attendanceApi, poll_attendanceRoute );
  // app.use(API.commentsApi, commentsRoute );
  
  // Users.sync();
  // Poll.sync();
  // Poll_Answer.sync();
  // Poll_Attendances.sync();
  // Comments.sync();
  // Upload.sync();
  Users.sync()
  .then(() => Poll.sync())
  .then(() => Upload.sync())
  .then(() => Poll_Answer.sync())
  .then(() => Poll_Attendances.sync())
  .then(() => Comments.sync())
  .then(() => {ChatMessage.sync();
              allChat.sync();});
  app.listen(process.env.PORT, function () {
    console.log("Server is ready at" + process.env.PORT);
  });
  // Start the server
  // app.listen(port, () => {
  //   console.log(`Server listening on port ${port}`);
  // });

}

function close() {}

module.exports.initialize = initialize;
module.exports.close = close;
/*
some server code for socket io found on internet
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const redis = require("redis");
require("dotenv").config();
const { createClient } = redis;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

(async () => {
  pubClient = createClient({ url: "redis://127.0.0.1:6379" });
  await pubClient.connect();
  subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
})();

// Run when client connects
io.on("connection", (socket) => {
  console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
*/ 