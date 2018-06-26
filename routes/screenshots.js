var express = require('express');
var router  = express.Router();

var screenshots_controller = require('../controllers/screenshots_controller');

//router.get('/', screenshots_controller.index);

router.post('/new', screenshots_controller.createScreenshot);

module.exports = router;