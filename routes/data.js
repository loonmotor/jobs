var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.all('/profile/:id?', restfulApi.restful('Profile'));

router.all('/company/:id?', restfulApi.restful('Company'));

router.all('/job/interested', restfulApi.restful('Job.Interested'));

router.all('/job/:offset?/:limit?', restfulApi.restful('Job'));


module.exports = router;