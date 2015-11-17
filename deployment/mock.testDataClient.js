var
	zmq = require('zmq')
	, req = zmq.socket('req').connect('tcp://127.0.0.1:5488')
	, db = require('../setup/mongojs')
	, async = require('async')
	, testData = require('./mock.testData')
	, config = require('./mock.testDataConfig')
	, elasticsearch = require('elasticsearch')
	, esClient = new elasticsearch.Client({

	});

async.waterfall([
	function (ok) {
		async.parallel([
			function (done) {
				db.User.remove({}, function (err) {
					if (err) {
						return done(err);
					}
					done();
				});
			},
			function (done) {
				db.Company.remove({}, function (err) {
					if (err) {
						return done(err);
					}
					done();
				});
			},
			function (done) {
				db.Job.remove({}, function (err) {
					if (err) {
						return done(err);
					}
					done();
				});
			}
		], function (err) {
			if (err) {
				return ok(err);
			}
			ok();
		});
	},
	function (ok) {
		db.User.insert(testData.generateAUser(), function (err, user) {
			if (err) {
				return ok(err);
			}
			ok(null, user);
		});
	},
	function (user, ok) {
		var getTask = function () {
			return function (done) {
				db.Company.insert(testData.generateACompany(user), function (err, company) {
					if (err) {
						return done(err);
					}
					done(null, company);
				});
			}
		};
		async.parallel(testData.range(config['companies'], getTask), function (err, companies) {
			if (err) {
				return ok(err);
			}
			ok(null, user, companies);
		});
	},
	function (user, companies, ok) {
		for (var i = 0; i < config['jobs']; i++) {
			var
				company = companies[testData.random(0, companies.length - 1)];

			req.send(JSON.stringify({
				task : 'createUser',
				user    : user,
				company : company	
			}));
		}
		ok();
	}
], function (err) {
	if (err) {
		console.log(err);
	}
});

req.on('message', function (data) {
	console.log(JSON.parse(data).status);
});