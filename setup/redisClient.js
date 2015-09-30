var
	redisClient = require('redis').createClient()
	, logger = require('../modules/logger');

redisClient.on('ready', function () { 
	console.log('Redis is ready') 
});

redisClient.on('error', function () {
	logger.error('Failed to connect to redis');
	console.log('Failed to connect to Redis');
});

module.exports = redisClient;