const router = require("express").Router();
const dataController = require("../controllers/buildingController");


router
.route("/")
.get(dataController.findAll)
// .put(dataController.update)
// .post(dataController.create);



module.exports = router