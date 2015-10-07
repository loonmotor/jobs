angular
	.module('jobs')
	.directive('focusOnLoad', [function () {
		var ddo = {};
		ddo.link = function (scope, element, attrs) {
			element[0].focus();
		}
		return ddo;
	}])
	.directive('fieldCharacterCount', [function () {
		var ddo = {};
		ddo.require = 'ngModel';
		ddo.link = function (scope, element, attrs, ctrl) {
			ctrl.$viewChangeListeners.push(function () {
				scope.characterCount = ctrl.$viewValue.length;
			});
		}
		return ddo;
	}]);