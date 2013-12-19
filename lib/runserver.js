var _ = require('lodash');
var optimist = require('optimist');

exports.runserver = function () {
	var logger = require('log4js').getLogger('webbone.runserver');

	if (!CONF.debug) {
		process.env.NODE_ENV = 'production';
	} else {
		process.env.NODE_ENV = 'development';
	}

	// Load express machinery.
	var express = require('express');

	// We want to be able to use streamline versions of the routes
	var app = express();

	// Activate the zlib compression of our responses.
	app.use(express.compress());

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	// Load views, now that we have the app
	var path = require('path');
	var fs = require('fs');

	_.each(CONF.VIEWS, function (views_dir) {
		// Load all the views
		modules = fs.readdirSync(views_dir).filter(function (e) {
			return e.slice(-3) === '.js';
		}).map(function (e) {
			// We first load the module
			var exports = require(views_dir + '/' + e);

			// Since the module is a map of { prefix => express app },
			// we mount the app.
			_.each(exports, function (v, k) {
				logger.debug('Mounted ' + k + ' from imprimator/views/' + e);
				app.use(k, v);
			})
		});
	});

	// Static views
	// We only use them in debug since apache or nginx is supposed to
	// handle static files a lot better than node.
	if (CONF.dirs && CONF.dirs.static) {
		app.use('/', express.static(CONF.dirs.static));
		logger.debug('Mounted static files on ' + CONF.dirs.static);
	}

	app.listen(CONF.web.port, CONF.web.host, function (err) {
		if (err) {
			logger.fatal('Could not start webserver');
			logger.fatal(err);
			process.exit(1);
		} else {
			logger.info('Webserver started on %s:%d', CONF.web.host, CONF.web.port);
		}
	});
};
