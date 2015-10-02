var
	restfulApi = require('../modules/restfulApi')
	, db = require('./mongojs');

restfulApi.setResourcePermission('default', 'GET', function (req, done) {
	if (!req.isAuthenticated()) {
		return done('Not authenticated');
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

restfulApi.setResourceMethod('default', 'GET', function (resourceName, res, next) {
	db[resourceName].find({}, function (err, users) {
		res.json(users);
	});
});