const router = require('express').Router();
const casesController = require('../controllers/cases');

router.route('/').get(casesController.find);
// .put(tractDailyController.update)
// .post(tractDailyController.create);

module.exports = router;
