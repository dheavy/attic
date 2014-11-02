var scraper = require('../../scraper'),
    _ = require('lodash');

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
            res.status(200).json(items);
          }
        }
      });
    });
  });
};