angular
	.module('jobs')
	.controller('rootCtrl', ['$scope', '$http', 'pubsub', 'config', '$state', function ($scope, $http, pubsub, config, $state) {
		$scope.root = {};
		$scope.root.templateUrl = {};
		$scope.root.templateUrl.loggedInState = config['templateUrl.loggedInState'];
		$scope.root.templateUrl.profile = config['templateUrl.profile'];
		$scope.root.templateUrl.company = config['templateUrl.company'];
		$scope.$state = $state;
		pubsub.subscribe('ajaxResponse', 'to check authentication state', function (args, done) {
			if (args.code == 'notauthenticated'
				|| args.code == 'successSignIn'
				|| args.code == 'successSignUp') {
			$scope.root.templateUrl.loggedInState = config['templateUrl.loggedInState'] + '?time=' + Date.now();
			}
			done();
		});
	}])
	.controller('homeCtrl', ['$scope', '$http', 'config', function ($scope, $http, config) {
		$scope.root.title = ['Home', config.siteName].join(' | ');

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
					}, 1000);

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
		$scope.toggle = {};

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
			formData.saveExperience = true;
			resources.Profile
				.save(formData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.profile = data.profile;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
			$scope.displayValidation.experienceForm = false;
		}

		$scope.editExperience = function (experience) {
			experience.startDate = new Date(experience.startDate);
			experience.endDate = new Date(experience.endDate);
			var tempExperience = {};
			angular.extend(tempExperience, experience);
			$scope.profile.experience = tempExperience;
		}

		$scope.removeExperience = function (experience) {
			experience.removeExperience = true;
			resources.Profile
				.remove(experience)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.profile = data.profile;
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
			formData.saveEducation = true;
			resources.Profile
				.save(formData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.profile = data.profile;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
			$scope.displayValidation.educationForm = false;
		}

		$scope.editEducation = function (education) {
			education.year = new Date(education.year);
			var tempEducation = {};
			angular.extend(tempEducation, education);
			$scope.profile.education = tempEducation;
		}

		$scope.removeEducation = function (education) {
			education.removeEducation = true;
			resources.Profile
				.remove(education)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.profile = data.profile;
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
			formData.saveSkill = true;
			resources.Profile
				.save(formData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.profile = data.profile;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}

		$scope.editSkill = function (skill) {
			var tempSkill = {};
			angular.extend(tempSkill, skill);
			$scope.profile.skill = tempSkill;
		}

		$scope.removeSkill = function (skill) {
			skill.removeSkill = true;
			resources.Profile
				.remove(skill)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.profile = data.profile;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}


	}])
	.controller('companyCtrl', ['$scope', 'config', 'resources', 'ngToast', function ($scope, config, resources, ngToast) {
		$scope.root.title = ['Company', config.siteName].join(' | ');
		$scope.embeddedJsonData = JSON.parse(document.getElementById('embeddedJsonData').text);
		$scope.companies = $scope.embeddedJsonData.companies;
		$scope.displayValidation = {};
		$scope.toggle = {};

		$scope.saveCompany = function ($event, formData) {
			if ($scope.companyForm.$invalid) {
				$scope.displayValidation.form = true;
				return;
			}
			resources.Company
				.save(formData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.companies = data.companies;
					$scope.company = null;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
			$scope.displayValidation.form = false;
		}

		$scope.editCompany = function (company) {
			var tempCompany = {};
			angular.extend(tempCompany, company);
			$scope.company = tempCompany;
		}

		$scope.removeCompany = function (company) {
			resources.Company
				.remove(company)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.companies = data.companies;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}
	}]);