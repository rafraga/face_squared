var db  = require('../models');
/*
exports.index = function(req, res) {
  db.Screenshot.findAll({
    where: {
      VideoStreamId: req.user.id
    }
  }).then(function(dbScreenshot) {
    console.log(dbScreenshot);
    res.render('homepage/screenshot, {
      layout: 'main-streams',
      screenshot: dbScreenshot
    });
  });
};
*/
exports.createScreenshot = function(req, res) {
  db.Screenshot.create(req.body).then(function(dbScreen) {
    res.json(dbScreen);
  });
};

