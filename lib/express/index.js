var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    app            = express(),
    config         = require('../configuration'),
    http           = require('http'),
    heartbeat      = require('../routes/heartbeat'),
    tweets         = require('../routes/tweets'),
    scrape         = require('../routes/scrape'),
    attic          = require('../routes/attic'),
    logger         = require('../logger'),
    session        = require('express-session'),
    db             = require('../database');

// Set up logging and sessions.
app.use(logger.morgan);
app.use(session({ secret: 'sssssshhhhhh' }));

// Parse application/x-www-form-urlencoded, application/json.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Simulate DELETE and PUT.
app.use(methodOverride());

// Routes.
app.get('/heartbeat', heartbeat.index);
app.get('/', attic.index);
app.post('/tweets', tweets.index);
app.post('/medium', scrape.medium);
//app.post('/gauloise', scrape.gauloise);

// Set server.
app.set('port', config.get('express:port'));
http.createServer(app).listen(app.get('port'));

// Export.
module.exports = app;