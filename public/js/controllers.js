angular
	.module('jobs')
	.controller('rootCtrl', ['$scope', '$http', 'pubsub', 'config', function ($scope, $http, pubsub, config) {
		$scope.root = {};
		$scope.root.loggedInState = config.loggedInStateUrl;
	}])
	.controller('homeCtrl', ['$scope', '$http', 'pubsub', 'config', function ($scope, $http, pubsub, config) {
		$scope.root.title = 'Jobs';
		$http
			.get('/hei')
			.success(function (data) {
				// console.log(data);
			});

		pubsub.subscribe('ajaxResponse', 'to check authentication state', function (args, done) {
			if (args.error.code == 'notauthenticated') {
				$scope.root.loggedInState = config.loggedInStateUrl + '?time=' + Date.now();
			}
			done();
		});

	}])
	.controller('signinCtrl', ['$scope', '$http', function ($scope, $http) {
		$scope.root.title = 'Sign In';
		$http
			.get('/hei')
			.success(function (data) {
				// console.log(data);
			});

	}]);