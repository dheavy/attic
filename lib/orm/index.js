var config = require('../configuration'),
    _ = require('lodash'),
    logger = require('../logger');
    SentimentAnalysisSchema = require('../models').model('SentimentAnalysis');

function SentimentAnalysis() {};

SentimentAnalysis.prototype.insert = function(data, callback) {
  var sa = new SentimentAnalysisSchema(data);
  sa.save(function(err) {
    if (err) {
      callback(err, null);
    } else {
      logger.debug('ORM -- Inserting ' + data.source + ' content into DB.');
      callback(null, data);
    }
  });
};

SentimentAnalysis.prototype.getCached = function(source, callback) {
  SentimentAnalysisSchema.findOne({ source: source }, {}, { sort: { 'created': -1 } }, function(err, analysis) {
    if (err) {
      callback(err, null);
      return;
    }

    if (_.isUndefined(analysis)) {
      callback(null, null);
      return;
    }

    logger.debug('ORM -- Getting ' + source + ' content from cache.');
    callback(null, analysis);
  });
};

SentimentAnalysis.prototype.checkCached = function(source, callback) {
  SentimentAnalysisSchema.findOne({ source: source }, {}, { sort: { 'created': -1 } }, function(err, analysis) {
    if (err) {
      callback(err, null);
    } else {
      if (_.isUndefined(analysis) || _.isNull(analysis)) {
        callback(null, true);
      } else {
        var storedDate = analysis.created,
            now = new Date(),
            dateDiff = now - storedDate,
            ttl = config.get('mongo:ttl');

        if (dateDiff >= ttl) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      }
    }
  });
};

module.exports = SentimentAnalysis;