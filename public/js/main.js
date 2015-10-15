angular
	.module('jobs', ['ui.router', 'ui.bootstrap', 'ngToast', 'ngMessages', 'ngResource', 'ngTagsInput'])
	.config(['$urlRouterProvider', '$stateProvider', 'ngToastProvider', function ($urlRouterProvider, $stateProvider, ngToastProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url : '/',
				views : {
					'main' : {
						templateUrl : '/html/home.html',
						controller : 'homeCtrl'
					}
				}
			})
			.state('rootSignIn', {
				url : '/sign-in',
				views : {
					'main' : {
						templateUrl : '/html/root-sign-in.html'
					}
				}
			})
			.state('rootSignIn.signIn', {
				url : '/',
				views : {
					'main' : {
						templateUrl : '/html/sign-in-form.html',
						controller  : 'signInCtrl'
					}
				}
			})
			.state('rootSignIn.signUp', {
				url : '/sign-up',
				views : {
					'main' : {
						templateUrl : '/html/sign-up-form.html',
						controller  : 'signUpCtrl'
					}
				}
			})
			.state('rootControl', {
				url : '/control',
				views : {
					'main' : {
						templateUrl : '/html/root-control.html'
					}
				}
			})
			.state('rootControl.profile', {
				url : '/profile',
				views : {
					'main' : {
						templateUrl : '/html/profile.html'
					}
				}
			})
			.state('rootControl.company', {
				url : '/company',
				views : {
					'main' : {
						templateUrl : '/html/company.html'
					}
				}
			})
			.state('rootControl.job', {
				url : '/job',
				views : {
					'main' : {
						templateUrl : '/html/job.html'
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
					pubsub.publish('ajaxResponse', data);
			}
			return data;
		});
	}]);