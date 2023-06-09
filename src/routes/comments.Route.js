const { createComment } = require("../controllers/comments.Controllers");
const { getComments } = require("../controllers/comments.Controllers");
const { editComments } = require("../controllers/comments.Controllers");
const { protect} = require("../middleware/protect")
const router = require("express").Router();

router.route("/createComments").post(createComment);
router.route("/getComments").get(getComments);
router.route("/editComments").put(editComments);

module.exports = router;