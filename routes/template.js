var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.get('/logged-in-state', restfulApi.restful('template.LoggedInState'));

router.get('/profile', restfulApi.restful('template.Profile'));

router.get('/company', restfulApi.restful('template.Company'));

module.exports = router;