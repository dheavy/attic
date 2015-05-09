var mongoose = require('mongoose'),
    config = require('../configuration'),
    connectionString = process.env.MONGOSOUP_URL,
    options = { server: { auto_reconnect: true, poolSize: 10 } };

mongoose.connection.open(connectionString, options);