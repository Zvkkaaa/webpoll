const { createPoll, deletePoll } = require("../controllers/polls.Controller");
const { getPolls } = require("../controllers/polls.Controller");
const { getPoll } = require("../controllers/polls.Controller");
const { protect } = require("../middleware/protect");
const { updatePoll } = require("../controllers/polls.Controller");
const { adminUpdatePoll, adminDeletePoll, searchPollsByQuestion} = require("../controllers/polls.Controller");

const router = require("express").Router();

router.route("/createPoll").post(protect,createPoll);
router.route("/list").get(getPolls);
router.route("/:id").get(getPoll);
router.route("/updatePoll/:id").put(updatePoll);
router.route("/deletePoll/:id").delete(deletePoll);
router.route("/adminUpdatePoll/:id").put(adminUpdatePoll);
router.route("/adminDeletePoll/:id").delete(adminDeletePoll);
router.route("/search").get(searchPollsByQuestion);
module.exports = router;
