const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");
const polls = require("../models/polls");
const poll_answers = require("../models/poll_answer");
const { start } = require("init");
// exports.createPoll = asyncHandler(async (req, res, next) => {
//   const { question, startdate, expiredate} = req.body;
//   //const { userid } = req.param;
//   if (!question || !startdate || !expiredate) {
//     return res.status(400).json({
//       success: false,
//       message: "table is empty!!!",
//     });
//   }
//   await polls
//     .findOne({
//       where: {
//         [Op.and]: [ { question: question }],
//       },
//     })
//     .then(async (result) => {
//       if (result == null) {
//         await polls
//           .create({
//             //userid: userid,
//             question: question,
//             startdate: startdate,
//             expiredate: expiredate,
//           })
//           .then(async (result) => {
//               res.status(200).json({
//               success: true,
//               message: "poll added successfully",
//             });
//           });
//       } else {
//         res.status(500).json({
//           success: false,
//           message: "service fault",
//         });
//       }
//     });
// });

exports.createPoll = asyncHandler(async (req, res, next) => {
  const { question, startdate, expiredate, answer } = req.body
  const username = req.username
  if (!question || !startdate || !expiredate || !answer) {
    return res.status(400).json({
      success: false,
      message: "table is empty!!!",
    });
  }
  await polls.findOne({
    where: {
      question: question,
    }
  })
    .then(async (result) => {
      if (result == null) {
        const new_poll = await polls.create({
          username: username,
          question: question,
          startdate: startdate,
          expiredate: expiredate,
        });

        const idd = new_poll.id
        for (i in answer) {
          await poll_answers.create({
            pollid: idd,
            answername: answer[i],
          })
        }

                    res.status(200).json({success:true, message:"added answer"});
                
            }else{
                res.status(500).json({
                    success: false, 
                    message: "service fault",
                });
            }
        });
    });
  //getAllpolls
  exports.getPolls = asyncHandler(async (req, res, next) => {
    const pollers = await polls.findAll();
    if (pollers) res.status(200).json(pollers);
    else res.status(400).json({ error: error.message });
  });
  exports.getPoll = asyncHandler(async (req, res, next) => {
    const idd = req.params.id;
    const poll = await polls.findOne({
      where: {
        id: idd,
      },
    });
    if (poll) res.status(200).json(poll);
    else res.status(400).json("Poll doesn't exist!");
  });


exports.deletePoll = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //console.log("--------------"+pollid);
    const poll = await polls.findOne({
      where: {
        id:id,
      }
    });
    if (poll) 
        await polls.destroy({
          where: {
            id: id,
          },
        });
        res.status(200).json("poll deleted!");
});
exports.updatePoll = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { question, startdate, expiredate } = req.body;
  console.log(id, username, question);
  const poll = await polls.findOne({
    where:{
      id:id,
    }
  });
  if (poll) {
    const updatedInfo = {};
    if(question){
      updatedInfo.question=question;
    }
    if(startdate){
      updatedInfo.startdate=startdate;
    }
    if(expiredate){
      updatedInfo.expiredate=expiredate;
    }
    await polls.update(updatedInfo, { where: { id:id } })
    .then((result) => {
      return res.status(200).json("Updated profile");
    });
  } else {
    res.status(200).json("Poll doesn't exist!");
  }
});

exports.adminUpdatePoll = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { question, startdate, expiredate } = req.body;

  const poll = await polls.findByPk(id);

  if (!poll) {
    return next(new ErrorResponse("Poll not found", 404));
  }

  const updatedPollData = {};

  if (question) {
    updatedPollData.question = question;
  }
  if (startdate) {
    updatedPollData.startdate = startdate;
  }
  if (expiredate) {
    updatedPollData.expiredate = expiredate;
  }

  await polls.update(updatedPollData, { where: { id: id } });
  res.status(200).json({ success: true, message: "Poll updated successfully" });
});


exports.adminDeletePoll = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const poll = await polls.findByPk(id);

  if (!poll) {
    return next(new ErrorResponse("Poll not found", 404));
  }

  await polls.destroy({ where: { id: id } });

  res.status(200).json({ success: true, message: "Poll deleted successfully" });
});
// pollsController.js
exports.searchPollsByQuestion = asyncHandler(async (req, res, next) => {
  const { question } = req.query;
  // Validate that the 'question' parameter is provided
  if (!question) {
    return res.status(400).json({
      success: false,
      message: 'Missing required query parameter: question'
    });
  }

  try {
    const searchingPolls = await polls.findAll({
      where: {
        question: {
          [Op.like]: `%${question.toLowerCase()}%`
        }
      }
    });

    if (searchingPolls.length > 0) {
      res.status(200).json({
        success: true,
        searchingPolls
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No polls found matching the search query'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to search for polls'
    });
  }
});
//use this for my-poll button
exports.myPolls = asyncHandler(async(req,res,next)=>{
  const username = req.username;
  const myPollz = await polls.findAll({
    where:{username:username}
  });
  if(!myPollz) return res.status(404).json({
    success:false,
    message:"Not found"
  });
   return res.status(200).json({
    success:true,
    myPollz
  });
});