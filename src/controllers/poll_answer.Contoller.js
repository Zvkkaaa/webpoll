const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const polls = require("../models/polls");
const e = require("express");
const poll_answers = require("../models/poll_answer");
//const logger = require("../services/logger").logger;

exports.getPollAnswers = asyncHandler(async (req, res, next) => {
  const pollid = req.params.id;
  const answers = await poll_answers.findAll({
    where: {
      pollid: pollid,
    },
    order: [["id", "ASC"]],
  });
  if (answers) res.status(200).json({ answers, message: "Answers" });
  else res.status(400).json({ message: "Answers not exist" });
});
exports.createPollAnswers = asyncHandler(async(req,res,next)=>{
  const {pollid} = req.params;
  const {answers} = req.body;
  for(i in answers){
   await poll_answers.create({
    pollid:pollid,
    answername: answers[i],
    }).then(async(result)=>{
      res.status(200).json("added poll answers!");
    }).catch((err)=>{
      res.status(400).json("error in adding poll answers!!!")
    });
  }
});