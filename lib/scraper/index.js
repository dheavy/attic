var FeedParser = require('feedparser'),
    request = require('request'),
    logger = require('../logger'),
    config = require('../configuration'),
    cheerio = require('cheerio'),
    feedMeta = null,
    articles = [],
    streamEnded = false,
    allItemsParsed = false;

var scraper = (function() {

  var scrapeContentFromLink = function(link, callback) {
    request(link, function(err, res, body) {
      if (!err && res.statusCode == 200) {
        var $rawBody = cheerio.load(body);
        content = $rawBody('.section-content p').text();
        callback(null, content);
      }
      callback(err, null);
    });
  };

  var scrapeMediumArticles = function(callback) {
    request(config.get('medium:rss')).pipe(
        new FeedParser({})
      ).on('error', function(err) {
        logger.error(err);
        callback(err, null);
      }).on('readable', function() {
        var stream = this, item;
        while(item = stream.read()) {
          var $rawDescription = cheerio.load(item.description),
              description = $rawDescription('.medium-feed-snippet').text();

          var article = { title: item.title, link: item.link, description: description };
          articles.push(article);
        }
      }).on('end', function() {
        callback(null, articles);
      });
  }

  return {
    scrapeMediumArticles: scrapeMediumArticles,
    scrapeContentFromLink: scrapeContentFromLink
  }

}());

module.exports = scraper;