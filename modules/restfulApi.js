'use strict';

var
	apis = {}
	, resourceConstructors = {}
	, initializeResourceConstructors = function (resourceName) {
		if (!(resourceName in resourceConstructors)) {
			resourceConstructors[resourceName] = function () {

			};
			resourceConstructors[resourceName].prototype.permissions = {};
		}
	};

// API Internal Methods
apis.setResourcePermission = function (resourceName, methodName, permissionCallback) {
	initializeResourceConstructors(resourceName);
	if (!resourceConstructors[resourceName].prototype.permissions[methodName]) {
		resourceConstructors[resourceName].prototype.permissions[methodName] = [];
	}
	resourceConstructors[resourceName].prototype.permissions[methodName].push(permissionCallback);
}

apis.setResourceMethod = function (resourceName, methodName, methodCallback) {
	initializeResourceConstructors(resourceName);
	console.log(methodName);
	resourceConstructors[resourceName].prototype[methodName] = methodCallback;
}

// testing
apis.setResourcePermission('default', 'get', function (req, done) {
	setTimeout(function () {
		console.log('aloha');
		return done();
	}, 500);
});

apis.setResourceMethod('default', 'get', function (resourceName, res) {
	setTimeout(function () {
		console.log('aloha');
		return res.json('bye');
	}, 500);
});

module.exports = apis;