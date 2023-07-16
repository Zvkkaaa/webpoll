const router = require("express").Router();
const { protect } = require("../middleware/protect");
const {getChats, saveChat} = require("../controllers/socket.Controller");

router.route("/:username/saveChat").post(protect,saveChat);
router.route("/:username/getChat").post(protect,getChats);

module.exports = router;