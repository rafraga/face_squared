var express = require('express');
var router  = express.Router();

var application_controller = require('../controllers/application_controller');

router.get('/', application_controller.index);

router.get('/demo/:tubelink', application_controller.demo);

module.exports = router;