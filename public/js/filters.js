angular
	.module('jobs')
	.filter('yesNo', [function () {
		return function (bool) {
			return bool ? 'Yes' : 'No';
		}
	}])
	.filter('timeStamp', [function () {
		return function (url) {
			return url.indexOf('?') > -1 ? [url, '&time=', Date.now()].join('') : [url, '?time=', Date.now()].join('');
		}
	}])
	.filter('trustAsResourceUrl', ['$sce', function ($sce) {
		return function (val) {
			return $sce.trustAsResourceUrl(val);
		}
	}]);