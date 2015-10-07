angular
	.module('jobs')
	.controller('rootCtrl', ['$scope', '$http', 'pubsub', 'config', '$state', function ($scope, $http, pubsub, config, $state) {
		$scope.root = {};
		$scope.root.templateUrl = {};
		$scope.root.templateUrl.loggedInState = config['templateUrl.loggedInState'];
		$scope.root.templateUrl.profile = config['templateUrl.profile'];
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
			if (args.code == 'notauthenticated'
				|| args.code == 'successSignIn'
				|| args.code == 'successSignUp') {
				$scope.root.loggedInState = config['templateUrl.loggedInState'] + '?time=' + Date.now();
			}
			done();
		});
	}])
	.controller('signInCtrl', ['$scope', '$http', 'config', 'ngToast', '$location', '$timeout', 'pubsub', function ($scope, $http, config, ngToast, $location, $timeout, pubsub) {
		$scope.root.title = ['Sign In', config.siteName].join(' | ');
		$http
			.get('/hei')
			.success(function (data) {
				// console.log(data);
			});
		$scope.signIn = function ($event, formData) {
			if ($scope.signInForm.$invalid) {
				$scope.displayValidation = true;
				return;
			}
			$http
				.post('/auth/local-signin', formData)
				.success(function (user) {
					ngToast.success({
						content : 'Sign in is successful',
						timeout : 3000
					});
					ngToast.success({
						content : 'Redirecting...',
						timeout : 3000
					});
					$timeout(function () {
						$location.path('/');
					}, 3000);

				})
				.error(function (err) {
					ngToast.danger({
						content : err.msg,
					});
				});
		}
	}])
	.controller('signUpCtrl', ['$scope', '$http', 'config', 'ngToast', '$location', 'pubsub', '$timeout', function ($scope, $http, config, ngToast, $location, pubsub, $timeout) {
		$scope.root.title = ['Sign Up', config.siteName].join(' | ');
		$scope.signUp = function ($event, formData) {
			if ($scope.signUpForm.$invalid) {
				$scope.displayValidation = true;
				return;
			}
			$http
				.post('/auth/local-signup', formData)
				.success(function (data) {
					ngToast.success({
						content : data.msg,
						timeout : 3000
					});
					ngToast.success({
						content : 'Redirecting...',
						timeout : 3000
					});
					$timeout(function () {
						$location.path('/');
					}, 3000);

				})
				.error(function (err) {
					ngToast.danger({
						content : err.msg,
					});
				});
		}
	}])
	.controller('profileCtrl', ['$scope', function ($scope) {
		$scope.embeddedJsonData = JSON.parse(document.getElementById('embeddedJsonData').text);

		$scope.profile = function ($event, formData) {
			if ($scope.profileForm.$invalid) {
				$scope.displayValidation = true;
				return;
			}
		}
	}]);