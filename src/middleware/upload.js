const multer = require('multer');
const path = require('path')
// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder for uploaded files
    cb(null, path.join(__dirname, 'src', 'upload'));
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.originalname.replace(/[^a-zA-Z0-9]/g, '') + '-' + uniqueSuffix;
    cb(null, filename);
  }
});

// Create the multer middleware
const upload = multer({ storage: storage });
