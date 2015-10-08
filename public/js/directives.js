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
	}])
	.directive('readFile', [function () {
		var ddo = {};
		ddo.require = 'ngModel';
		ddo.scope = {
			validFileTypes : '@'
		};
		ddo.link = function (scope, element, attrs, ctrl) {
			ctrl.$validators.fileType = function (modelValue, viewValue) {
				if (!viewValue) {
					return true;
				}
				return new RegExp('(' + scope.validFileTypes + ')').test(viewValue);
			};
			var reader = new FileReader();
			reader.onload = function (loadEvent) {
				scope.$apply(function () {
					ctrl.$setViewValue(loadEvent.target.result);
				});
			};
			element.on('change', function (changeEvent) {
				if (Object.keys(changeEvent.target.files).length <= 0) {
					scope.$apply(function () {
						ctrl.$setValidity('fileType', true);
					});
					return;
				}
				reader.readAsDataURL(changeEvent.target.files[0]);
			});
		}
		return ddo;
	}]);