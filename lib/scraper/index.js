var FeedParser = require('feedparser'),
    request = require('request'),
    logger = require('../logger'),
    config = require('../configuration'),
    cheerio = require('cheerio'),
    articles = [];

/**
 * Scraper crawling, parsing and delivering content from blog posts on Medium.
 */
var scraper = (function() {

  /**
   * Follow link passed as argument and crawl through content
   * to extract and deliver the body of the article.
   *
   * @param  {string}   link     The URI to crawl through.
   * @param  {Function} callback The callback function dealing with results.
   */
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

  /**
   * [scrapeMediumArticles description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
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