const { createComment } = require("../controllers/comments.Controller");
const { getComments } = require("../controllers/comments.Controller");
const { editComment } = require("../controllers/comments.Controller");
const { deleteComment } = require("../controllers/comments.Controller");
const { protect } = require("../middleware/protect");
const router = require("express").Router();

router.route("/createComment/:id").post(protect, createComment);
router.route("/:id").get( getComments);
router.route("/:id/editComments").put(protect, editComment);
router.route("/:id/deleteComments").delete(protect, deleteComment);

module.exports = router;
