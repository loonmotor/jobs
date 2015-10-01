'use strict';

var
	express = require('express')
	, router = express.Router()
	, path = require('path');

router.get('/', function (req, res) {
	res.sendFile('root.html', { root : path.join(__dirname, '../public', 'html') });
});

module.exports = router;