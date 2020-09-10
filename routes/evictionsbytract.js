const router = require("express").Router();
const evictionDataController = require("../controllers/evictionDataController");


router
.route("/")
.get(evictionDataController.findAll)
.put(evictionDataController.update)
.post(evictionDataController.create);



module.exports = router