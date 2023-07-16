const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");
const chatMessage = require("../models/chatMessage");
//for getting chat history within two person, one from token other from params for this time 07-16 
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
