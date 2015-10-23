var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.get('/logged-in-state', restfulApi.restful('template.LoggedInState'));

router.get('/profile', restfulApi.restful('template.Profile'));

router.get('/company', restfulApi.restful('template.Company'));

router.get('/job-form', restfulApi.restful('template.JobForm'));

router.get('/home', restfulApi.restful('template.Home'));

module.exports = router;