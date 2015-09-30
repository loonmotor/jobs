'use strict';

var
	express        = require('express')
	, app          = express()
	, logger       = require('./modules/logger')
	, restLogger   = require('morgan')
	, cookieParser = require('cookie-parser')
	, bodyParser   = require('body-parser')
	, session      = require('express-session')
	, RedisStore   = require('connect-redis')(session)
	, redisClient  = require('./setup/redisClient')
	, fs           = require('fs')
	, path         = require('path')
	, staticPath   = require('./config').staticPath
	, rootRoute    = require('./routes/root')
	, authRoute    = require('./routes/auth')
	, passport     = require('passport')
	, favicon      = require('serve-favicon');

require('./setup/passport')(); // passport

app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(restLogger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use(session({
	name              : 'pips',
	resave            : false,
	saveUninitialized : false,
	secret            : '1FRlUu7Jledo1JOp6otFhCIFddUHEY2m',
	client : new RedisStore({
		client : redisClient
	})
}));
app.use(passport.initialize()); // passport
app.use(passport.session()); // passport

app.use('/', rootRoute); // define root route
app.use('/auth', authRoute); // define auth route
app.use(function (err, req, res, next) {
	console.log(err);
	next(err);
});
if (!fs.existsSync(path.join(__dirname, staticPath))) { // check and create static directory
	fs.mkdirSync(path.join(__dirname, staticPath));
}
app.use(express.static(path.join(__dirname, staticPath), {
	maxAge : 604800000
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
				error : err.message
			});
	});
}

app.use(function (err, req, res, next) { // production error handler
	res
		.status(err.status || 500)
		.send(err.message);
});

app.listen(3008);