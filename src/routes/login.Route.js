const { Login } = require("../controllers/login.Controller");
const { protect} = require("../middleware/protect")

const router = require("express").Router();
//const router =require
router.route("/login").post(Login);

module.exports = router;