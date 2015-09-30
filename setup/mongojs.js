'use strict';

var
	mongojs = require('mongojs')
	, databaseUrl = require('../config')['mongodb.databaseUrl']
	, db = mongojs(databaseUrl, ['User']);

module.exports = db;