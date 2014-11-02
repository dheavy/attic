var scraper = require('../../scraper'),
    config = require('../../configuration'),
    sentiment = require('sentiment'),
    _ = require('lodash');

var analyze = function(items, res) {
  var text = '', analysis;
  _.each(items, function(item) {
    text += item.link + ' ' + item.description + ' ';
  });

  analysis = sentiment(text, config.get('afinn:words'));
  res.status(200).json(analysis);
}

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