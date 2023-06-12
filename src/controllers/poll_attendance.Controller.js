const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes,Sequelize } = require("sequelize");
const poll_attendance = require("../sequelize/models/poll_attendance");

const e = require("express");
//const logger = require("../services/logger").logger;

exports.getPollAttendance = async (req, res, next) => {
    try {
      const {pollid} = req.params;
      const answers = await poll_answers.findById(pollid);
      const answerNums = [];
      for(ans in answers) {
        let temp =0;
        
        let attendancy = await poll_attendance.findAll({
            where: {
                pollid:pollid,
                answerid:ans.id,
            }
        });
        temp = attendancy.length;
        answerNums.push(temp)
      }
      res.status(200).json(comments);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };