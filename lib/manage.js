var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var argv = require('optimist').argv;

var logger = require('log4js').getLogger('webbone.manage');

var command = argv._[0];

if (!command) {
	console.error('No command specified');
	console.error('usage: ' + argv.$0 + ' <command> <command arguments>');
	process.exit(1);
}

try {
	var cmdpaths = CONF.COMMANDS;
	var commands = {};

	_.each(cmdpaths, function (cmdpath) {
		// Load all the commands
		modules = fs.readdirSync(cmdpath).map(function (e) {
			try {
				// We first load the module
				var exports = require('imprimator/commands/' + e);

				// Since the module is a map of { prefix => express app },
				// we mount the app.
				_.each(exports, function (v, k) {
					commands[k] = v;
				})
			} catch (e) {
				// logger.error(e);
				// Say nothing, it's probably a directory anyway.
			}
		});
	});

	commands['runserver'] = require('./runserver').runserver;

	commands[command]();
} catch (e) {
	console.error(e);
	process.exit(1);
}
