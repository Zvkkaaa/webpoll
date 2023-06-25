const router = require("express").Router();
const upload= require("../middleware/upload.Middleware")
const { uploadProfile, displayImage } = require("../controllers/upload.Controller");
const { protect } = require("../middleware/protect");


router.route("/:id/uploadImage").post(protect,upload,uploadProfile);
router.route("/:id/displayImage").get(displayImage);
module.exports = router;