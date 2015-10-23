var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.all('/jobs/:offset?/:limit?', restfulApi.restful('publicData.Jobs'));

router.all('/job/:id', restfulApi.restful('publicData.Job'));

router.all('/company/:id', restfulApi.restful('publicData.Company'));

module.exports = router;