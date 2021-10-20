const router = require("express").Router();
const controller = require("../controllers/countyWeekly");

router.route("/").get(controller.findAll).post(controller.insertMany);

module.exports = router;
