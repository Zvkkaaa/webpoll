const { getPollAttendance } = require("../controllers/poll_attendance.Controllers");
const { protect} = require("../middleware/protect")
const router = require("express").Router();

router.route("/").post(getPollAttendance);

module.exports = router;