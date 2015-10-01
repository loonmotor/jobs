'use strict';

var
	async = require('async');

var RestfulApi = function () { // constructor

	var
		permissions = [];

	this.restful = function (collectionName) { // create middleware (external api)

		return function (req, res) {

			async.each(permissions, function (permission, done) { // execute permission callbacks
				permission(req, done);
			}, function (err) {
				if (err) {

				}
			});

		}

	}

	this.setPermission = function (permissionCallback) { // store permission callbacks
		permissions.push(function (req, done) {
			permissionCallback(req, done);
		});
	}

};




module.exports = new RestfulApi();