const { Login } = require("../controllers/login.Controller");
const { protect} = require("../middleware/protect")

const router = require("express").Router();

router.route("/login").post(Login);

module.exports = router;