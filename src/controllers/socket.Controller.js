const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");
const chatMessage = require("../models/chatMessage");
const io = require("../services/socket");
const allChat = require("../models/chats");
exports.getAllChat = asyncHandler(async (req, res, next) => {
  const publicChat = await allChat.findAll({
    order: [["id", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: publicChat,
  });
});
exports.writeAllChat = asyncHandler(async (req, res, next) => {
  console.log("11111111111");
  const username = req.username;
  const content = req.body;
  console.log("2222222222222222");
 
  // Create the chat message in the database
  const message = await allChat.create({
    sender_name: username,
    content: content,
  });
  console.log("333333333333333333333333");
  // Emit the chat message event to the Socket.IO server
  io.emit("chat message", message);
  console.log("come a little bit closer")
  res.status(201).json({
    success: true,
    data: message,
  });
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