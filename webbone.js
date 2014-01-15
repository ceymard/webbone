var _ = require('lodash');
var logger = null;

function Config(data) {
	_.merge(this, data);
}

Config.prototype = {

	get: function (path, default_value) {
		var paths = path.split('.');
		var value = this;
		var i = 0;

		for (i = 0; i < paths.length; i++) {
			if (value[paths[i]] !== undefined)
				value = this[paths[i]];
			else
				return default_value;
		}

		return value;
	},

	mandatory: function (path) {
		var res = this.get(path);
		if (res === undefined) {
			logger.fatal('Configuration option ' + path + ' is mandatory in the configuration file.');
			process.exit(1);
		}
		return res;
	}

}

module.exports = function (options) {
	if (!options.config_file_name) {
		console.error('No config_file_name supplied for the configuration file, exiting now');
		process.exit(1);
	}

	if (!options.code_root) {
		console.error('No code_root supplied, exiting now.');
		process.exit(1);
	}

	GLOBAL.CONF = new Config({
		__CONFIG_FILE_NAME__: options.config_file_name,
		__CODE__: options.code_root,
		COMMANDS: options.commands,
		VIEWS: options.views
	});

	require('./lib/config');
	require('./lib/logging');

	logger = require('log4js').getLogger('webbone');
	logger.debug('Using configuration file ' + CONF.__CONFIG_FILE_PATH__);

	require('./lib/manage');
};
