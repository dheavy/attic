var scraper = require('../../scraper'),
    config = require('../../configuration'),
    ORM = require('../../ORM'),
    sentiment = require('sentiment'),
    _ = require('lodash');

function process(source, res, contentAvailable) {
  var model = new ORM();

  // Check if data in cache is usable or should be busted in favor of a new set.
  model.checkCached(source, function(err, outdated) {
    if (err) {
      res.status(400).json(err);
      return;
    }

    // If cache is outdated, fetch fresh data from Medium's RSS feed.
    if (outdated === true) {
      scraper.scrapeMediumArticles(function(err, items) {
        if (err) res.status(400).json(err);

        var len = items.length,
            count = 0;

        // Get data from feed then use link to crawl out to the content of each article.
        _.each(items, function(item) {
          if (!contentAvailable) {
            scraper.scrapeContentFromLink(item.link, function(err, content) {
              if (content != null) {
                count++;
                item.body = content;
                if (count === len) {
                  analyze(items, model, res);
                }
              }
            });
          } else {

          }
        });
      });
    } else {
      // Otherwise if cache is relevant, return its content.
      model.getCached(source, function(err, data) {
        res.status(200).json(data);
      });
    }
  });
}

/**
 * Merge all texts from RSS items into one big corpus,
 * analyze it, inject results in returned response object.
 *
 * @param  {array}                items Array of items parsed from Scraper.
 * @param  {ORM}                  model The instance of ORM module to communicate with DB.
 * @param  {http.ServerResponse}  res   The response object for this request.
 * @return {http.ServerResponse}  The response object with JSON payload containing the data.
 */
function analyze(items, model, res) {
  var text = '',
      numOfEntries = items.length,
      score = 0,
      average = 0,
      analysis = null;

  // Prepare data.
  _.each(items, function(item) {
    text += item.link + ' ' + item.description + ' ';
  });

  analysis = sentiment(text, config.get('afinn:words'));
  score = analysis.score;
  average = score / numOfEntries;

  // Set up payload.
  var payload = {
    source:       config.get('mongo:source:medium'),
    analysis:     analysis,
    score:        score,
    numOfEntries: numOfEntries,
    average:      average
  };

  // Save to DB.
  model.insert(payload, function(err, data) {
    if (err) {
      res.status(400).json(err);
      return;
    } else {
      res.status(200).json(data);
      return;
    }
  });
}

/**
 * Route handler for POST /scrape.
 *
 * @param  {http.ServerRequest}  req The request object for the route.
 * @param  {http.ServerResponse} res The response object for this request.
 * @return {http.ServerResponse} The response object with JSON payload containing the data.
 */
exports.medium = function(req, res) {
  process(config.get('mongo:source:medium'), res, false);
};