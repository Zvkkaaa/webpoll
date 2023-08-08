const router = require("express").Router();
const { protect } = require("../middleware/protect");
const {getChats, saveChat,getAllChat,writeAllChat} = require("../controllers/socket.Controller");
const {getOnlineUsers} = require("../controllers/socket.Controller");
const {setAllChatReadStatus} = require("../controllers/socket.Controller");
const {getUnreadMessageCounts} = require("../controllers/socket.Controller");

// router.route("/:username/saveChat").post(protect,saveChat);
// router.route("/:username/getChat").get(protect,getChats);
router.route("/writeAllChat").post(writeAllChat);
router.route("/:userid/getChats").get(protect,getChats);
router.route("/getAllChat").get(getAllChat);
router.route("/getOnlineUsers").get(getOnlineUsers);
router.route("/setAllChatRead").post(setAllChatReadStatus);
router.route("/getUnreadCount/:userid").get(getUnreadMessageCounts);

module.exports = router;