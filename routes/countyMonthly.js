const router = require("express").Router();
const controller = require("../controllers/countyMonthly");

router.route("/").get(controller.findAll).post(controller.insertMany);

module.exports = router;
