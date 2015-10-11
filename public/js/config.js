angular
	.module('jobs')
	.factory('config', [function () {
		return {
			'siteName' : 'Jobs',
			'templateUrl.loggedInState' : '/template/logged-in-state',
			'templateUrl.profile' : '/template/profile',
			'resourceUrl.Profile' : '/data/profile/:id'
		};
	}]);