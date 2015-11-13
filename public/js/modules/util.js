angular
	.module('util', [])
	.factory('hashCode', [function () {
		return function (str) {
			var hash = 0, i, chr, len;
			  if (str.length == 0) return hash;
			  for (i = 0, len = str.length; i < len; i++) {
			    chr   = str.charCodeAt(i);
			    hash  = ((hash << 5) - hash) + chr;
			    hash |= 0; // Convert to 32bit integer
			  }
			  return hash;
		}
	}])
	.service('once', ['hashCode', '$timeout', function (hashCode, $timeout) {

		var
			callbackHashes = []
			, once = function (callback, duration) {
				var callbackHashCode = hashCode(callback.toString());
				if (callbackHashes.indexOf(callbackHashCode) > -1) {
					return;
				}
				callbackHashes.push(callbackHashCode);
				$timeout(function () {
					callback.call();
					callbackHashes.splice(callbackHashes.indexOf(callbackHashCode), 1);
				}, duration);
			};

		return once;

	}]);