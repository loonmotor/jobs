angular
	.module('jobs')
	.factory('resources', ['$resource', 'config', function ($resource, config) {

		var apis = {};

		apis.Profile = $resource(config['resourceUrl.Profile'], { id : '@id' });

		return apis;

	}]);