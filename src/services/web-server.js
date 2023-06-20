let express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT;

// // Set up view engine
// app.set('view engine', 'ejs');
// app.set('views', './src/views');

//const indexRoute = require('./routes/index.Route');
const loginRoute = require('../routes/login.Route');
const usersRoute = require('../routes/users.Route');
const pollsRoute = require('../routes/polls.Route');
const poll_answerRoute = require('../routes/poll_answer.Route');
const poll_attendanceRoute = require('../routes/poll_attendance.Route');
const commentsRoute = require('../routes/comments.Route');
const userProfileRoute = require('../routes/userProfile.Route');
//db table add 
const Users = require('../models/users')
const Poll = require('../models/polls')
const Poll_Answer =require('../models/poll_answer')
const Poll_Attendances = require('../models/poll_attendance')
const Comments = require('../models/comments')
const UserProfile = require('../models/userProfile')
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

  app.use('/auth', loginRoute);
  app.use('/user', usersRoute);
  app.use('/poll', pollsRoute);
  app.use('/answers', poll_answerRoute);
  app.use('/attendance', poll_attendanceRoute);
  app.use('/comment', commentsRoute);
  app.use('/profile', userProfileRoute);
  
  app.use("/public", express.static("public"));
 // const API = require("./src/const/api/Api");
  // //use api
  // app.use(API.usersApi, usersRoute );
  // app.use(API.loginApi, loginRoute );
  // app.use(API.pollsApi, pollsRoute );
  // app.use(API.poll_answerApi, poll_answerRoute );
  // app.use(API.poll_attendanceApi, poll_attendanceRoute );
  // app.use(API.commentsApi, commentsRoute );
  
  Users.sync()
  Poll.sync()
  Poll_Answer.sync()
  Poll_Attendances.sync()
  Comments.sync()
  UserProfile.sync()
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
