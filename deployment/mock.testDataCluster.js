var
	cluster = require('cluster')
	, zmq = require('zmq')
	, cpus = require('os').cpus()
	, testData = require('./mock.testData')
	, db = require('../setup/mongojs')
	, elasticsearch = require('elasticsearch')
	, esClient = new elasticsearch.Client({

	})
	, esJobPicker = require('../modules/util').pick(['title', 'company.name', 'location', 'companyId'])
	, async = require('async');

if (cluster.isMaster) {

	cpus.forEach(function (cpu) {
		cluster.fork();
	});

	cluster.on('online', function (worker) {
		console.log('Worker ' + worker.process.pid + ' is online');
	});

	cluster.on('exit', function (worker, code, signal) {
		console.log('Worker ' + worker.process.pid + ' exits');
	});

	var
		router = zmq.socket('router').bind('tcp://127.0.0.1:5488')
		, dealer = zmq.socket('dealer').bind('tcp://127.0.0.1:5489');

	router.on('message', function () {
		var
			frames = Array.prototype.slice.call(arguments);
		dealer.send(frames);
	});

	dealer.on('message', function () {
		var
			frames = Array.prototype.slice.call(arguments);
		router.send(frames);
	});


} else {

	var
		responder = zmq.socket('rep').connect('tcp://127.0.0.1:5489');

	responder.on('message', function (data) {
		data = JSON.parse(data);
		if (data.task == 'createUser') {
			async.waterfall([
				function (ok) {
					db.Job.insert(testData.generateAJob(data.user, data.company), function (err, job) {
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
						if (err) {
							return ok(err);
						}
						ok(null, job);
					});
				}
			], function (err, job) {
				if (err) {
					return responder.send(JSON.stringify({
						status : err
					}));
				}
				responder.send(JSON.stringify({
					status : 'ok from ' + process.pid,
					job : job
				}));
			});
			
		}
	});

}