const asyncHandler = require("../middleware/asyncHandler");
const { Op } = require("sequelize");
const allChat = require("../models/chats");
const io = require("../services/socket");

exports.getAllChat = asyncHandler(async (req, res, next) => {
  const publicChat = await allChat.findAll({
    order: [["id", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: publicChat,
  });
});

exports.writeAllChat = asyncHandler(async (protect,thing) => {
  // Create the chat message in the database
  const message = await allChat.create({
    sender_name: protect.req.username,
    content: thing,
  });

  // Emit the chat message event to the Socket.IO server
  io.emit("chat message", message);

  res.json({
    success: true,
    data: message,
  });
});

exports.getOnlineUsers = asyncHandler(async(req,res,next)=>{
  //write something here to use loggedUsers
});


//odoohondoo ashiglahgui
exports.getChats = asyncHandler(async (req, res, next) => {
  const me = req.username;
  const chatter = req.params.username;
  const chatHistory = await chatMessage.findAll({
    where: {
      [Op.or]: [
        { sender_name: me, recipient_name: chatter },
        { sender_name: chatter, recipient_name: me },
      ],
    },
    order: [["sentdate", "DESC"]],
  });

  if (!chatHistory) {
    return res.status(404).json({
      success: false,
      message: "Not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: chatHistory,
  });
});

//for save chat 
exports.saveChat = asyncHandler(async(req,res,next)=>{
  //this just saves data not sending msg at this time
  const me = req.username;
  const chatter = req.params.username;
  const content = req.body;
  const chat = await chatMessage.create({
      sender_name:me,
      recipient_name:chatter,
      content:content,
  });

});
