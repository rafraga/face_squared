var db = require('../models');

exports.index = function (req, res) {
  db.Video_Stream.findAll({
    include: [db.Screenshot],
    where: {
      UserId: req.user.id
    }
  }).then(function (dbStream) {
    console.log(dbStream);
    res.render('homepage/homepage', {
      layout: 'main-streams',
      stream: dbStream,
      helpers: {
        filterScreenshots: function (screenshots,title) {
          var filtered=[];
          for (let i = 0; i < screenshots.length; i++) {
            const element = screenshots[i];
            if(element.streamTitle==title){
              filtered.push(element);
            }
          }
          return filtered;
        }
      }
    });
  });
};

exports.createStream = function (req, res) {

  console.log(req.user);
  // Add id from User onto req.body
  req.body.UserId = req.user.id;

  db.Video_Stream.create(req.body, {
    include: [db.Screenshot]
  }).then(function (dbStream) {
    res.json(dbStream);
  });
};

exports.deleteStream = function(req, res) {
  db.Video_Stream.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(dbPost) {
    res.json(dbPost);
  });
}
