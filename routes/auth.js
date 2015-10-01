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
	scope : ['email', 'public_profile']
}));

router.get('/local-signup', function (req, res) {
	res.render('local-signup', {});
});

router.post('/local-signup', function (req, res, next) {

	passport.authenticate('local-signup', function (err, user, info) {
		if (err) {
			return res.json({
				error : err
			});
		}
		req.login(user, function (err) {
			if (err) {
				return res.json({
					error : err
				});
			}
			return res.json(user);
		});
	})(req, res, next);
});

router.get('/local-signin', function (req, res) {
	res.render('local-signin', {});
});

router.post('/local-signin', function (req, res, next) {
	passport.authenticate('local-signin', function (err, user, info) {
		if (err) {
			return res.json({
				error : err
			});
		}
		req.login(user, function (err) {
			if (err) {
				return res.json({
					error : err
				});
			}
			return res.json(user);
		});
	})(req, res, next);
});

module.exports = router;