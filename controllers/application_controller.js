const isAuth = require("../config/middleware/isAuthenticated");

exports.index = function(req, res) {
  res.render("index");
};

exports.demo = (req, res) => {
  var formats = [];
  var ytdl = require("youtube-dl");
  ytdl.getInfo(
    req.params.tubelink,
    ["--youtube-skip-dash-manifest"],
    (err, info) => {
      if (err)
        return res.render("listvideo", {
          error:
            "The link you provided either not a valid url or it is not acceptable"
        });
      // push all video formats for download (skipping audio)
      info.formats.forEach(function(item) {
        item.format_id == "133" && res.json(item.url);
      });
    }
  );
};
