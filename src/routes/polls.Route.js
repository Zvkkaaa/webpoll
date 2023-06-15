const { createPoll, deletePoll } = require("../controllers/polls.Controller");
const { getPolls } = require("../controllers/polls.Controller");
const { getPoll } = require("../controllers/polls.Controller");
const { protect } = require("../middleware/protect");
const router = require("express").Router();

router.route("/createPoll").post(protect,createPoll);
router.route("/list").get(getPolls);
router.route("/:id").get(getPoll);


module.exports = router;
