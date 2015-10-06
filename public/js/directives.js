angular
	.module('jobs')
	.directive('focusOnLoad', [function () {
		var ddo = {};
		ddo.link = function (scope, element, attrs) {
			element[0].focus();
		}
		return ddo;
	}]);