angular
	.module('jobs', ['ui.router', 'ui.bootstrap', 'ngToast', 'ngMessages', 'ngResource', 'ngTagsInput'])
	.config(['$urlRouterProvider', '$stateProvider', 'ngToastProvider', function ($urlRouterProvider, $stateProvider, ngToastProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url : '/',
				views : {
					'main' : {
						templateUrl : 'html/home.html',
						controller : 'homeCtrl'
					}
				}
			})
			.state('rootSignIn', {
				url : '/sign-in',
				views : {
					'main' : {
						templateUrl : 'html/root-sign-in.html'
					}
				}
			})
			.state('rootSignIn.signIn', {
				url : '/',
				views : {
					'main' : {
						templateUrl : 'html/sign-in-form.html',
						controller  : 'signInCtrl'
					}
				}
			})
			.state('rootSignIn.signUp', {
				url : '/sign-up',
				views : {
					'main' : {
						templateUrl : 'html/sign-up-form.html',
						controller  : 'signUpCtrl'
					}
				}
			})
			.state('rootControl', {
				url : '/control',
				views : {
					'main' : {
						templateUrl : 'html/root-control.html'
					}
				}
			})
			.state('rootControl.profile', {
				url : '/profile',
				views : {
					'main' : {
						templateUrl : 'html/profile.html'
					}
				}
			})
			.state('rootControl.company', {
				url : '/company',
				views : {
					'main' : {
						templateUrl : 'html/company.html'
					}
				}
			})
			.state('rootControl.job', {
				url : '/job-form',
				views : {
					'main' : {
						templateUrl : 'html/job-form.html'
					}
				}
			})
			.state('rootControl.interest', {
				url : '/interest',
				views : {
					'main' : {
						templateUrl : 'html/interest.html',
						controller  : 'interestCtrl'
					}
				}
			})
			.state('rootControl.archivedJobs', {
				url : '/archived-jobs',
				views : {
					'main' : {
						templateUrl : 'html/archived-jobs.html',
						controller  : 'archivedJobsCtrl'
					}
				}
			})
			.state('guide', {
				url : '/guide',
				views : {
					'main' : {
						templateUrl : 'html/guide.html',
						controller  : 'guideCtrl'
					}
				}
			})
			.state('jobView', {
				url : '/job-view/:id',
				views : {
					'main' : {
						templateUrl : 'html/job-view.html',
						controller  : 'jobViewCtrl'
					}
				}
			})
			.state('companyView', {
				url : '/company-view/:id',
				views : {
					'main' : {
						templateUrl : 'html/company-view.html',
						controller : 'companyViewCtrl'
					}
				}
			})
			.state('profileView', {
				url : '/profile-view/:id',
				views : {
					'main' : {
						templateUrl : 'html/profile-view.html',
						controller 	: 'profileViewCtrl'
					}
				}
			})
			.state('signOut', {
				url : '/sign-out',
				views : {
					'main' : {
						templateUrl : 'html/sign-out.html',
						controller : 'signOutCtrl'
					}
				}
			})
			.state('search', {
				url : '/search/:id',
				views : {
					'main' : {
						templateUrl : 'html/search.html',
						controller : 'searchCtrl'
					}
				}
			});

		ngToastProvider.configure({
			dismissButton : true,
			timeout : 3000
		});

	}])
	.run(['$http', '$rootScope', 'pubsub', function ($http, $rootScope, pubsub) {
		$http.defaults.transformResponse.push(function (data, headers) {
			if (headers('content-type') &&
				headers('content-type').indexOf('application/json') > -1) {
					if (typeof data !== 'object') {
						data = JSON.parse(data);
					}
					pubsub.publish('ajaxResponse', data);
			}
			return data;
		});
	}]);