var
	restfulApi = require('../modules/restfulApi')
	, db = require('./mongojs')
	, async = require('async')
	, objectid = require('objectid');

restfulApi.use('template.LoggedInState', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		res.render('not-logged-in', {});
		return done();
	}
	res.render('logged-in', { user : req.user });
	done();
});

restfulApi.use('template.Profile', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('template.Profile', 'GET', function (resourceName, req, res, done) {
	
	res.render('profile', {});
	done();

});

restfulApi.use('Profile', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('Profile', 'GET', function (resourceName, req, res, done) {
	db.Profile.findOne({ userId : req.user._id }, function (err, profile) {
		if (err) {
			return done({ code : 'profileLookUpError', msg : 'Profile look up error' });
		}
		res.json(profile);
		done();
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
				'links.resume'   : req.body.links && req.body.links.resume,
				'links.website'  : req.body.links && req.body.links.website,
				'links.linkedin' : req.body.links && req.body.links.linkedin,
				'links.twitter'  : req.body.links && req.body.links.twitter,
				'links.blog'     : req.body.links && req.body.links.blog,
				'links.github'   : req.body.links && req.body.links.github,
				'links.facebook' : req.body.links && req.body.links.facebook,
				'links.dribble'  : req.body.links && req.body.links.dribble,
				'links.behance'  : req.body.links && req.body.links.behance
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

restfulApi.use('template.Company', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('template.Company', 'GET', function (resourceName, req, res, done) {
	
	db.Company.find({ userId : req.user._id }, function (err, companies) {
		if (err) {
			return done({ code : 'companyLookUpError', msg : 'Company look up error' });
		}
		if (!companies) {
			companies = [];
		}
		res.render('company', {});
		done();
	});

});

restfulApi.use('Company', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('Company', 'GET', function (resourceName, req, res, done) {

	db.Company.find({ userId : req.user._id }, function (err, companies) {
		if (err) {
			return done({ code : 'companyLookUpError', msg : 'Company look up error' });
		}
		res.json(companies);
		done();
	});

});

restfulApi.use('Company', 'POST', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('Company', 'POST', function (resourceName, req, res, done) {
	var
		query = { userId : req.user._id, modified : req.body.modified }
		, updateCommand;

	updateCommand = {
		'$set' : {
			'name'     : req.body.name,
			'logo'     : req.body.logo,
			'website'  : req.body.website,
			'location' : req.body.location,
			'markets'  : req.body.markets,
			'teamSize' : req.body.teamSize,
			'slogan'   : req.body.slogan,
			'whyus'    : req.body.whyus,
			'product'  : req.body.product,
			'modified' : Date.now().toString()
		}
	};

	db.Company.findAndModify({
		query  : query,
		update : updateCommand,
		upsert : true,
		new : true,
	}, function (err, doc) {
		if (err) {
			return done(err);
		}

		db.Company.find({ userId : req.user._id }, function (err, companies) {
			res.json({
				code : 'updatesuccess',
				msg  : 'Saved successfully',
				companies : companies
			})
			done();
		});
	});

});

restfulApi.use('Company', 'DELETE', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('Company', 'DELETE', function (resourceName, req, res, done) {

	async.waterfall([
		function (ok) {
			db.Company.findAndModify({
				query  : { userId : req.user._id, modified : req.query.modified },
				remove : true
			}, function (err, doc) {
				if (err) {
					return ok(err);
				}
				ok(null, doc._id);
			});
		},
		function (companyId, ok) {
			db.Job.remove({ companyId : companyId.toString() }, function (err, results) {
				if (err) {
					return ok(err);
				}
				ok();
			});
		},
		function (ok) {
			db.Company.find({ userId : req.user._id }, function (err, companies) {
				if (err) {
					return ok(err);
				}
				res.json({
					code : 'deletesuccess',
					msg  : 'Removed successfully',
					companies : companies
				})
				ok();
			});
		}
	], function (err) {
		if (err) {
			return done(err);
		}
		done();
	});

});

restfulApi.use('template.Job', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('template.Job', 'GET', function (resourceName, req, res, done) {

	db.Company.find({ userId : req.user._id }, { _id : 1, name : 1, location : 1 }, function (err, companies) {
		if (err) {
			return done({ code : 'companyLookUpError', msg : 'Company look up error' });
		}
		var companyIds = companies.map(function (company) {
			return company._id.toString();
		});
		db.Job.find({ companyId : { '$in' : companyIds }}, function (err, jobs) {
			if (err) {
				return done(err);
			}
			res.render('job', {});
			done();
		});
	});

});

restfulApi.use('Job', 'POST', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('Job', 'POST', function (resourceName, req, res, done) {
	var
		updateCommand;

	

	async.waterfall([
		function (ok) {
			db.Company.findOne({ _id : objectid(req.body.companyId) }, function (err, company) {
				if (err) {
					return ok(err);
				}
				return ok(null, company);
			});
		},
		function (company, ok) {

			var updateCommand = {
				'$set' : {
					'title'       : req.body.title,
					'description' : req.body.description,
					'expiry'      : new Date(req.body.expiry),
					'role'        : req.body.role,
					'jobType'     : req.body.jobType,
					'location'    : req.body.location,
					'coworkers'   : (function () {
						return req.body.coworkers.map(function (coworker) {
							return coworker.text;
						});
					})(),
					'canRemote'   : req.body.canRemote,
					'visaSponsor' : req.body.visaSponsor,
					'skills'      : (function () {
						return req.body.skills.map(function (skill) {
							return skill.text;
						});
					})(),
					'salary'         : req.body.salary,
					'salaryCurrency' : req.body.salaryCurrency,
					'modified' : Date.now().toString(),
					'companyId' : req.body.companyId,
					'company.name'     : company.name,
					'company.location' : company.location,
					'company.logo'     : company.logo,
					'company.website'  : company.website
				}
			};

			db.Job.findAndModify({
				query : { modified : req.body.modified },
				update : updateCommand,
				upsert : true,
				new : true	
			}, function (err, job) {
				if (err) {
					return ok(err);
				}
				return ok();
			});

		},
		function (ok) {
			db.Company.find({ userId : req.user._id }, { _id : 1, name : 1, location : 1 }, function (err, companies) {
				if (err) {
					return ok({ code : 'companyLookUpError', msg : 'Company look up error' });
				}
				return ok(null, companies);
			});
		},
		function (companies, ok) {
			var companyIds = companies.map(function (company) {
				return company._id.toString();
			});
			db.Job.find({ companyId : { '$in' : companyIds }}, function (err, jobs) {
				if (err) {
					return ok(err);
				}
				res.json({
					code : 'updatesuccess',
					msg  : 'Saved successfully',
					jobs : jobs
				});
				ok();
			});
		}
	], function (err, results) {
		if (err) {
			return done(err);
		}
		done();
	});

});

restfulApi.use('Job', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		return done({
			code : 'notauthenticated',
			msg  : 'Not authenticated'
		});
	}
	done();
});

restfulApi.use('Job', 'GET', function (resourceName, req, res, done) {
	db.Company.find({ userId : req.user._id }, { _id : 1, name : 1, location : 1 }, function (err, companies) {
		if (err) {
			return done({ code : 'companyLookUpError', msg : 'Company look up error' });
		}
		var companyIds = companies.map(function (company) {
			return company._id.toString();
		});
		db.Job.find({ companyId : { '$in' : companyIds }}, function (err, jobs) {
			if (err) {
				return done(err);
			}
			res.json(jobs);
			done();
		});
	});
});

restfulApi.use('Job', 'DELETE', function (resourceName, req, res, done) {
	var
		query = { companyId : req.query.companyId, modified : req.query.modified }
		, updateCommand;

	db.Job.findAndModify({
		query  : query,
		remove : true
	}, function (err, doc) {
		if (err) {
			return done(err);
		}

		db.Company.find({ userId : req.user._id }, { _id : 1, name : 1, location : 1 }, function (err, companies) {
			if (err) {
				return done({ code : 'companyLookUpError', msg : 'Company look up error' });
			}
			var companyIds = companies.map(function (company) {
				return company._id.toString();
			});
			db.Job.find({ companyId : { '$in' : companyIds }}, function (err, jobs) {
				if (err) {
					return done(err);
				}
				res.json({
					code : 'deletesuccess',
					msg  : 'Removed successfully',
					jobs : jobs
				});
				done();
			});
		});

	});
});

restfulApi.use('publicData.Job', 'GET', function (resourceName, req, res, done) {

	async.series({
		count : function (ok) {
			db.Job.count({}, function (err, result) {
				if (err) {
					return ok(err);
				}
				return ok(null, result);
			});
		},
		listing : function (ok) {
			db.Job
				.find({})
				.limit(req.params.limit)
				.sort({ $natural : -1 })
				.skip(req.params.offset * req.params.limit, function (err, jobs) {					
					if (err) {
						return ok(err);
					}
					return ok(null, jobs);
				});
		}
	}, function (err, results) {
		if (err) {
			return done(err);
		}
		return res.json(results);
	});

	done();
});

restfulApi.use('template.Home', 'GET', function (resouceName, req, res, done) {
	res.render('home', {});
	done();
});