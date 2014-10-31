var twitter = require('../../twitter'),
    config = require('../../configuration');

exports.index = function(req, res) {
  var tweets = null,
      response = res;

  twitter.getTweets(function(err, data) {
    if (err) res.status(400).json('Error: ' + err);
    res.status(200).json(data);
  });
};