
var log4js = require('log4js');

// Bootstrap logger.
if (CONF.log) {
	log4js.configure(CONF.log);
} else {
	// configuring default console only log
	log4js.configure({
		appenders: [
			{type: 'console'}
		]
	})
}
