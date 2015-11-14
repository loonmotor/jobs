angular
	.module('jobs')
	.factory('pubsub', [function () {
		var
			apis = {}
			, subscribers = {}
			, initializeSubscriber = function (eventName) {
				if (!subscribers[eventName]) {
					subscribers[eventName] = {};
				}
			};

		apis.publish = function (eventName, args) {
			var subscriberCallbacks = [];
			for (var subscriberName in subscribers[eventName]) { // retrieve callbacks as array from object
				subscriberCallbacks.push(subscribers[eventName][subscriberName]);
			}
			async.each(subscriberCallbacks, function (subscriberCallback, done) {
				return subscriberCallback(args, done);
			});
		};

		apis.subscribe = function (eventName, subscriberName, callback) {
			initializeSubscriber(eventName);
			subscribers[eventName][subscriberName] = callback;
		};

		return apis;
	}]);