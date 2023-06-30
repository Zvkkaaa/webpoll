const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");
const poll_answers = require("../models/poll_answer");
const attendance = require('../models/poll_attendance');
exports.getPollAnswers = asyncHandler(async (req, res, next) => {
  const idd = req.params.id; // Assuming the parameter name is "id"
  // Assuming "polls" is your Sequelize model
  const poll = await poll_answers.findAll({
    where: {
      pollid: idd,
    },
  });
  if (poll) {
    res.status(200).json(poll);
  } else {
    res.status(400).json("Poll answers doesn't exist!");
  }
});

/*
exports.getPoll = asyncHandler(async (req, res, next) => {
  const pollId = req.params.id; // Assuming the parameter name is "id"
  // Assuming "polls" is your Sequelize model
  const poll = await polls.findOne({
    where: {
      id: pollId,
    },
  });
  if (poll) {
    res.status(200).json(poll);
  } else {
    res.status(400).json("Poll doesn't exist!");
  }
});*/
exports.createPollAnswer = asyncHandler(async(req, res, next) => {
  const pollid = req.params.id;
  const {answer} = req.body;
  const userid = req.userid;

  console.log("--------------------" + pollid, answer, userid)

  if (!answer) {
    return res.status(400).json({
      success: false,
      message: "input is empty"
    });
  }

  if (!pollid) {
    return res.status(400).json({
      success: false,
      message: "poll not found"
    });
  }

  const result = await poll_answers.create({
    pollid: pollid,
    answername: answer
  });

  console.log("created pollAnswer: " + result.answername);
  
  const choice = result.id;

  if (!pollid || !userid || !choice) {
    return res.status(403).json({
      success: false,
      message: "Forbidden to attend"
    });
  }

  const dupatt = await attendance.findOne({
    where: {
      pollid: pollid,
      userid: userid
    }
  });

  if (!dupatt) {
    console.log("creating attendance letsgo");
    await attendance.create({
      pollid: pollid,
      userid: userid,
      answerid: choice
    });
  } else {
    console.log("updating attendance smoge");
    await attendance.update(
      { answerid: choice || null },
      {
        where: {
          [Op.and]: [{ userid: userid }, { pollid: pollid }]
        }
      }
    );
  }

  res.status(200).json({
    success: true,
    message: "Added answer and attendance",
    answer: result
  });
});


exports.getAnswernames = asyncHandler(async(req,res,next)=>{
  const pollid = req.params.id;
  let answerName = [];
  const answers = await poll_answers.findAll({
    where: {
      pollid:pollid,
    }
  });
  if(answers){
  for(i in answers){
    answerName.push(answers[i].answername);
    }
    res.status(200).json(answerName);
  }
  else res.status(500).json({
    success:false,
    message: "Answers doesn't exist!"
  });
});