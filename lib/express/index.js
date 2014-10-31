var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    app            = express(),
    config         = require('../configuration'),
    http           = require('http'),
    heartbeat      = require('../routes/heartbeat'),
    tweets         = require('../routes/tweets'),
    logger         = require('../logger'),
    session        = require('express-session');

// Set up logging and sessions.
app.use(logger.morgan);
app.use(session({ secret: 'sssssshhhhhh' }));

// Parse application/x-www-form-urlencoded, application/json.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Simulate DELETE and PUT.
app.use(methodOverride());

// Routes.
app.get('/heartbeat', heartbeat.index);
app.get('/tweets', tweets.index);

// Set server.
app.set('port', config.get('express:port'));
http.createServer(app).listen(app.get('port'));

// Export.
module.exports = app;