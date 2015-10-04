var
	apis = {}
	, behaviorStates = {}
	, initializeBehaviorState = function (behaviorName) {
		if (!(behaviorName in behaviorStates)) {
			behaviorStates[behaviorName] = {};
		}
	};

apis.register = function (behaviorName, stateName, behaviorCallback) {
	initializeBehaviorState(behaviorName);
	behaviorStates[behaviorName][stateName] = behaviorCallback;
};

apis.run = function (behaviorName, stateName) {
	var behaviorCallback;
	try {
		behaviorCallback = behaviorStates[behaviorName][stateName];
		behaviorCallback.apply(null, Array.prototype.slice.call(arguments, 2));;
	} catch (err) {
		if (err) {
			console.log(err);
		}
	};
};

module.exports = apis;