const { createComment } = require("../controllers/comments.Controller");
const { getComments } = require("../controllers/comments.Controller");
const { editComment } = require("../controllers/comments.Controller");
const { deleteComment } = require("../controllers/comments.Controller");
const { protect } = require("../middleware/protect");
const router = require("express").Router();

router.route("/createComments").post(protect, createComment);
router.route("/getComments").get(protect, getComments);
router.route("/editComments").put(protect, editComment);
router.route("/deleteComments").delete(protect, deleteComment);

module.exports = router;
