angular
	.module('jobs')
	.factory('config', [function () {
		return {
			'siteName' : 'Jobs',
			'loggedInStateUrl' : '/template/logged-in-state'
		};
	}]);