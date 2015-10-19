'use strict';

// Variables, Dependencies and Helper Functions
var
	apis = {} // to wrap all exposable apis of this module
	, middlewares = {} // to store middlewares for each type of resource
	, initializeResource = function (resourceName, methodName) { // to make sure resource exists before writing to it
		if (!(resourceName in middlewares)) {
			middlewares[resourceName] = {};
		}
		if (!(methodName in middlewares[resourceName])) {
			middlewares[resourceName][methodName] = [];
		}
	}
	, async = require('async');

apis.use = function (resourceName, methodName, methodCallback) {
	initializeResource(resourceName, methodName);
	middlewares[resourceName][methodName].push(methodCallback);
};

// API External Methods
apis.restful = function (resourceName) {
	return function (req, res, next) {
		var resourceMiddlewares;
		try {
			resourceMiddlewares = middlewares[resourceName][req.method]; // try to get middlewares for that resource and HTTP method
		} catch (err) {
			next(err);
		};
		async.eachSeries(resourceMiddlewares, function (resourceMiddleware, done) { // run permission check
			resourceMiddleware(resourceName, req, res, done);
		}, function (err) {
			if (err === 'stopAsync') {
				return;
			}
			if (err) {
				return res.status(500).json(err);
			}
		});
	}
};

module.exports = apis;