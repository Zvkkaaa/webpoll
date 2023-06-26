const multer = require('multer');

// Set up multer middleware
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    //path of uplaod file in src in ure local device
    callback(null, '../src/upload');
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

