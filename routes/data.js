var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.all('/profile/:id?', restfulApi.restful('Profile'));

router.all('/company/:id?', restfulApi.restful('Company'));

router.all('/job/interested', restfulApi.restful('Job.Interested'));

router.all('/job/uninterested', restfulApi.restful('Job.Uninterested'));

router.all('/job/archive', restfulApi.restful('Job.Archive'));

router.all('/job/unarchive', restfulApi.restful('Job.Unarchive'));

router.all('/job/:id?', restfulApi.restful('Job'));

router.all('/jobs/archived', restfulApi.restful('Jobs.Archived'));

router.all('/jobs/:offset?/:limit?', restfulApi.restful('Jobs'));

router.all('/interest/jobs', restfulApi.restful('Interest.Jobs'));

router.all('/interest/applicants', restfulApi.restful('Interest.Applicants'));

module.exports = router;