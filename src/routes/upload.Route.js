const router = require("express").Router();
const { uploadProfile, displayImage } = require("../controllers/upload.Controller");
const { protect } = require("../middleware/protect");


router.route("/uploadImage").post(protect,uploadProfile);
router.route("/displayImage/:userid").get(displayImage);
module.exports = router;