var
	express = require('express')
	, router = express.Router()
	, restfulApi = require('../modules/restfulApi');

router.all('/job', restfulApi.restful('publicData.Job'));

module.exports = router;