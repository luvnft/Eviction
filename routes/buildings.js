const router = require("express").Router();
const buildingController = require("../controllers/buildingController");


router
    .route("/")
    .get(buildingController.find);
// .put(buildingController.update)
// .post(buildingController.create);



module.exports = router;