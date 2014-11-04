var twitter = require('../../twitter'),
    config = require('../../configuration'),
    ORM = require('../../orm'),
    sentiment = require('sentiment'),
    _ = require('lodash');

/**
 * Route handler for POST /tweets.
 *
 * @param  {http.ServerRequest}  req The request object for the route.
 * @param  {http.ServerResponse} res The response object for this request.
 * @return {http.ServerResponse} The response object with JSON payload containing the data.
 */
exports.index = function(req, res) {
	var model = new ORM(),
			source = config.get('mongo:source:twitter');

	// Check if data in cache is usable or should be busted in favor of a new set.
	model.checkCached(source, function(err, outdated) {
		if (err) {
			res.status(400).json(err);
			return;
		}

		// If cache is outdated, fetch fresh data from Twitter.
		if (outdated === true) {
			twitter.getTweets(function(err, data) {
		    if (err) res.status(400).json(err);

		    // Prepare data.
		    var text = '',
		        statuses = data.texts,
		        analysis = null,
		        numOfEntries = data.texts.length,
		        average = 0;

		    _.each(statuses, function(status) {
		      text += status;
		    });

		    // Parse and finish it.
		    analysis = sentiment(text, config.get('afinn:words'));
		    score = analysis.score;
		    average = analysis.comparative;

		    // Set up payload to save.
		    var payload = {
		    	source: 			source,
		    	analysis: 		analysis,
		    	score: 				score,
		    	numOfEntries: numOfEntries,
		    	average: 			average
		    };

		    model.insert(payload, function(err, data) {
		    	if (err) {
		    		res.status(400).json(err);
		    		return;
		    	} else {
		    		res.status(200).json(data);
		    		return;
		    	}
		    });
		  });
		} else {
			// Otherwise if cache is relevant, return its content.
			model.getCached(source, function(err, data) {
				res.status(200).json(data);
			});
		}
	});
};