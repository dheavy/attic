var twitter = require('../../twitter'),
    config = require('../../configuration'),
    sentiment = require('sentiment'),
    _ = require('lodash');

/**
 * Route handler for GET /tweets.
 *
* @param  {http.ServerRequest}  req The request object for the route.
 * @param  {http.ServerResponse} res The response object for this request.
 * @return {http.ServerResponse} The response object with JSON payload containing the data.
 */
exports.index = function(req, res) {
  twitter.getTweets(function(err, data) {
    if (err) res.status(400).json(err);

    var text = '',
        statuses = data.texts,
        analysis = null,
        numOfEntries = data.texts.length,
        average = 0;

    _.each(statuses, function(status) {
      text += status;
    });

    analysis = sentiment(text, config.get('afinn:words'));
    score = analysis.score;
    average = score / numOfEntries;

    res.status(200).json({ analysis: analysis, score: score, numOfEntries: numOfEntries, average: average });
  });
};