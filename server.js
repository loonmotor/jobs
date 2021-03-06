'use strict';

var
	express           = require('express')
	, app             = express()
	, logger          = require('./modules/logger')
	, restLogger      = require('morgan')
	, cookieParser    = require('cookie-parser')
	, bodyParser      = require('body-parser')
	, session         = require('express-session')
	, RedisStore      = require('connect-redis')(session)
	, redisClient     = require('./setup/redisClient')
	, fs              = require('fs')
	, path            = require('path')
	, config          = require('./config')
	, rootRoute       = require('./routes/root')
	, authRoute       = require('./routes/auth')
	, templateRoute   = require('./routes/template')
	, dataRoute       = require('./routes/data')
	, publicDataRoute = require('./routes/publicData')
	, passport        = require('passport')
	, favicon         = require('serve-favicon')
	, htmlSanitizer   = require('./middlewares/htmlSanitizer');

require('./setup/passport')(); // passport
require('./setup/restfulApi'); // restful api

app.enable('trust proxy');

app.engine('ejs', require('ejs').__express); // use ejs templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.locals.config = config; // globalize configuration

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(restLogger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended : false, limit : config['urlencoded.limit'] }));
app.use(bodyParser.json({ limit : config['jsonencoded.limit'] }));
app.use(htmlSanitizer());
app.use(session({ //
	name              : 'pips',
	resave            : false,
	saveUninitialized : false,
	secret            : config['session.secret'],
	cookie            : {
		maxAge : config['session.maxAge']
	},
	client : new RedisStore({
		client : redisClient
	})
}));
app.use(passport.initialize()); // passport
app.use(passport.session()); // passport

app.use('/', rootRoute); // define root route
app.use('/auth', authRoute); // define auth route
app.use('/template', templateRoute); // define template route
app.use('/data', dataRoute); // define data route
app.use('/public/data', publicDataRoute); // define public data route
app.use(function (err, req, res, next) {
	console.log(err);
	next(err);
});
if (!fs.existsSync(path.join(__dirname, config.staticPath))) { // check and create static directory
	fs.mkdirSync(path.join(__dirname, config.staticPath));
}
app.use(express.static(path.join(__dirname, config.staticPath), {
	maxAge : config.staticMaxAge
})); // serve static files


app.use(function (req, res, next) { // 404 catcher
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (app.get('env') === 'development') { // development error handler
	app.use(function (err, req, res, next) {
		res
			.status(err.status || 500)
			.json({
				msg : err.message
			});
	});
}

app.use(function (err, req, res, next) { // production error handler
	res
		.status(err.status || 500)
		.send(err.message);
});

app.listen(config['port']);