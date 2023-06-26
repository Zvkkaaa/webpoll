const router = require("express").Router();
const { uploadProfile, displayImage } = require("../controllers/upload.Controller");
const { protect } = require("../middleware/protect");

const { deleteProfile, updateProfile } = require("../controllers/upload.Controller");

router.route("/uploadImage").post(protect,uploadProfile);
router.route("/displayImage/:userid").get(displayImage);
router.route("/deleteImage").delete(protect,deleteProfile);
router.route("/updateImage").put(protect,updateProfile);
module.exports = router;