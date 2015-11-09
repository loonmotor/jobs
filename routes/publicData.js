var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.all('/jobs/:offset?/:limit?', restfulApi.restful('publicData.Jobs'));

router.all('/job/:id', restfulApi.restful('publicData.Job'));

router.all('/company/:id', restfulApi.restful('publicData.Company'));

router.all('/company/jobs/:id', restfulApi.restful('publicData.CompanyJobs'));

router.all('/profile/:id', restfulApi.restful('publicData.Profile'));

router.all('/search/:query', restfulApi.restful('publicData.Search'));

module.exports = router;