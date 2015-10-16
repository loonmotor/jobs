angular
	.module('jobs')
	.factory('config', [function () {
		return {
			'siteName' : 'Jobs',
			'templateUrl' : {
				'loggedInState' : '/template/logged-in-state',
				'profile' : '/template/profile',
				'company' : '/template/job',
				'job' : '/template/job'
			},
			'resourceUrl' : {
				'Profile' : '/data/profile/:id',
				'Company' : '/data/company/:id',
				'Job'     : '/data/job/:id'
			}
		};
	}]);