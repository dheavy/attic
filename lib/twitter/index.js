var Twit = require('twit'),
    config = require('../configuration'),
    _ = require('lodash');

var api = new Twit({
  consumer_key: config.get('twitter:key'),
  consumer_secret: config.get('twitter:secret'),
  access_token: config.get('twitter:token'),
  access_token_secret: config.get('twitter:tokenSecret')
});


var twitter = (function() {

  var parseData = function(data, callback) {
    var texts = [],
        locations = [],
        media = [],
        statuses = data.statuses;

    _.each(statuses, function(status) {
      texts.push(status.text);
      locations.push(status.geo);

      var mediaObject = status.entities.media;
      _.each(mediaObject, function(m) {
        media.push(m.media_url);
      });
    });

    callback(null, { texts: texts, locations: locations, media: media });
  };

  var getTweets = function(callback) {
    api.get('search/tweets', { q: config.get('twitter:search:q') }, function(err, data) {
      if (err) {
        console.log('Error: ' + err);
        callback(err, null);
      }

      parseData(data, callback);
    });
  };

  return {
    getTweets: getTweets
  }

}());

module.exports = twitter;