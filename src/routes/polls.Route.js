const { createPoll } = require("../controllers/polls.Controllers");
const { getPolls } = require("../controllers/polls.Controllers");
const { getPoll } = require("../controllers/polls.Controllers");
const { protect} = require("../middleware/protect")
const router = require("express").Router();

router.route("/createPoll").post(createPoll);
router.route("/getPolls").get(getPolls);
router.route("/getPoll").get(getPoll);

module.exports = router;