const router = require("express").Router();
const { uploadProfile, displayImage, registerUploadProfile} = require("../controllers/upload.Controller");
const { protect } = require("../middleware/protect");
const { route } = require("./users.Route");


router.route("/uploadImage").post(uploadProfile);
router.route("/registerUploadImage/:userid").post(registerUploadProfile);
router.route("/displayImage/:userId").get(displayImage);
module.exports = router;