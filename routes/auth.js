const
	express = require('express')
	, router = express.Router()
	, passport = require('passport');

router.get('/google/:return?', passport.authenticate('google', {
	successRedirect : '/',
	scope : ['email']
}));

router.get('/facebook/:return?', passport.authenticate('facebook', {
	successRedirect : '/',
	scope : ['email']
}));

router.get('/local-signin', function (req, res) {
	res.render('auth/local-signin');
});

module.exports = router;