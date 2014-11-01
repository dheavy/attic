var twitter = require('../../twitter'),
    config = require('../../configuration'),
    sentiment = require('sentiment'),
    _ = require('lodash');

exports.index = function(req, res) {
  twitter.getTweets(function(err, data) {
    if (err) res.status(400).json('Error: ' + err);

    var texts = data.texts,
        sentiments = [];

    // Analyze tweets. Override sentiment score of
    // words spotted with wrong value.
    _.each(texts, function(text) {
      var analysis = sentiment(text, config.get('afinn:words'));
      if (analysis.score != 0) {
        sentiments.push(analysis);
      }
    });

    res.status(200).json(sentiments);
  });
};