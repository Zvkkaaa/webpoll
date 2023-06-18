const {
  getPollAttendance, createPollAttendance,
} = require("../controllers/poll_attendance.Controller");
const { protect } = require("../middleware/protect");
const router = require("express").Router();

router.route("/:id").get(protect, getPollAttendance);
router.route("/:id/createPollAttendance/:answerid").post(protect,createPollAttendance);
module.exports = router;
