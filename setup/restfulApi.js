var
	restfulApi = require('../modules/restfulApi')
	, db = require('./mongojs')
	, behaviorStates = require('../modules/behaviorStates');

restfulApi.use('template.LoggedInState', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return behaviorStates.run('getLoggedInStateTemplate', 'guest', req, res);
	}
	return behaviorStates.run('getLoggedInStateTemplate', 'user', req, res);
});

restfulApi.use('template.Profile', 'GET', function (resourceName, req, res, done) {
	return behaviorStates.run('getProfileTemplate', 'guest', req, res);
	
	// db.Profile.findOne({ userId : req.user._id }, function (err, profile) {
	// 	if (err) {
	// 		return res.json({ code : 'profileLookUpError', msg : 'Profile look up error' });
	// 	}
	// 	if (!profile) {
	// 		return behaviorStates.run('getProfileTemplate', 'guest', req, res);
	// 	}
	// 	return behaviorStates.run('getProfileTemplate', 'user', profile, req, res);
	// });
});

restfulApi.use('Profile', 'GET', function (resourceName, req, res, done) {
	return res.send('miao');
});