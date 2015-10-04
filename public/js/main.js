angular
	.module('jobs', ['ui.router', 'ui.bootstrap'])
	.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider) {

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
			.state('signin', {
				url : '/signin',
				views : {
					'main' : {
						templateUrl : '/html/signin.html',
						controller  : 'signinCtrl'
					}
				}
			});

	}])
	.run(['$http', '$rootScope', 'pubsub', function ($http, $rootScope, pubsub) {
		$http.defaults.transformResponse.push(function (data, headers) {
			if (headers('content-type') &&
				headers('content-type').indexOf('application/json') > -1) {
				if (data.error) {
					pubsub.publish('ajaxResponse', data);
				}
			}
			return data;
		});
	}]);