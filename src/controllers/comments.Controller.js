const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");
const comments = require("../models/comments");

exports.createComment = asyncHandler(async (req, res, netx) => {
  // try{
  const username = req.username;
  const pollId = req.params.id;
  const {comment} = req.body;
 // console.log(Date.now());
 if(comment){
  const commento = await comments.create({
  username:username,
  pollid:pollId,
  comment : comment
});
if(commento){
  //console.log(commento);
  return res.status(200).json({
    //success: true,
   // message: "created comment for: "+pollId,
    commento
  });
}else{
  return res.status(500).json({
    success: false,
    message: "failed"
  })
}
}
else{ res.status(400).json({success: false,message: "table is empty"});}
  

  
// }catch(err){res.status(400).json({err, message:err});}

});
// exports.getComments = asyncHandler(async(req, res, next) => {
//   try {
//     const { pollid } = req.params;
//     const comments = await comments.find({
//       where: {
//         [Op.and]: [{pollid:pollid}],
//         order : [["posteddate","DESC"]],
//     }
//     }).
//     res.status(200).json(comments);
//   } catch (e) {
//     res.status(400).json({ error: e.message });
//   }
// });
//writing another getComments
// exports.getComments = asyncHandler(async (req, res, next) => {
//   const { pollid } = req.params.pollid;
//   await comments.findAll({
//     where: {
//       pollid: pollid,
//       order: [["posteddate", "DESC"]],
//       raw: true,
//     },
//   });
//   res.status(200).json(comments);
// });
exports.getComments = asyncHandler(async (req, res, next) => {
  const idd = req.params.id; // Assuming the parameter name is "id"
  // Assuming "polls" is your Sequelize model
  const commentos = await comments.findAll({
    where: {
      pollid: idd,
      
    },
    order: [["id","DESC"]],
  });
  if (commentos) {
    res.status(200).json(commentos);
  } else {
    res.status(400).json("Comments doesn't exist!");
  }
});


exports.editComment = asyncHandler(async (req, res, next) => {
  try {
    const { commentsid } = req.params;
    const user = req.user;
    const comment = await comments.findById();
    if (commentsid + "" !== usersid + "") {
      throw new Error("You cannot edit that comment, because you not owner");
    }
    comment.posteddate = posteddate();
    comment.save();
    res.status(200).json("Comment edited");
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const { id, userid } = req.params;
  const comment = await comments.findById(id);
  if (comment) {
    if (comment.userid + "" !== "" + userid + "") {
      res
        .status(200)
        .json("can't delete comment because you're not the owner!");
    } else {
      comments.splice(index, 1);
      comment.remove();
      res.status(200).json("Comment deleted successfully");
    }
  } else res.status(200).json("Comment doesn't exist");
});
