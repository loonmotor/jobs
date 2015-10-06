var
	restfulApi = require('../modules/restfulApi')
	, db = require('./mongojs')
	, behaviorStates = require('../modules/behaviorStates');

restfulApi.setResourcePermission('default', 'GET', function (req, done) {
	if (!req.isAuthenticated()) {
		return done({ code : 'notauthenticated', msg : 'Not Authenticated' });
	}
	return done();
});

restfulApi.setResourcePermission('default', 'GET', function (req, done) {
	if (req.params.id == 123) {
		return done();
	}
	return done('wrong param');
});

restfulApi.setResourceMethod('default', 'GET', function (resourceName, req, res, next) {
	db[resourceName].find({}, function (err, users) {
		res.json(users);
	});
});

restfulApi.setResourceMethod('LoggedInState', 'GET', function (resourceName, req, res, next) {
	if (!req.isAuthenticated()) {
		return behaviorStates.run('getLoggedInStateTemplate', 'guest', req, res);
	}
	return behaviorStates.run('getLoggedInStateTemplate', 'user', req, res);
});