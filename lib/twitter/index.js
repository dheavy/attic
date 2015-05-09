var Twit = require('twit'),
    config = require('../configuration'),
    _ = require('lodash');

/**
 * Proxy for Twitter API.
 * @type {Twit}
 */
var api = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


/**
 * Fetch, parse and deliver content from tweets with hashtag "#havaslofts".
 */
var twitter = (function() {

  /**
   * Parse data passed as argument and delivers content in callback.
   *
   * @param  {Object}   data     The payload of tweets.
   * @param  {Function} callback The callback function dealing with results.
   */
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

  /**
   * Fetch tweets marked with hashtag "#havaslofts" using API proxy.
   * If successful, initiate parsing using parseData method.
   *
   * @param  {Function} callback The callback function dealing with results.
   */
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