var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    app            = express(),
    path           = require('path')
    config         = require('../configuration'),
    http           = require('http'),
    favicon        = require('serve-favicon'),
    heartbeat      = require('../routes/heartbeat'),
    tweets         = require('../routes/tweets'),
    scrape         = require('../routes/scrape'),
    attic          = require('../routes/attic'),
    logger         = require('../logger'),
    errorHandler   = require('errorhandler'),
    db             = require('../database');

// Set up logging and sessions.
app.use(logger.morgan);

// Parse application/x-www-form-urlencoded, application/json.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Simulate DELETE and PUT.
app.use(methodOverride());

// Views rendering.
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(express.static('public/components'));
app.use(express.static('public/favicons'));
app.use(favicon('public/favicons/favicon.ico'));

// Routes.
app.get('/', attic.index);
app.get('/heartbeat', heartbeat.index);
app.post('/tweets', tweets.index);
app.post('/medium', scrape.medium);
//app.post('/gauloise', scrape.gauloise);

if (app.get('env') === 'development') {
  app.use(errorHandler());
}

// Set server.
if (app.get('env') === 'production') {
  app.set('port', process.env.PORT);
} else {
  app.set('port', config.get('express:port'));
}
http.createServer(app).listen(app.get('port'));

// Export.
module.exports = app;