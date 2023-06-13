const {
  getPollAttendance,
} = require("../controllers/poll_attendance.Controller");
const { protect } = require("../middleware/protect");
const router = require("express").Router();

router.route("/").post(protect, getPollAttendance);

module.exports = router;
