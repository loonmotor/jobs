angular
	.module('jobs')
	.factory('config', [function () {
		return {
			'siteName' : 'Jobs',
			'templateUrl' : {
				'loggedInState' : '/template/logged-in-state',
				'profile' : '/template/profile',
				'company' : '/template/company',
				'job' : '/template/job'
			},
			'resourceUrl' : {
				'Profile' : '/data/profile',
				'Company' : '/data/company',
				'Job'     : '/data/job',
				'publicData' : {
					'Job' : '/public/data/job/:offset/:limit'
				}
			}
		};
	}]);