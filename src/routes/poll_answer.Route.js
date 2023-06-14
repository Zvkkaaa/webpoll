const { getPollAnswers } = require("../controllers/poll_answer.Contoller");
const {createPollAnswers} =require("../controllers/poll_answer.Contoller");
 
const { protect } = require("../middleware/protect");
const router = require("express").Router();

router.route("/").get(protect, getPollAnswers);
router.route("/:id/createPollAnswers").post(createPollAnswers);
module.exports = router;
