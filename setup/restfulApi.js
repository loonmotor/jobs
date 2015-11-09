var
	restfulApi = require('../modules/restfulApi')
	, db = require('./mongojs')
	, async = require('async')
	, objectid = require('objectid')
	, elasticsearch = require('elasticsearch')
	, esClient = new elasticsearch.Client({

	})
	, esJobPicker = require('../modules/util').pick(['title', 'company.name', 'location'])
	, logger = require('../modules/logger');

restfulApi.use(['template.Profile', 
	'template.Company', 
	'template.JobForm', 
	'template.Interest',
	'Profile',
	'Company', 
	'Jobs',
	'Job',
	'Interest',
	'Interest.Jobs',
	'Interest.Applicants',
	'Jobs.Archived'], 'GET', function (resourceName, req, res, done) {
		if (!req.isAuthenticated()) {
			return done({
				code : 'notauthenticated',
				msg  : 'Not authenticated'
			});
		}
		done();
	});

restfulApi.use(['Profile', 
	'Company', 
	'Jobs',
	'Job',
	'Job.Interested',
	'Job.Uninterested',
	'Job.Archive',
	'Job.Unarchive'], 'POST', function (resourceName, req, res, done) {
		if (!req.isAuthenticated()) {
			return done({
				code : 'notauthenticated',
				msg  : 'Not authenticated'
			});
		}
		done();
	});

restfulApi.use(['Profile',
	'Company',
	'Job'], 'DELETE', function (resourceName, req, res, done) {
		if (!req.isAuthenticated()) {
			return done({
				code : 'notauthenticated',
				msg  : 'Not authenticated'
			});
		}
		done();
	});

restfulApi.use('template.LoggedInState', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		res.render('not-logged-in', {});
		return done();
	}
	res.render('logged-in', { user : req.user });
	done();
});

restfulApi.use('template.Profile', 'GET', function (resourceName, req, res, done) {
	
	res.render('profile', {});
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
		res.render('company-form', {});
		done();
	});

});

restfulApi.use('template.JobForm', 'GET', function (resourceName, req, res, done) {

	res.render('job-form', {});
	done();

});

restfulApi.use('template.Home', 'GET', function (resouceName, req, res, done) {
	res.render('home', { user : req.user });
	done();
});

restfulApi.use('template.JobView', 'GET', function (resourceName, req, res, done) {
	res.render('job-view', { user : req.user });
	done();
});

restfulApi.use('template.Interest', 'GET', function (resourceName, req, res, done) {
	res.render('interest', {});
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
				'email'			 : req.body.email,
				'mobilePhone'    : req.body.mobilePhone,
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


restfulApi.use('Company', 'GET', function (resourceName, req, res, done) {

	db.Company.find({ userId : req.user._id }, function (err, companies) {
		if (err) {
			return done({
				code : 'companyLookUpError',
				msg : 'Company look up error'
			});
		}
		res.json(companies);
		done();
	});

});

restfulApi.use('Company', 'POST', function (resourceName, req, res, done) {

	async.waterfall([
		function (ok) {
			var updateCommand = {
				'$set' : {
					'name'     : req.body.name,
					'logo'     : req.body.logo,
					'website'  : req.body.website,
					'phones'   : (function () {
						return req.body.phones && req.body.phones.map(function (phone) {
							return phone.text;
						});
					})(),
					'email'	   : req.body.email,
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
				query  : { userId : req.user._id, modified : req.body.modified },
				update : updateCommand,
				upsert : true,
				new : true,
			}, function (err, company) {
				if (err) {
					return ok(err);
				}
				ok(null, company);
			});
		},
		function (company, ok) {
			var updateCommand = {
				'$set' : {
					'company.name' : company.name,
					'company.logo' : company.logo,
					'company.website' : company.website,
					'company.teamSize' : company.teamSize
				}
			};
			db.Job.update({ companyId : company._id.toString() }, updateCommand, { multi : true }, function (err, results) {
				console.log(results);
				if (err) {
					return ok(err);
				}
				ok(null, company);
			});
		},
		function (company, ok) {
			db.Job.find({ companyId : company._id.toString() }, function (err, results) {
				if (err) {
					return ok(err);
				}

				async.each(results, function (job, k) {
					esClient.index({
						index : 'db',
						type : 'jobs',
						id : job._id.toString(),
						body : esJobPicker(job)
					}, function (err) {
						k();
					});
				}, function (err, results) {
					logger.error(err);
					ok();
				});

			});
		},
		function (ok) {
			db.Company.find({ userId : req.user._id }, function (err, companies) {
				res.json({
					code : 'updatesuccess',
					msg  : 'Saved successfully',
					companies : companies
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
						return req.body.coworkers && req.body.coworkers.map(function (coworker) {
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
					'company.website'  : company.website,
					'userId'		   : req.user._id,
					'archived'		   : false
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
				ok(null, job);
			});

		},
		function (job, ok) {
			esClient.index({
				index : 'db',
				type : 'jobs',
				id : job._id.toString(),
				body : esJobPicker(job)
			}, function (err) {
				logger.error(err);
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

restfulApi.use('Job', 'DELETE', function (resourceName, req, res, done) {

	async.waterfall([
		function (ok) {
			db.Company.findOne({ _id : objectid(req.query.companyId) }, function (err, company) {
				if (err) {
					return ok(err);
				}
				if (!company
					|| company.userId !== req.user._id) {
					return ok({
						code : 'jobremovefailed',
						msg  : 'Failed to remove job'
					});
			}
			ok();
		});
		},
		function (ok) {
			db.Job.findAndModify({
				query : { _id : objectid(req.params.id) },
				remove : true
			}, function (err, doc) {
				if (err) {
					return ok(err);
				}
				ok(null, doc);
			});
		},
		function (job, ok) {
			esClient.delete({
				index : 'db',
				type : 'jobs',
				id : job._id.toString(),
			}, function (err, response) {
				logger.error(err);
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

restfulApi.use('Job.Archive', 'POST', function (resourceName, req, res, done) {

	async.waterfall([
		function (ok) {
			db.Job.findAndModify({
				query : { _id : objectid(req.body.id), userId : req.user._id },
				update : {
					'$set' : {
						'archived' : true
					}
				}
			}, function (err, job) {
				if (err) {
					return ok(err);
				}
				ok(null, job);
			});
		},
		function (job, ok) {
			esClient.delete({
				index : 'db',
				type : 'jobs',
				id : job._id.toString(),
			}, function (err, response) {
				logger.error(err);
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

restfulApi.use(['Jobs', 'Job', 'Job.Archive'], ['GET', 'DELETE', 'POST'], function (resourceName, req, res, done) {

	db.Job.find({ userId : req.user._id, archived : false }, function (err, jobs) {
		if (err) {
			return ok(err);
		}
		req.results = jobs;
		done();
	});

});

restfulApi.use('Job.Archive', 'POST', function (resourceName, req, res, done) {
	res.json({
		code : 'jobarchivesuccess',
		msg  : 'Job has been archived',
		jobs : req.results
	});
});

restfulApi.use('Jobs', 'GET', function (resourceName, req, res, done) {
	res.json(req.results);
});

restfulApi.use('Job', 'POST', function (resourceName, req, res, done) {
	res.json({
		code : 'updatesuccess',
		msg  : 'Saved successfully',
		jobs : req.results
	});
});

restfulApi.use('Job', 'DELETE', function (resourceName, req, res, done) {
	res.json({
		code : 'deletesuccess',
		msg  : 'Removed successfully',
		jobs : req.results
	});
});

restfulApi.use('Job', 'GET', function (resourceName, req, res, done) {
	res.json(req.results);
	done();
});

restfulApi.use('Job.Interested', 'POST', function (resourceName, req, res, done) {
	db.Profile.findOne({ userId : req.user._id }, function (err, profile) {
		if (err) {
			return done(err);
		}
		if (!profile) {
			return done({
				code : 'profilerequired',
				msg  : 'A profile is required before you can add a job to your interest list'
			});
		}
		req.results = profile;
		done();
	});
});

restfulApi.use('Job.Interested', 'POST', function (resourceName, req, res, done) {
	var
	profile = req.results
	, updateCommand = {
		'$addToSet' : {
			'interests' : {
				'userId' : req.user._id,
				'name'   : profile.name
			}
		}
	};

	db.Job.findAndModify({
		query  : { _id : objectid(req.body.id), 'interests' : { '$ne' : req.user._id }},
		update : updateCommand,
		new : true
	}, function (err, job) {
		if (err) {
			return done(err);
		}
		job.interested = true;
		res.json({
			code : 'jobinterested',
			msg  : job.title + ' has been added to you interest list',
			job  : job
		});
		done();
	});
});

restfulApi.use('Job.Uninterested', 'POST', function (resourceName, req, res, done) {
	var
	updateCommand = {
		'$pull' : {
			'interests' : {
				'userId' : req.user._id
			}
		}
	};
	db.Job.findAndModify({
		query  : { _id : objectid(req.body.id) },
		update : updateCommand,
		new : true
	}, function (err, job) {
		if (err) {
			return done(err);
		}
		res.json({
			code : 'jobuninterested',
			msg  : job.title + ' has been removed from your interest list',
			job  : job
		});
		done();
	});
});

restfulApi.use('Interest.Jobs', 'GET', function (resourceName, req, res, done) {
	db.Job.find({ 'interests.userId' : req.user._id, archived : false }, function (err, jobs) {
		if (err) {
			return done({
				code : 'jobinterestslookuperror',
				msg  : 'Job interests look up error'
			});
		}
		res.json(jobs);
		done();
	});
});


restfulApi.use('Interest.Applicants', 'GET', function (resourceName, req, res, done) {

	db.Company.find({ userId : req.user._id }, { _id : 1, name : 1, location : 1 }, function (err, companies) {
		if (err) {
			return done({ code : 'companyLookUpError', msg : 'Company look up error' });
		}
		req.results = companies;
		done();
	});

});

restfulApi.use('Interest.Applicants', 'GET', function (resourceName, req, res, done) {
	var
	companies = req.results;

	async.map(companies, function (company, ok) {
		db.Job.find({ companyId : company._id.toString(), archived : false }, function (err, jobs) {
			if (err) {
				return ok(err);
			}
			company.jobs = jobs;
			ok(null, company);
		});
	}, function (err, companies) {
		if (err) {
			return done(err);
		}
		res.json(companies);
		done();
	});
});

restfulApi.use('publicData.Jobs', 'GET', function (resourceName, req, res, done) {

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
			.find({ archived : false })
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
		req.results = results;
		done();
	});

});

restfulApi.use('publicData.Jobs', 'GET', function (resourceName, req, res, done) {
	if (!req.isAuthenticated()) {
		res.json(req.results);
		return done();
	}
	async.map(req.results.listing, function (job, ok) {
		async.setImmediate(function () {
			if (!job.interests) {
				return ok(null, job);
			}
			for (var i = 0, interest; interest = job.interests[i]; i++) {
				if (interest.userId === req.user._id) {
					job.interested = true;
					break;
				}
			}
			ok(null, job);
		});
	}, function (err, jobListing) {
		req.results.listing = jobListing;
		if (err) {
			return done(err);
		}
		res.json(req.results);
		done();
	});
});

restfulApi.use('publicData.Job', 'GET', function (resourceName, req, res, done) {
	db.Job.findOne({ _id : objectid(req.params.id) }, function (err, job) {
		if (err) {
			return done({				
				code : 'jobLookUpError',
				msg  : 'Job look up error'
			});
		}
		req.results = job;
		done();
	});
});

restfulApi.use('publicData.Job', 'GET', function (resourceName, req, res, done) {
	var
	job = req.results;

	if (!req.isAuthenticated()) {
		res.json(req.results);
		return done();
	}
	if (!job.interests) {
		res.json(job);
		return done();
	}
	for (var i = 0, interest; interest = job.interests[i]; i++) {
		if (interest.userId === req.user._id) {
			job.interested = true;
			break;
		}
	}
	res.json(job);
	done();
});

restfulApi.use('publicData.Company', 'GET', function (resourceName, req, res, done) {
	db.Company.findOne({ _id : objectid(req.params.id) }, function (err, company) {
		if (err) {
			return done({
				code : 'companyLookUpError',
				msg  : 'Company look up error'
			});
		}
		res.json(company);
		done();
	});
});

restfulApi.use('publicData.CompanyJobs', 'GET', function (resourceName, req, res, done) {
	db.Job.find({ companyId : req.params.id }, function (err, jobs) {
		if (err) {
			return done({
				code : 'jobsLookUpError',
				msg  : 'Jobs look up error'
			});
		}
		res.json(jobs);
		done();
	});
});

restfulApi.use('publicData.Profile', 'GET', function (resourceName, req, res, done) {
	db.Profile.findOne({ userId : req.params.id }, function (err, profile) {
		if (err) {
			return done({
				code : 'profileLookUpError',
				msg  : 'Profile look up error'
			});
		}
		res.json(profile);
		done();
	});
});

restfulApi.use('Job.Unarchive', 'POST', function (resourceName, req, res, done) {

	async.waterfall([
		function (ok) {
			db.Job.findAndModify({
				query : { _id : objectid(req.body.id), userId : req.user._id },
				update : {
					'$set' : {
						'archived' : false
					}
				},
				new : true
			}, function (err, job) {
				if (err) {
					return ok(err);
				}
				ok(null, job);
			});
		},
		function (job, ok) {
			esClient.index({
				index : 'db',
				type : 'jobs',
				id : job._id.toString(),
				body : esJobPicker(job)
			}, function (err) {
				logger.error(err);
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

restfulApi.use(['Jobs.Archived', 'Job.Unarchive'], ['GET', 'POST'], function (resourceName, req, res, done) {

	db.Job.find({ userId : req.user._id, archived : true }, function (err, jobs) {
		if (err) {
			return done(err);
		}
		req.results = jobs;

		done();
	});

});

restfulApi.use('Jobs.Archived', 'GET', function (resourceName, req,res, done) {
	res.json(req.results);
	done();
});

restfulApi.use('Job.Unarchive', 'POST', function (resourceName, req, res, done) {
	res.json({
		code : 'jobunarchivesuccess',
		msg  : 'Job has been unarchived',
		jobs : req.results
	});
	done();
});

restfulApi.use('publicData.Search', 'GET', function (resourceName, req, res, done) {
	esClient.search({
		index : 'db',
		type : 'jobs',
		body : {
			"query" : {
				"bool" : {
					"must" : {
						"multi_match" : {
							"query" : req.params.query,
							"type" : "cross_fields",
							"fields" : ["title.ngram", "companyName.ngram", "location.ngram"]
						}  
					},
					"should" : [
					{
						"match" : {
							"title.shingle" : {
								"query" : req.params.query,
								"boost" : 5
							}
						}
					},
					{
						"match" : {
							"companyName.shingle" : {
								"query" : req.params.query,
								"boost" : 3
							}
						}
					},
					{
						"match" : {
							"location.shingle" : {
								"query" : req.params.query,
								"boost" : 1
							}
						}
					}
					]
				}
			}
		}
	}, function (err, results) {
		if (err) {
			return done(err);
		}
		console.log(results);
		res.json(results);
		done();
	});
});