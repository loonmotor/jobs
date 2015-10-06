angular
	.module('jobs')
	.controller('rootCtrl', ['$scope', '$http', 'pubsub', 'config', '$state', function ($scope, $http, pubsub, config, $state) {
		$scope.root = {};
		$scope.root.loggedInState = config.loggedInStateUrl;
		$scope.$state = $state;
	}])
	.controller('homeCtrl', ['$scope', '$http', 'pubsub', 'config', function ($scope, $http, pubsub, config) {
		$scope.root.title = ['Home', config.siteName].join(' | ');
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
	.controller('signInCtrl', ['$scope', '$http', 'config', function ($scope, $http, config) {
		$scope.root.title = ['Sign In', config.siteName].join(' | ');
		$http
			.get('/hei')
			.success(function (data) {
				// console.log(data);
			});

	}])
	.controller('signUpCtrl', ['$scope', '$http', 'config', function ($scope, $http, config) {
		$scope.root.title = ['Sign Up', config.siteName].join(' | ');
	}]);