const router = require('express').Router();
const apiKeysController = require('../controllers/apiKeys');

router.route('/:auth').post(apiKeysController.create);

module.exports = router;