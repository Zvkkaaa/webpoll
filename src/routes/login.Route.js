const router = require("express").Router();
const { Login } = require("../controllers/login.Controller");
const { protect } = require("../middleware/protect");

router.route("/login").post(Login);

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const logCtrl = require("../controllers/login.Controller");

// router.route("/login").post(logCtrl.Login);
