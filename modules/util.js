'use strict';

var utils = {};

utils.pick = function (keys) {
	return function (obj) {
		return keys.reduce(function (newObj, key) {
			newObj[key] = obj[key];
			return newObj;
		}, {});
	};
};

module.exports = utils;