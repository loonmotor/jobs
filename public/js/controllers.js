angular
	.module('jobs')
	.controller('rootCtrl', ['$scope', '$http', 'pubsub', 'config', '$state', 'ngToast', '$sce', function ($scope, $http, pubsub, config, $state, ngToast, $sce) {
		$scope.root = {};
		$scope.root.templateUrl = config['templateUrl'];
		$scope.$state = $state;
		pubsub.subscribe('ajaxResponse', 'to check authentication state', function (args, done) {
			if (args
				&& (args.code == 'notauthenticated'
				|| args.code == 'successSignIn'
				|| args.code == 'successSignUp')) {
				$scope.root.templateUrl.loggedInState = $scope.root.templateUrl.loggedInState + '?time=' + Date.now();
			}
			if (args.code == 'notauthenticated') {
				ngToast.info({
					content : $sce.trustAsHtml('<a ui-sref="rootSignIn.signIn">Please sign in</a>'),
					compileContent : true
				});
			}
			done();
		});
		$scope.getImage = function (imageSrc) {
			if (!imageSrc) {
				return '//:0';
			}
			return imageSrc;
		}
	}])
	.controller('homeCtrl', ['$scope', 'resources', 'config', 'ngToast', '$sce', function ($scope, resources, config, ngToast, $sce) {
		$scope.root.title = ['Home', config.siteName].join(' | ');

		$scope.getListing = function (offset, limit) {
			resources.publicData.Jobs
				.get({ offset : offset, limit : limit })
				.$promise
				.then(function (data) {
					$scope.jobs = data;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}

		$scope.interested = function (id, index) {
			resources.JobInterested
				.save({ id : id })
				.$promise
				.then(function (data) {
					$scope.jobs.listing.splice(index, 1, data.job);
					ngToast.success({
						content : data.msg
					});
				}, function (err) {
					if (err.data.code == 'profilerequired') {
						ngToast.danger({
							content : $sce.trustAsHtml('<a ui-sref="rootControl.profile">' + err.data.msg + '</a>'),
							compileContent : true
						});
					} else {
						ngToast.danger({
							content : err.data.msg
						})
					}
				});
		}

		$scope.uninterested = function (id, index) {
			resources.JobUninterested
				.save({ id : id })
				.$promise
				.then(function (data) {
					$scope.jobs.listing.splice(index, 1, data.job);
					ngToast.success({
						content : data.msg
					});
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}

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
						$location.path(config['localSignInRedirect']);
					}, 500);

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

		resources.Profile
			.get()
			.$promise
			.then(function (data) {
				$scope.profile = data;
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});

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
					$scope.profile = data.profile;
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
			var newFormData = {};
			angular.extend(newFormData, formData);
			newFormData.saveExperience = true;
			resources.Profile
				.save(newFormData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.profile.experiences = data.profile.experiences;
					$scope.profile.experience = null;
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
					$scope.profile.experiences = data.profile.experiences;
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
			var newFormData = {};
			angular.extend(newFormData, formData);
			newFormData.saveEducation = true;
			resources.Profile
				.save(newFormData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.profile.educations = data.profile.educations;
					$scope.profile.education = null;
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
					$scope.profile.educations = data.profile.educations;
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
			var newFormData = {};
			angular.extend(newFormData, formData);
			newFormData.saveSkill = true;
			resources.Profile
				.save(newFormData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.profile.skills = data.profile.skills;
					$scope.profile.skill = null;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
			$scope.displayValidation.skillForm = false;
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
					$scope.profile.skills = data.profile.skills;
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
		$scope.displayValidation = {};
		$scope.toggle = {};

		resources.Company
			.query()
			.$promise
			.then(function (data) {
				$scope.companies = data;
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});

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
	}])
	.controller('jobCtrl', ['$scope', 'config', 'resources', 'ngToast', function ($scope, config, resources, ngToast) {
		$scope.root.title = ['Job', config.siteName].join(' | ');
		$scope.embeddedJsonData = JSON.parse(document.getElementById('embeddedJsonData').text);
		$scope.displayValidation = {};
		$scope.toggle = {};

		resources.Jobs
			.query()
			.$promise
			.then(function (data) {
				$scope.jobs = data;
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});

		resources.Company
			.query()
			.$promise
			.then(function (data) {
				$scope.companies = data;
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});

		$scope.saveJob = function ($event, formData) {
			if ($scope.jobForm.$invalid) {
				$scope.displayValidation.form = true;
				return;
			}
			resources.Job
				.save(formData)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.jobs = data.jobs;
					$scope.job = null;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
			$scope.displayValidation.form = false;
		}

		$scope.editJob = function (job) {
			job.expiry = new Date(job.expiry);
			var tempJob = {};
			angular.extend(tempJob, job);
			$scope.job = tempJob;
		}

		$scope.removeJob = function (job) {
			resources.Job
				.remove(job)
				.$promise
				.then(function (data) {
					ngToast.success({
						content : data.msg
					});
					$scope.jobs = data.jobs;
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}

		$scope.archiveJob = function (job) {
			
		}
	}])
	.controller('guideCtrl', ['$scope', 'config', function ($scope, config) {
		$scope.root.title = ['Guide', config.siteName].join(' | ');
	}])
	.controller('jobViewCtrl', ['$scope', 'config', '$stateParams', 'resources', 
	'ngToast', '$sce', function ($scope, config, $stateParams, resources, ngToast, $sce) {
		$scope.root.title = ['Job View', config.siteName].join(' | ');

		resources.publicData.Job
			.get({ id : $stateParams.id })
			.$promise
			.then(function (data) {
				$scope.root.title = ['Job View', data.title, config.siteName].join(' | ');
				$scope.job = data;
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});

		$scope.interested = function (id, index) {
			resources.JobInterested
				.save({ id : id })
				.$promise
				.then(function (data) {
					$scope.job = data.job;
					ngToast.success({
						content : data.msg
					});
				}, function (err) {
					if (err.data.msg == 'profilerequired') {
						ngToast.danger({
							content : $sce.trustAsHtml('<a ui-sref="rootControl.profile">' + err.data.msg + '</a>'),
							compileContent : true
						});
					} else {
						ngToast.danger({
							content : err.data.msg
						});
					}
				});
		}

		$scope.uninterested = function (id, index) {
			resources.JobUninterested
				.save({ id : id })
				.$promise
				.then(function (data) {
					$scope.job = data.job;
					ngToast.success({
						content : data.msg
					});
				}, function (err) {
					ngToast.danger({
						content : err.data.msg
					});
				});
		}
	}])
	.controller('companyViewCtrl', ['$scope', 'config', '$stateParams', 'resources', function ($scope, config, $stateParams, resources, ngToast) {
		$scope.root.title = ['Company View', config.siteName].join(' | ');

		resources.publicData.Company
			.get({ id : $stateParams.id })
			.$promise
			.then(function (data) {
				$scope.company = data;
				$scope.root.title = ['Company View', data.name, config.siteName].join(' | ');
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});

		resources.publicData.CompanyJobs
			.query({ id : $stateParams.id })
			.$promise
			.then(function (data) {
				$scope.companyJobs = data;
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});


	}])
	.controller('interestCtrl', ['$scope', 'config', 'resources', 'ngToast', function ($scope, config, resources, ngToast) {
		$scope.root.title = ['Interest', config.siteName].join(' | ');

		resources.InterestJobs
			.query()
			.$promise
			.then(function (data) {
				$scope.interestJobs = data;
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});

		resources.InterestApplicants
			.query()
			.$promise
			.then(function (data) {
				$scope.interestApplicants = data;
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});

	}])
	.controller('profileViewCtrl', ['$scope', 'config', 'resources', 'ngToast', '$stateParams', function ($scope, config, resources, ngToast, $stateParams) {
		$scope.root.title = ['Profile', config.siteName].join(' | ');

		resources.publicData.Profile
			.get({ id : $stateParams.id })
			.$promise
			.then(function (data) {
				$scope.root.title = ['Profile', data.name, config.siteName].join(' | ');
				$scope.profile = data;
			}, function (err) {
				ngToast.danger({
					content : err.data.msg
				});
			});

	}]);