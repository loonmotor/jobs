'use strict';

var
	mongojs = require('mongojs')
	, databaseUrl = require('../config').databaseUrl
	, db = mongojs(databaseUrl, ['User']);

module.exports = db;