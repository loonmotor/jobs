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
	
	if (!req.isAuthenticated()) {
		return behaviorStates.run('getProfileTemplate', 'guest', req, res);
	}

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

restfulApi.use('Profile', 'POST', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('Profile', 'POST', function (resourceName, req, res, done) {
	var updateCommand;
	if (req.body.experience) {
		updateCommand = {
			'$push' : {
				'experiences' : {
					'companyName' : req.body.experience.companyName,
					'title' : req.body.experience.title,
					'startDate' : req.body.experience.startDate,
					'endDate' : req.body.experience.endDate,
					'description' : req.body.experience.description
				}
			}
		};
	} else if (req.body.education) {
		updateCommand = {
			'$push' : {
				'educations' : {
					'collegeUniName' : req.body.education.collegeUniName,
					'level' : req.body.education.level,
					'major' : req.body.education.major,
					'year' : req.body.education.year
				}
			}
		};
	} else {
		updateCommand = {
			'$set' : {
				'name' : req.body.name,
				'role' : req.body.role,
				'jobType' : req.body.jobType,
				'location' : req.body.location,
				'canRemote' : req.body.canRemote,
				'canRelocate' : req.body.canRelocate,
				'salaryCurrency' : req.body.salaryCurrency,
				'desiredSalary' : req.body.desiredSalary,
				'photo' : req.body.photo,
				'profileSummary' : req.body.profileSummary,
				'accomplishment' : req.body.accomplishment,
				'links.resume' : req.body.links.resume,
				'links.website' : req.body.links.website,
				'links.linkedin' : req.body.links.linkedin,
				'links.twitter' : req.body.links.twitter,
				'links.blog' : req.body.links.blog,
				'links.github' : req.body.links.github,
				'links.facebook' : req.body.links.facebook,
				'links.dribble' : req.body.links.dribble,
				'links.behance' : req.body.links.behance
			}
		};
	}

	db.Profile.findAndModify({
		query : { userId : req.user._id },
		update : updateCommand,
		upsert : true,
		new : true
	}, function (err, doc) {
		if (err) {
			return done(err);
		}
		res.json({
			code : 'updatesuccess',
			msg  : 'Saved successfully',
			profile : doc
		})
		done();
	});
});