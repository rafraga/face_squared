var express = require('express');
var router  = express.Router();

var homepage_controller = require('../controllers/homepage_controller');
var isAuthenticated = require("../config/middleware/isAuthenticated");

router.get('/', isAuthenticated, homepage_controller.index);

router.post('/new', isAuthenticated, homepage_controller.createStream);

router.delete('/:id', isAuthenticated,homepage_controller.deleteStream);

module.exports = router;