const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const poll_attendance = require("../models/poll_attendance");
const e = require("express");
const poll_answers = require("../models/poll_answer");
const polls = require("../models/polls");
const moment = require('moment');
exports.getPollAttendance = asyncHandler(async (req, res, next) => {
  const pollid = req.params.id;
  const answers = await poll_answers.findAll({
    where: {
      pollid:pollid,
    }
  });
 console.log(answers);
  let answerNums = [];
  for (i in answers) {
    let temp = 0;
    let attendancy = await poll_attendance.findAll({
      where: {
        pollid: pollid,
        answerid: answers[i].id,
      },
    });
    temp = attendancy.length;
    answerNums.push(temp);
  }
  console.log("--------------"+answerNums+"------------");
  res.status(200).json(answerNums);
});
exports.createPollAttendance = async (req,res,next) => {
  const pollid = req.params.id;
  const answerid = req.params.answerid;
  const userid = req.userid;
  const attendance = await poll_attendance.findOne({
    where:{
      pollid:pollid,
      userid:userid,
    }
  });
  if(!attendance){
    if(answerid && pollid){
      await poll_attendance.create({
        pollid: pollid,
        userid:userid,
        answerid:answerid,
      })
      .then(async (result) => {
        return res.status(200).json({
          success: true,
          // token: encryptedPassword,
          message: "songuuli amjilttai",
        });
      })
    }
    else{
      res.status(400).json("failed to save the option");
    };  
  }
  else{
    res.status(500).json("already submitted this poll!!!");
  }
};

exports.getOwnAttendance = asyncHandler(async (req,res,next)=>{
  const userid = req.userid;
  const pollId = req.params.id;
  const attend = await poll_attendance.findOne({
    where:{
      [Op.and]:[{userid:userid},{pollid:pollId}],
    }
  });
  if(attend){
    res.status(200).json({
      success:true,
      attend
    });
    return;
  }
  else{
    res.status(500).json({
      success:false,
      message:"Attendance not found"
    })
  }
});
exports.updatePollAttendance = asyncHandler(async (req, res, next) => {
  const userid = req.userid;
  const pollId = req.params.id;
  const answerid = req.params.answerid;

  const previous = await poll_attendance.findOne({
    where: {
      [Op.and]: [{ userid: userid }, { pollid: pollId }]
    }
  });

  if (previous) {
    await poll_attendance.update(
      { answerid: answerid || null },
      {
        where: {
          [Op.and]: [{ userid: userid }, { pollid: pollId }]
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "Choice updated"
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Not found"
    });
  }
});
