'use strict';

var
	mongojs = require('mongojs')
	, databaseUrl = require('../config')['mongodb.databaseUrl']
	, db = mongojs(databaseUrl, ['User', 'Profile', 'Company', 'Job'])
	, logger = require('../modules/logger');

db.on('error', function (err) {
	logger.error(err);
	console.log(err);
});

db.on('ready', function () {
	console.log('Connected to mongo db');
});

module.exports = db;