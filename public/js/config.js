angular
	.module('jobs')
	.factory('config', [function () {
		return {
			'siteName' : 'Jobs',
			'templateUrl.loggedInState' : '/template/logged-in-state',
			'templateUrl.profile' : '/template/profile',
			'templateUrl.company' : '/template/company',
			'resourceUrl.Profile' : '/data/profile/:id',
			'resourceUrl.Company' : '/data/company/:id'
		};
	}]);