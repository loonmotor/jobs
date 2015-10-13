var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.all('/profile/:id?', restfulApi.restful('Profile'));

router.all('/company/:id?', restfulApi.restful('Company'));

module.exports = router;