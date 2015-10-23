angular
	.module('jobs')
	.factory('resources', ['$resource', 'config', function ($resource, config) {

		var apis = {};

		apis.Profile = $resource(config['resourceUrl']['Profile']);
		apis.Company = $resource(config['resourceUrl']['Company']);
		apis.Job = $resource(config['resourceUrl']['Job']);
		apis.publicData = {
			Jobs : $resource(config['resourceUrl']['publicData']['Jobs']),
			Job  : $resource(config['resourceUrl']['publicData']['Job']),
			Company : $resource(config['resourceUrl']['publicData']['Company'])
		};

		return apis;

	}]);