const router = require('express').Router();
const tractDailyController = require('../controllers/tractDaily');

router.route('/').get(tractDailyController.find);
// .put(tractDailyController.update)
// .post(tractDailyController.create);

module.exports = router;
