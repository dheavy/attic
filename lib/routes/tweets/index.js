var twitter = require('../twitter'),
    config = require('../configuration');

var getTweets = function(accessToken, accessTokenSecret) {
  twitter.statuses('filter', {
    track: config.get('twitter:statuses:track');
  },
    accessToken,
    accessTokenSecret,);
};

exports.index = function(req, res) {
  var session = req.session;
  if (session.accessToken && session.accessTokenSecret) {

  } else {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
      if (error) {
        console.log('Error getting OAuth request token: ' + error);
      } else {

      }
    });
  }
};