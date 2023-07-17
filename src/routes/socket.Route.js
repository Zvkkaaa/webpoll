const router = require("express").Router();
const { protect } = require("../middleware/protect");
const {getChats, saveChat,getAllChat,writeAllChat} = require("../controllers/socket.Controller");

router.route("/:username/saveChat").post(protect,saveChat);
router.route("/:username/getChat").get(protect,getChats);
router.route("/:username/writeAllChat").post(protect,writeAllChat);
router.route("/:username/getALlChat").get(protect,getAllChat);

module.exports = router;