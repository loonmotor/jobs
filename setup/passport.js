'use strict';

var
	passport = require('passport')
	, GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
	, FacebookStrategy = require('passport-facebook').Strategy
	, LocalStrategy = require('passport-local').Strategy
	, db = require('./mongojs')
	, logger = require('../modules/logger')
	, bcrypt = require('bcrypt-nodejs');

module.exports = function () {
	passport.serializeUser(function (user, done) { done(null, user) });
	passport.deserializeUser(function (user, done) { done(null, user) });

	passport.use(new GoogleStrategy({
		clientID          : '1088557290877-k1h93vl0kvdjkrn3rurc50dbt66g8gbr.apps.googleusercontent.com',
		clientSecret      : 'spv_ZDhNRvQhMcKTdgYYQcES',
		callbackURL       : [require('../config').host, '/auth/google/return'].join(''),
		passReqToCallback : true
	}, function (req, accessToken, refreshToken, profile, done) {
		if (req.user) {
			return done(null, req.user);
		}
		db.User.findOne({ 'google.id' : profile.id }, function (err, user) {
			if (err) {
				logger.error(err);
				return done(err);
			}
			var $set = {
				'email'        : profile.emails.length > 0 && profile.emails[0].value,
				'google.id'    : profile.id,
				'google.email' : profile.emails.length > 0 && profile.emails[0].value,
				'google.name'  : profile.displayName
			};

			db.User.findAndModify({
				query  : { 'google.id' : profile.id },
				update : {
					$set : $set
				},
				upsert : true,
				new    : true
			}, function (err, doc) {
				if (err) {
					logger.error(err);
					console.log(err);
					throw err;
				}
				done(null, doc);
			});

		});
	}));

	passport.use(new FacebookStrategy({
		clientID          : '1139553276073524',
		clientSecret      : 'cb02a0964ec1891c2d6a743dba0d30ec',
		callbackURL       : [require('../config').host, '/auth/facebook/return'].join(''),
		profileFields     : ['email'],
		passReqToCallback : true
	}, function (req, accessToken, refreshToken, profile, done) {
		if (req.user) {
			return done(null, req.user);
		}
		db.User.findOne({ 'facebook.id' : profile.id }, function (err, user) {
			if (err) {
				logger.error(err);
				return done(err);
			}
			var $set = {
				'email'          : profile.emails.length > 0 && profile.emails[0].value,
				'facebook.id'    : profile.id,
				'facebook.email' : profile.emails.length > 0 && profile.emails[0].value,
				'facebook.name'  : profile.displayName
			};

			db.User.findAndModify({
				query  : { 'facebook.id' : profile.id },
				update : {
					$set : $set
				},
				upsert : true,
				new    : true
			}, function (err, doc) {
				if (err) {
					logger.error(err);
					console.log(err);
					console.log('testing');
					throw err;
				}
				done(null, doc);
			});
		});
	}));

	passport.use(new LocalStrategy({
		usernameField     : 'email',
		passwordField     : 'password',
		passReqToCallback : true
	}, function (req, email, password, done) {
		if (req.user) {
			return done(null, req.user);
		}
		db.User.findOne({ 'local.email' : email }, function (err, user) {
			if (err) {
				logger.error(err);
				return done(err);
			}
			if (user) {
				if (bcrypt.compareSync(user.local.password, password)) {
					return done(null, user);
				}
			}
			var newUser = {
				local : {
					email : email,
					password : bcrypt.hashSync(password)
				}
			};
			db.User.insert(newUser, function (err, result) {
				if (err) {
					logger.error(err);
					throw err;
				}
				done(null, newUser);
			});
		});
	}));

};