const router = require("express").Router();
const controller = require("../controllers/tractByMonth");

router.route("/").get(controller.findAll).post(controller.insertMany);

module.exports = router;
