
module.exports = function (options) {
	if (!options.config_file_name) {
		console.error('No config_file_name supplied for the configuration file, exiting now');
		process.exit(1);
	}

	if (!options.code_root) {
		console.error('No code_root supplied, exiting now.');
		process.exit(1);
	}

	GLOBAL.CONF = {
		__CONFIG_FILE_NAME__: options.config_file_name,
		__CODE__: options.code_root,
		COMMANDS: options.commands,
		VIEWS: options.views
	};

	require('./lib/config');
	require('./lib/logging');

	var logger = require('log4js').getLogger('webbone');
	logger.debug('Using configuration file ' + CONF.__CONFIG_FILE_PATH__);

	require('./lib/manage');
};
