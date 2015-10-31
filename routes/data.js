var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.all('/profile/:id?', restfulApi.restful('Profile'));

router.all('/company/:id?', restfulApi.restful('Company'));

router.all('/companies/:offset/:limit', restfulApi.restful('Companies'));

router.all('/job/interested', restfulApi.restful('Job.Interested'));

router.all('/job/uninterested', restfulApi.restful('Job.Uninterested'));

router.all('/job/:offset?/:limit?', restfulApi.restful('Job'));

router.all('/interest/jobs', restfulApi.restful('Interest.Jobs'));

router.all('/interest/applicants', restfulApi.restful('Interest.Applicants'));

module.exports = router;