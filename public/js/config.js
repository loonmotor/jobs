angular
	.module('jobs')
	.factory('config', [function () {
		return {
			'loggedInStateUrl' : '/template/logged-in-state'
		};
	}]);