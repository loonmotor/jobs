var
	sanitizeHtml = require('sanitize-html');

module.exports = function () {
	return function (req, res, next) {
		Object.keys(req.body).forEach(function (key) {
			if (typeof req.body[key] === 'string' || req.body[key] instanceof String) {
				req.body[key] = sanitizeHtml(req.body[key], {
					allowedTags : []
				});
			}
		});
		next();
	};
};