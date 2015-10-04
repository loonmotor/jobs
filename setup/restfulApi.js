var
	restfulApi = require('../modules/restfulApi')
	, db = require('./mongojs');

restfulApi.setResourcePermission('default', 'GET', function (req, done) {
	if (!req.isAuthenticated()) {
		return done({ error : {
			code : 'notauthenticated',
			msg  : 'Not Authenticated'
		}});
	}
	console.log('passing done');
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
		return res.render('not-logged-in', {});
	}
	res.render('logged-in', { user : req.user });
});