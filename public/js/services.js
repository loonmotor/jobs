angular
	.module('jobs')
	.factory('resources', ['$resource', 'config', function ($resource, config) {

		var apis = {};

		apis.Profile = $resource(config['resourceUrl']['Profile']);
		apis.Company = $resource(config['resourceUrl']['Company']);
		apis.Job = $resource(config['resourceUrl']['Job']);
		apis.publicData = {
			Job : $resource(config['resourceUrl']['publicData']['Job'])
		};

		return apis;

	}]);