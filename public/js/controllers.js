angular
	.module('jobs')
	.controller('rootCtrl', ['$scope', function ($scope) {
		$scope.root = {};
	}])
	.controller('homeCtrl', ['$scope', function ($scope) {
		$scope.root.title = 'Jobs';
	}])
	.controller('signinCtrl', ['$scope', function ($scope) {
		$scope.root.title = 'Sign In';
	}]);