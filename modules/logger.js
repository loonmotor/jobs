'use strict';

var
	winston   = require('winston')
	, logPath = require('../config').logPath
	, logFile = require('../config').logFile
	, path    = require('path')
	, fs      = require('fs')
	, logger  = new winston.Logger({
		transports : [
			new winston.transports.File({
				level : 'debug',
				filename : path.join(__dirname, '../', logPath, logFile),
				json : false,
				timestamp : function () {
					return new Date().toLocaleString();
				}
			}),
			new winston.transports.Console({
				level : 'debug',
				colorize : true
			})
		]
	});

if (!fs.existsSync(path.join(__dirname, '../', logPath))) { // check and create new logs directory
	fs.mkdirSync(path.join(__dirname, '../', logPath));
}

module.exports = logger;
