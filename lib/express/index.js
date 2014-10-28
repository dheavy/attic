var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    app            = express(),
    config         = require('../configuration'),
    http           = require('http'),
    heartbeat      = require('../routes/heartbeat'),
    logger         = require('../logger');

// Set up logging.
app.use(logger.morgan);

// Parse application/x-www-form-urlencoded, application/json.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Simulate DELETE and PUT.
app.use(methodOverride());

// Routes.
app.get('/heartbeat', heartbeat.index);

// Set server.
app.set('port', config.get('express:port'));
http.createServer(app).listen(app.get('port'));

// Export.
module.exports = app;