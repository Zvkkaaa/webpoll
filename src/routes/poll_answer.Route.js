const { getPollAnswers } = require("../controllers/poll_answer.Contoller");
const { protect} = require("../middleware/protect")
const router = require("express").Router();

router.route("/").get(getPollAnswers);

module.exports = router;