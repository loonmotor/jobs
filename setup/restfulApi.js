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

restfulApi.setResourceMethod('template.LoggedInState', 'GET', function (resourceName, req, res, next) {
	if (!req.isAuthenticated()) {
		return behaviorStates.run('getLoggedInStateTemplate', 'guest', req, res);
	}
	return behaviorStates.run('getLoggedInStateTemplate', 'user', req, res);
});

restfulApi.setResourceMethod('template.Profile', 'GET', function (resourceName, req, res, next) {
	console.log(req.user);
	db.Profile.findOne({ userId : req.user._id }, function (err, profile) {
		if (err) {
			return res.json({ code : 'profileLookUpError', msg : 'Profile look up error' });
		}
		if (!profile) {
			return behaviorStates.run('getProfileTemplate', 'guest', req, res);
		}
		return behaviorStates.run('getProfileTemplate', 'user', profile, req, res);
	});
});