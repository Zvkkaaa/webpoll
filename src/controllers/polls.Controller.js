const asyncHandler = require("../middleware/asyncHandler");
//const db = require("../services/database");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");
const polls = require("../models/polls");
const poll_answers = require("../models/poll_answer");
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

exports.createPoll = asyncHandler(async (req,res,next) => {
  const { question,startdate,expiredate, answer} = req.body
  const username = req.username
  if(!question || !startdate || !expiredate || !answer) {
      return res.status(400).json({
          success:false,
          message:"table is empty!!!",
      });
      }
  await polls.findOne({
      where: {
          question:question,
      }
  })
      .then(async(result) =>{
          if(result == null){
              const new_poll = await polls.create({
                  username: username,
                  question: question,
                  startdate: startdate,
                  expiredate: expiredate,
                });
   
                  const idd = new_poll.id
                  for(i in answer){
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
  try {
    const { id, userid } = req.params;
    const poll = await polls.findOne({
      where: {
        id: id,
        userid: userid,
      },
    });
    if (poll) {
      if (poll.userid + "" !== "" + userid + "")
        throw new Error("You cant delete that poll, because you not owner");
      else {
        polls.splice(index, 1);
        await poll.remove();
        res.status(200).json("poll deleted!");
      }
    } else {
      res.status(200).json("poll doesn't exist");
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
exports.updatePoll = asyncHandler(async (req, res, next) => {
  const { pollid } = req.params;
  const { user } = req.user;
  const { question, startdate, expiredate } = req.body;
  const poll = await polls.findById(pollid);
  if (poll) {
    if (poll.userid + "" == "" + user.id) {
      poll.question = question ? question : undefined;
      poll.startdate = startdate ? startdate : undefined;
      poll.expiredate = expiredate ? expiredate : undefined;
      poll.save();
      res.status(200).json("Poll updated succesfully");
    } else {
      res.status(200).json("Can't edit because you're not the owner");
    }
  } else {
    res.status(200).json("Poll doesn't exist!");
  }
});

exports.adminUpdatePoll = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { question, startDate, expireDate } = req.body;

  const poll = await polls.findByPk(id);

  if (!poll) {
    return next(new ErrorResponse("Poll not found", 404));
  }

  const updatedPollData = {};

  if (question) {
    updatedPollData.question = question;
  }
  if (startDate) {
    updatedPollData.startDate = startDate;
  }
  if (expireDate) {
    updatedPollData.expireDate = expireDate;
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
