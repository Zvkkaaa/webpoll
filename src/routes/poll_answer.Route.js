const { getPollAnswers } = require("../controllers/poll_answer.Contoller");

 
const { protect } = require("../middleware/protect");
const router = require("express").Router();

router.route("/:id").get(getPollAnswers);
// router.route("/:id/createPollAnswers").post(createPollAnswers);
module.exports = router;
