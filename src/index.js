let express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const port = 3000; // Change this port number if needed


// Define routes
const indexRoute = require('./routes/index.Route');
const LoginRoute = require("./routes/");  
app.use('/', indexRoute);


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
    helmet.expectCt(),
    helmet.frameguard()
  );
  app.use(cors());
  app.use(express.json());

  app.use("/auth", LoginRoute);
  app.use("/user", UsersRouts);

  app.use("/public", express.static("public"));

  app.listen(process.env.PORT, function () {
    console.log("Server is ready at" + process.env.PORT);
  });
}

function close() {}

module.exports.initialize = initialize;
module.exports.close = close;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

