// const router = require("express").Router();
// const {createUsers} = require("../controllers/users.Controller")
// const {getUsers} = require("../controllers/users.Controller")

// router.route("/create").post(createUsers);
// router.route("/").get(getUsers);

// module.exports = router;

const { protect } = require("../middleware/protect");
const {createUsers} = require("../controllers/users.Controller")
const {getUsers} = require("../controllers/users.Controller")
const router = require("express").Router();


router.route("/createUsers").post(createUsers);
router.route("/getUsers").get(getUsers)

module.exports = router;