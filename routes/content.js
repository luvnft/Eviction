const router = require("express").Router();
const dataController = require("../controllers/contentController");


router
.route("/")
.get(dataController.findAll)
.put(dataController.update)
.post(dataController.create);



module.exports = router