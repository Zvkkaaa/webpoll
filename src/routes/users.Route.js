// const router = require("express").Router();
// const {createUsers} = require("../controllers/users.Controller")
// const {getUsers} = require("../controllers/users.Controller")

// router.route("/create").post(createUsers);
// router.route("/").get(getUsers);

// module.exports = router;

const { protect } = require("../middleware/protect");
const { createUser } = require("../controllers/users.Controller");
const { getUsers } = require("../controllers/users.Controller");
const { getUsername } = require("../controllers/users.Controller");
const router = require("express").Router();
//const {getoneUser} = require("../controllers/users.Controller/")
router.route("/createUser").post(createUser);
router.route("/getUsers").get(getUsers);
//router.route("/getuser").get(getoneUser);
router.route("/:id/getUsername").get(getUsername);
module.exports = router;
