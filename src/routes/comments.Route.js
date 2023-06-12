const { createComment } = require("../controllers/comments.Controller");
const { getComments } = require("../controllers/comments.Controller");
const { editComment } = require("../controllers/comments.Controller");
const {deleteComment} = require("../controllers/comments.Controller")
const { protect} = require("../middleware/protect")
const router = require("express").Router();

router.route("/createComments").post(createComment);
router.route("/getComments").get(getComments);
router.route("/editComments").put(editComment);
router.route("/deleteComments").delete(deleteComment);

module.exports = router;