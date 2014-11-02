var log4js  = require('log4js'),
    morgan  = require('morgan'),
    config  = require('../configuration'),
    logFile = 'logs/' + config.get('logger:filename');

// Log into file by default.
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file(logFile), 'attic');

/**
 * Logger for the application.
 *
 * @type {Object}
 */
var logger = {
  morgan: morgan({
    'format': config.get('logger:format'),
    'stream': {
      write: function(str) { log4js.getLogger('attic').debug(str); }
    }
  }),
  trace: function(str) {
    log4js.getLogger('attic').trace(str);
  },
  debug: function(str) {
    log4js.getLogger('attic').debug(str);
  },
  info: function(str) {
    log4js.getLogger('attic').info(str);
  },
  warn: function(str) {
    log4js.getLogger('attic').warn(str);
  },
  error: function(str) {
    log4js.getLogger('attic').error(str);
  },
  fatal: function(str) {
    log4js.getLogger('attic').fatal(str);
  }
};

module.exports = logger;