const router = require("express").Router();
const { indexFirstFunc } = require("../controllers/index.Controllers");
router.route("/index").get(indexFirstFunc);

module.exports = router;
