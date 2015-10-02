'use strict';

var
	express = require('express')
	, router = express.Router()
	, path = require('path')
	, restfulApi = require('../modules/restfulApi');

router.get('/', function (req, res) {
	res.sendFile('root.html', { root : path.join(__dirname, '../public', 'html') });
});

router.get('/hei/:id?', restfulApi.restful('User', function (err, res) {
	if (err) {
		res.json({
			error : err
		});
	}
}));

module.exports = router;