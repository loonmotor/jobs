angular
	.module('jobs')
	.factory('resources', ['$resource', 'config', function ($resource, config) {

		var apis = {};

		apis.Profile = $resource(config['resourceUrl.Profile'], { id : '@id' });
		apis.Company = $resource(config['resourceUrl.Company'], { id : '@id' });

		return apis;

	}]);