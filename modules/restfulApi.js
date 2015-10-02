'use strict';

// Variables, Dependencies and Helper Functions
var
	apis = {} // to wrap all exposable apis of this module
	, resources = {} // to store each resource and its restful implementations
	, initializeResource = function (resourceName) { // to make sure resource exists before writing to it
		if (!(resourceName in resources)) {
			resources[resourceName] = {};
			resources[resourceName].permissions = {};
		}
	}
	, async = require('async');

// API Internal Methods
apis.setResourcePermission = function (resourceName, methodName, permissionCallback) {
	initializeResource(resourceName);
	if (!resources[resourceName].permissions[methodName]) {
		resources[resourceName].permissions[methodName] = [];
	}
	resources[resourceName].permissions[methodName].push(permissionCallback);
};

apis.setResourceMethod = function (resourceName, methodName, methodCallback) {
	initializeResource(resourceName);
	resources[resourceName][methodName] = methodCallback;
};

// API External Methods
apis.restful = function (resourceName, callback) {
	return function (req, res, next) {
		var permissions = []; // fallback permissions
		try {
			permissions = resources[resourceName].permissions[req.method]; // try to get permissions for that resource and method
		} catch (err) {
			permissions = resources['default'].permissions[req.method]; // when failed, use default permissions
		}
		async.each(permissions, function (permission, done) { // run permission check
			return permission(req, done);
		}, function (err, result) {
			if (err) {
				return callback(err, res);
			}
			var resourceMethod; // fallback resource method
			try {
				resourceMethod = resources[resourceName][req.method]; // try to get resource method for that HTTP method
			} catch (err) {
				resourceMethod = resources['default'][req.method]; // when failed, use default resource method for that HTTP method
			}
			resourceMethod(resourceName, res, next);
		});
	}
};

module.exports = apis;