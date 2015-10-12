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

		pubsub.subscribe('ajaxResponse', 'to check authentication state', function (args, done) {
			if (args.code == 'notauthenticated'
				|| args.code == 'successSignIn'
				|| args.code == 'successSignUp') {	
			$scope.root.templateUrl.loggedInState = config['templateUrl.loggedInState'] + '?time=' + Date.now();
			}
			done();
		});
	}])
	.controller('signInCtrl', ['$scope', '$http', 'config', 'ngToast', '$location', '$timeout', function ($scope, $http, config, ngToast, $location, $timeout) {
		$scope.root.title = ['Sign In', config.siteName].join(' | ');

		$scope.signIn = function ($event, formData) {
			if ($scope.signInForm.$invalid) {
				$scope.displayValidation = true;
				return;
			}
			$http
				.post('/auth/local-signin', formData)
				.success(function (user) {
					ngToast.success({
						content : 'Sign in is successful'
					});
					ngToast.success({
						content : 'Redirecting...'
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
	.controller('signUpCtrl', ['$scope', '$http', 'config', 'ngToast', '$location', '$timeout', function ($scope, $http, config, ngToast, $location, $timeout) {
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
						content : data.msg
					});
					ngToast.success({
						content : 'Redirecting...'
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
	.controller('profileCtrl', ['$scope', 'config', 'resources', 'ngToast', function ($scope, config, resources, ngToast) {
		$scope.root.title = ['Profile', config.siteName].join(' | ');
		$scope.embeddedJsonData = JSON.parse(document.getElementById('embeddedJsonData').text);
		$scope.profile = $scope.embeddedJsonData.profile;
		$scope.displayValidation = {};

		$scope.saveProfile = function ($event, formData) {
			if ($scope.profileForm.$invalid) {
				$scope.displayValidation.form = true;
				return;
			}
			resources.Profile
				.save(formData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}
		$scope.saveExperience = function ($event, formData) {
			if ($scope.experienceForm.$invalid) {
				$scope.displayValidation.experienceForm = true;
				return;
			}
			resources.Profile
				.save(formData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}

		$scope.saveEducation = function ($event, formData) {
			if ($scope.educationForm.$invalid) {
				$scope.displayValidation.educationForm = true;
				return;
			}
			resources.Profile
				.save(formData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}

		$scope.saveSkill = function ($event, formData) {
			if ($scope.skillForm.$invalid) {
				$scope.displayValidation.skillForm = true;
				return;
			}
		}


	}]);