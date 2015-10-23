angular
	.module('jobs')
	.filter('yesNo', [function () {
		return function (bool) {
			return bool ? 'Yes' : 'No';
		}
	}]);