angular
	.module('jobs')
	.factory('config', [function () {
		return {
			'siteName' : 'Jobs',
			'templateUrl' : {
				'loggedInState' : '/template/logged-in-state',
				'profile' : '/template/profile',
				'company' : '/template/company',
				'jobForm' : '/template/job-form',
				'home' : '/template/home'
			},
			'resourceUrl' : {
				'Profile' : '/data/profile',
				'Company' : '/data/company',
				'Job'     : '/data/job',
				'publicData' : {
					'Jobs' : '/public/data/jobs/:offset/:limit',
					'Job'  : '/public/data/job/:id',
					'Company' : '/public/data/company/:id',
					'CompanyJobs' : '/public/data/company/jobs/:id'
				}
			},
			'localSignInRedirect' : '/'
		};
	}]);