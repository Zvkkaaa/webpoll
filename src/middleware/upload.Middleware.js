const multer = require('multer');

// Set up multer middleware
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    //path of uplaod file in src in ure local device
    callback(null, 'C:/Users/ok/OneDrive/Desktop/PollingWeb/webpoll/src/upload');
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
const middleware = multer({ storage: storage });

