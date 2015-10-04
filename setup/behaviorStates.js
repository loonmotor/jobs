var
	behaviorStates = require('../modules/behaviorStates');

behaviorStates.register('getLoggedInStateTemplate', 'guest', function (req, res) {
	res.render('not-logged-in', {});
});
behaviorStates.register('getLoggedInStateTemplate', 'user', function (req, res) {
	res.render('logged-in', { user : req.user });
});