angular
	.module('jobs', ['ui.router'])
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

	}]);