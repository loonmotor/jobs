var
	behaviorStates = require('../modules/behaviorStates')
	, config = require('../config');

behaviorStates.register('getLoggedInStateTemplate', 'guest', function (req, res) {
	res.render('not-logged-in', {});
});
behaviorStates.register('getLoggedInStateTemplate', 'user', function (req, res) {
	res.render('logged-in', { user : req.user });
});
behaviorStates.register('getProfileTemplate', 'guest', function (req, res) {
	res.render('profile', {
		config : config,
		profile : {}
	});
});
behaviorStates.register('getProfileTemplate', 'user', function (profile, req, res) {
	res.render('profile', { 
		config : config,
		profile : profile 
	});
});