var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var argv = require('optimist').argv;

// The configuration file is always looked for in the CWD.
var cwd = process.cwd();

var config_path = path.resolve(path.join(cwd, CONF.__CONFIG_FILE_NAME__));

while (cwd !== '/' && !fs.existsSync(config_path)) {
	cwd = path.dirname(cwd);
	config_path = path.resolve(path.join(cwd, CONF.__CONFIG_FILE_NAME__));
}

if (!fs.existsSync(config_path)) {
	console.error('Config file \'' + CONF.__CONFIG_FILE_NAME__ +
		'\' was not in the current directory or any of its parents.');
	process.exit(1);
}

var jsyaml = require('js-yaml');

_.merge(CONF, require(config_path));
CONF.__CURRENT__ = path.dirname(config_path);
CONF.__CONFIG_FILE_PATH__ = config_path;

function confReplace(obj) {
	_.each(obj, function (v, k) {
		if (_.isPlainObject(v)) {
			confReplace(v);
		} else if (_.isString(v)) {
			obj[k] = v.replace(/__\w+__/g, function (match) {
				return CONF[match];
			});
		}
	})
}
confReplace(CONF);

// The user may override configuration options on the command line.
if (argv.conf && _.isPlainObject(argv.conf))
	_.merge(GLOBAL.CONF, argv.conf);
