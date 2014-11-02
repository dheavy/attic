var scraper = require('../../scraper');

exports.index = function(req, res) {
  scraper.scrapeMediumArticles(function(err, data) {
    /*if (err) {
      res.status(400).json(err);
    }*/
    res.status(200).json(data);
  });
};