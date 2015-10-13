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
	var 
		query = { userId : req.user._id }
		, updateCommand;

	if (req.body.saveExperience) {
		if (req.body.experience.modified) {
			query['experiences.modified'] = req.body.experience.modified;
			updateCommand = {
				'$set' : {
					'experiences.$.companyName' : req.body.experience.companyName,
					'experiences.$.title'       : req.body.experience.title,
					'experiences.$.startDate'   : new Date(req.body.experience.startDate),
					'experiences.$.endDate'     : new Date(req.body.experience.endDate),
					'experiences.$.description' : req.body.experience.description,
					'experiences.$.modified'    : Date.now().toString()
				}
			};
		} else {
			updateCommand = {
				'$push' : {
					'experiences' : {
						'companyName' : req.body.experience.companyName,
						'title'       : req.body.experience.title,
						'startDate'   : new Date(req.body.experience.startDate),
						'endDate'     : new Date(req.body.experience.endDate),
						'description' : req.body.experience.description,
						'modified'    : Date.now().toString()
					}
				}
			};
		}
	} else if (req.body.saveEducation) {
		if (req.body.education.modified) {
			query['educations.modified'] = req.body.education.modified;
			updateCommand = {
				'$set' : {
					'educations.$.collegeUniName' : req.body.education.collegeUniName,
					'educations.$.level' : req.body.education.level,
					'educations.$.major' : req.body.education.major,
					'educations.$.year' : req.body.education.year,
					'educations.$.modified' : Date.now().toString()
				}
			};
		} else {
			updateCommand = {
				'$push' : {
					'educations' : {
						'collegeUniName' : req.body.education.collegeUniName,
						'level'          : req.body.education.level,
						'major'          : req.body.education.major,
						'year'           : req.body.education.year,
						'modified'       : Date.now().toString()
					}
				}
			};
		}
	} else if (req.body.saveSkill) {
		if (req.body.skill.modified) {
			query['skills.modified'] = req.body.skill.modified;
			updateCommand = {
				'$set' : {
					'skills.$.name'  : req.body.skill.name,
					'skills.$.level' : req.body.skill.level
				}
			};
		} else {
			updateCommand = {
				'$push' : {
					'skills' : {
						'name' : req.body.skill.name,
						'level' : req.body.skill.level,
						'modified' : Date.now().toString()
					}
				}
			};
		}
	} else {
		updateCommand = {
			'$set' : {
				'name'           : req.body.name,
				'role'           : req.body.role,
				'jobType'        : req.body.jobType,
				'location'       : req.body.location,
				'canRemote'      : req.body.canRemote,
				'canRelocate'    : req.body.canRelocate,
				'salaryCurrency' : req.body.salaryCurrency,
				'desiredSalary'  : req.body.desiredSalary,
				'photo'          : req.body.photo,
				'profileSummary' : req.body.profileSummary,
				'accomplishment' : req.body.accomplishment,
				'links.resume'   : req.body.links.resume,
				'links.website'  : req.body.links.website,
				'links.linkedin' : req.body.links.linkedin,
				'links.twitter'  : req.body.links.twitter,
				'links.blog'     : req.body.links.blog,
				'links.github'   : req.body.links.github,
				'links.facebook' : req.body.links.facebook,
				'links.dribble'  : req.body.links.dribble,
				'links.behance'  : req.body.links.behance
			}
		};
	}

	db.Profile.findAndModify({
		query  : query,
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

restfulApi.use('Profile', 'DELETE', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('Profile', 'DELETE', function (resourceName, req, res, done) {
	var
		query = { userId : req.user._id }
		, updateCommand;

	if (req.query.removeExperience) {
		updateCommand = {
			'$pull' : {
				'experiences' : {
					'modified' : req.query.modified
				}
			}
		};
	} else if (req.query.removeEducation) {
		updateCommand = {
			'$pull' : {
				'educations' : {
					'modified' : req.query.modified
				}
			}
		};
	} else if (req.query.removeSkill) {
		updateCommand = {
			'$pull' : {
				'skills' : {
					'modified' : req.query.modified
				}
			}
		};
	}

	db.Profile.findAndModify({
		query  : query,
		update : updateCommand,
		new : true
	}, function (err, doc) {
		if (err) {
			return done(err);
		}
		res.json({
			code : 'deletesuccess',
			msg  : 'Removed successfully',
			profile : doc
		})
		done();
	});

});