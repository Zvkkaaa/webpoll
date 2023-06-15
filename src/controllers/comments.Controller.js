const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");
const comments = require("../models/comments");

exports.createComment = asyncHandler(async (req, res, netx) => {
  try {
    const { pollid } = req.params.pollid;
    const { comment } = req.body;
    const username = req.username;
    const poll = await poll.findById(pollid);
    if (!poll) {
      throw new Error("throwing error!!! cuz we dont know");
    }
    await Comment.create({
      pollid: pollid,
      username: username,
      comment: comment,
      posteddate: Date.now(),
    });
    res.status(200).json(poll);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
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
