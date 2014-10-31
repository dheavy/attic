var TwitterAPI = require('node-twitter-api'),
    config = require('../configuration'),
    app = require('../express');

var twitter = new TwitterAPI({
  consumerKey: config.get('twitter:key'),
  consumerSecret: config.get('twitter:secret')
});

module.exports = twitter;