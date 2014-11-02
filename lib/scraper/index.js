var FeedParser = require('feedparser'),
    request = require('request'),
    logger = require('../logger'),
    config = require('../configuration'),
    cheerio = require('cheerio'),
    feedMeta = null,
    articles = [];

var scraper = (function() {

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
              console.log(description);

          var article = { title: item.title, description: description };
          articles.push(article);
        }
      }).on('end', function() {
        callback(null, articles);
      });
  }

  return {
    scrapeMediumArticles: scrapeMediumArticles
  }

}());

module.exports = scraper;