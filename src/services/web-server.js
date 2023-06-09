let express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const port = 3000;

// // Set up view engine
// app.set('view engine', 'ejs');
// app.set('views', './src/views');

//const indexRoute = require('./routes/index.Route');
const loginRoute = require('../routes/login.Route');
const usersRoute = require('../routes/users.Route');
const pollsRoute = require('../routes/polls.Route');
const poll_attendanceRoute = require('../routes/poll_attendance.Route');
const commentsRoute = require('../routes/comments.Route');

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
  app.use('/pollAt', poll_attendanceRoute);
  app.use('/poll/:id', commentsRoute);


  app.use("/public", express.static("public"));

  app.listen(process.env.PORT, function () {
    console.log("Server is ready at" + process.env.PORT);
  });
  // Start the server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

}

function close() {}

module.exports.initialize = initialize;
module.exports.close = close;
