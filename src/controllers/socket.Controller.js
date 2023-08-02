const asyncHandler = require("../middleware/asyncHandler");
const { Op } = require("sequelize");
const allChat = require("../models/chats");
const chatMessage = require("../models/chatMessage");
const users = require("../models/users");
exports.getAllChat = asyncHandler(async (req, res) => { // Add the req and res parameters
  console.log("displaying all chat");
  const publicChat = await allChat.findAll({
    order: [["id", "DESC"]],
  });
  for (let i in publicChat) {
    const user = await users.findOne({
      where: {
        id: publicChat[i].sender_id,
      },
    });
    publicChat[i].username = user.username;
  }
  res.status(200).json({
    success: true,
    data: publicChat,
  });
});

exports.writeAllChat = asyncHandler(async (io, data) => {
  console.log("--------------"+data.content+"--------------------");
  console.log(typeof io.emit === 'function');
  console.log("--------------"+data.sender+"--------------------");
  console.log("--------------"+data.reciept+"--------------------");
  const cont = data.content;
  const sender = data.sender;
  // const reciept = data.reciept;
  // if(reciept==="GLOBAL"){
    console.log("creating global chat");
    const message = await allChat.create({
      sender_id: sender,
      content: cont,
    });
    const user = await users.findOne({
      where:{
        id:sender
      }
    });
    message.username = user.username;
  // }
  // Create the chat message in the database
  // else{
    
  //   console.log("creating DM chat");
  //   const message = await chatMessage.create({
  //     sender_id:sender,
  //     recipient_id:reciept,
  //     content:cont
  //   });s
  // }
  // Emit the chat message event to the Socket.IO server
  console.log("==============="+message.username)
  io.emit('display all chat', message );

  // return {
  //   success: true,
  //   data: message,
  // };
});




exports.getOnlineUsers = asyncHandler(async(req,res,next)=>{
  //write something here to use loggedUsers
});


exports.getChat = asyncHandler(async (req, res,next) => {
  console.log("displaying last dm");
  const sender = req.userid;
  const reciept = req.params.userid;
  console.log("-----------------------"+sender,reciept);
  const chatHistory = await chatMessage.findOne({
    where: {
      [Op.or]: [
        { sender_id: sender, recipient_id: reciept },
        { sender_id: reciept, recipient_id: sender },
      ],
    }
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

exports.getChats = asyncHandler(async (req,res,next) => {
  console.log("displaying dm");
  const sender = req.userid;
  const reciept = req.params.userid;
  console.log("-----------------------"+sender,reciept);
  const chatHistory = await chatMessage.findAll({
    where: {
      [Op.or]: [
        { sender_id: sender, recipient_id: reciept },
        { sender_id: reciept, recipient_id: sender },
      ],
    },
    order: [["id", "DESC"]],
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
exports.writedm = asyncHandler(async(io,data)=>{
  const cont = data.content;
  const sender = data.sender;
  const reciept = data.reciept;
  console.log(sender, reciept, cont);
  
  const chat = await chatMessage.create({
      sender_id:sender,
      recipient_id:reciept,
      content:cont,
  });
  if(chat) console.log("created chat backup");

  io.emit('display dm', chat);
});