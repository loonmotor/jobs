var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.all('/profile/:id?', restfulApi.restful('Profile'));

router.all('/company/:id?', restfulApi.restful('Company'));

router.all('/job/interested', restfulApi.restful('Job.Interested'));

router.all('/job/uninterested', restfulApi.restful('Job.Uninterested'));

router.all('/job/:id?', restfulApi.restful('Job'));

router.all('/jobs/:offset?/:limit?', restfulApi.restful('Jobs'));

router.all('/interest/jobs', restfulApi.restful('Interest.Jobs'));

router.all('/interest/applicants', restfulApi.restful('Interest.Applicants'));

module.exports = router;