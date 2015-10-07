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
		roles : config['profile.roles'],
		jobTypes : config['profile.jobTypes'],
		salaryCurrencies : config['profile.salaryCurrencies'],
		accomplishmentMaxLength : config['profile.accomplishment.maxLength']
	});
});
behaviorStates.register('getProfileTemplate', 'user', function (profile, req, res) {

});