var scraper = require('../../scraper'),
    config = require('../../configuration'),
    sentiment = require('sentiment'),
    _ = require('lodash');

/**
 * Merge all texts from RSS items into one big corpus,
 * analyze it, inject results in returned response object.
 *
 * @param  {array}                items Array of items parsed from Scraper.
 * @param  {http.ServerResponse}  res   The response object for this request.
 * @return {http.ServerResponse}  The response object with JSON payload containing the data.
 */
var analyze = function(items, res) {
  var text = '',
      numOfEntries = items.length,
      score = 0,
      average = 0,
      analysis = null;

  _.each(items, function(item) {
    text += item.link + ' ' + item.description + ' ';
  });

  analysis = sentiment(text, config.get('afinn:words'));
  score = analysis.score;
  average = score / numOfEntries;

  res.status(200).json({ analysis: analysis, score: score, numOfEntries: numOfEntries, average: average });
}

/**
 * Route handler for POST /scrape.
 *
 * @param  {http.ServerRequest}  req The request object for the route.
 * @param  {http.ServerResponse} res The response object for this request.
 * @return {http.ServerResponse} The response object with JSON payload containing the data.
 */
exports.index = function(req, res) {
  scraper.scrapeMediumArticles(function(err, items) {
    if (err) res.status(400).json(err);

    var len = items.length,
        count = 0;

    _.each(items, function(item) {
      scraper.scrapeContentFromLink(item.link, function(err, content) {
        if (content != null) {
          count++;
          item.body = content;
          if (count === len) {
            analyze(items, res);
          }
        }
      });
    });
  });
};