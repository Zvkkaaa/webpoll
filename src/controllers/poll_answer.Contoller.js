const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");
const poll_answers = require("../models/poll_answer");
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
exports.createPollAnswers = asyncHandler(async(req,res,next)=>{
  const {pollid} = req.params;
  const {answers} = req.body;
  for(i in answers){
   await poll_answers.create({
    pollid:pollid,
    answername: answers[i],
    }).then(async(result)=>{
      res.status(200).json("added poll answer!");
    }).catch((err)=>{
      res.status(err).json(err);
    });
  }
});
