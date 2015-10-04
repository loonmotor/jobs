var
	apis = {}
	, states = {}
	, initializeState = function (stateName) {
		if (!(stateName in states)) {
			states[stateName] = {};
		}
	};





module.exports = apis;