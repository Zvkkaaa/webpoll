const {
  getPollAttendance, createPollAttendance,getOwnAttendance,updatePollAttendance,
} = require("../controllers/poll_attendance.Controller");
const { protect } = require("../middleware/protect");
const router = require("express").Router();

router.route("/:id").get( /*protect,*/ getPollAttendance);
router.route("/:id/createPollAttendance/:answerid").post(protect,createPollAttendance);
router.route("/:id/getOwnAttendance").get(protect,getOwnAttendance);
router.route("/:id/updatePollAttendance/:answerid").put(protect,updatePollAttendance);
module.exports = router;
