# Jobs

Single page app for finding and/or posting jobs.

**Demo**
&nbsp;<a href="https://jasoncheng.ninja/jobs" target="_blank">https://jasoncheng.ninja/jobs</a>

<a href="https://www.jasoncheng.ninja/jobs/#/guide" target="_blank">Read the guide</a> for use cases.




# Technology Stack
* Bootstrap CSS
* AngularJS
* NodeJS
* MongoDB
* Elasticsearch
* NginX
* Redis

# Code Walkthrough

## Overview
**Jobs** is a RESTful web app.
* AngularJS as the front end Javascript framework
* MongoDB as the database
* RESTful APIs are powered by Nodejs and the ExpressJS framework.
* Redis is used as session store
* Elasticsearch powers the tunable query
* NginX functions as a reverse proxy

Maintainability was put into mind while developing this app, so I had applied some patterns and techniques. They will be covered and mentioned in detail in the corresponding subsections below. The aim is not to over-engineer stuff, rather to produce an app with balanced and flexible design.

## Web Server
NginX as the web server.
* Reverse proxy to NodeJS app
* Handle SSL 
* Serve static contents (e.g. : html, javascript, css, font, image)
* Configuration file is available at [deployment/nginx.jasoncheng.ninja.conf](deployment/nginx.jasoncheng.ninja.conf)

## Front End
AngularJS as the front end Javascript framework.
* [AngularUI Router](https://github.com/angular-ui/ui-router) provides the routing support
* [Angular ngResource](https://docs.angularjs.org/api/ngResource/service/$resource) provides interaction support with RESTful services

### Code Organization
* Source code is available in [public/js](public/js)
 * The main module is called **Jobs** and is declared in [public/js/main.js](public/js/main.js)
 * Third party modules are located in [public/js/external](public/js/external)
 * Custom modules are located in [public/js/modules](public/js/modules)
 * [Controllers](public/js/controllers.js), [directives](public/js/directives.js), [filters](public/js/filters.js), and [services](public/js/services.js) had been organized into their respective file
 * Configuration is available in [public/js/config.js](public/js/config.js)

## Back End

ExpressJS as the web application framework. 

#### Code Organization
* Development configuration is available in [config.js](config.js)
* Production configuration is available in [config.production.js](config.production.js)
* Standard NPM modules are available in node_modules (Git ignored)
* Custom NodeJS modules are available in [modules](modules)
* Static contents are available in [public](public)
* Middlewares are available in [middlewares](middlewares)
* Logs are available in (Git ingored)
* Templates are available in [views](views)
* Initialization code are available in [setup](setup)

#### RESTful APIs
I had written a **[restfulApi](modules/restfulApi.js)** module to make it a breeze to add and modify RESTful apis.

**restfulApi** exposes 2 methods, namely :
* restful : used to bind a route with a resource
* use : used to register handlers for a specific resource

**Example Usage**

This example shows how to setup the api to retrieve all jobs created by the signed in user and return them in JSON.

1) Bind **Jobs** resource to a route in [routes/data.js](routes/data.js)

	`
	router.all('/jobs/:offset?/:limit?', restfulApi.restful('Jobs'));
	`

2) Register resource handlers in [setup/restfulApi.js](setup/restfulApi.js)
- **Use** method can accept an array of resources that are sharing the same handler for certain HTTP method. Here it checks whether the request is from a signed in user, if yes continues to the next handler, if not return an error.

	```
	restfulApi.use(['template.Profile', 
		'template.Company', 
		'template.JobForm', 
		'template.Interest',
		'Profile',
		'Company', 
		'Jobs',
		'Job',
		'Interest',
		'Interest.Jobs',
		'Interest.Applicants',
		'Jobs.Archived'], 'GET', function (resourceName, req, res, done) {
			if (!req.isAuthenticated()) {
				return done({
					code : 'notauthenticated',
					msg  : 'Not authenticated'
				});
			}
			done();
		});
	```

- **Use** method can register multiple handlers for the same resource and each of them will be executed asynchronously in series. The snippet below shows an overloaded version of **use** method that allows you to specify resource and methods pairs in an object array. You can pass results to subsequent handler by populating req object with arbitrary properties.

	```
	restfulApi.use([{'Jobs':'GET'},
				{'Job':['POST', 'DELETE']},
				{'Job.Archive':'POST'}], function (resourceName, req, res, done) {

		db.Job.find({ userId : req.user._id, archived : false }, function (err, jobs) {
			if (err) {
				return ok(err);
			}
			req.results = jobs;
			done();
		});
	});
	```

- In the final handler, return the JSON result. 

	```
	restfulApi.use('Jobs', 'GET', function (resourceName, req, res, done) {
		res.json(req.results);
	});
	```




#### Authentication
Authentication is powered by [passport](http://passportjs.org/) module.

All setup of authentication strategies are encapsulated into [setup/passport.js](setup/passport.js)


#### Security Measure
I had written a [htmlSanitizer](middlewares/htmlSanitizer.js) middleware to sanitize user's POST data.

### Database
MongoDB as the database. The database for this app is named **jobs**.

#### Driver
[MongoJS](https://www.npmjs.com/package/mongojs) is used as the driver to connect to MongoDB from Nodejs.

Configuration is available in [setup/mongojs.js](setup/mongojs.js).

#### Collections and Schemas

User
```
{
	email : String,
	facebook : {
		id 		: String,
		email 	: String,
		name 	: String
	},
	google : {
		id		: String,
		email   : String,
		name    : String
	},
	local : {
		email	: String,
		password: String
	}
}
```
Profile
```
{
	name			: String,
	email			: String,
	mobilePhone 	: String,
	role 			: String,
	jobType			: String,
	location 		: String,
	canRemote 		: Boolean,
	canRelocate 	: String,
	salaryCurrency 	: String,
	desiredSalary   : Number
	photo : String,
	profileSummary  : String,
	accomplishment  : String,
	links : {
		resume 		: String,
		website 	: String,
		linkedin 	: String,
		twitter 	: String,
		blog 		: String,
		github 		: String,
		facebook 	: String,
		dribbble 	: String,
		behance 	: String
	},
	experiences 	: [
		{
			companyName : String,
			title       : String,
			startDate   : Date,
			endDate     : Date,
			description : String,
			modified    : String
		}
	],
	educations 	: [
		{
			collegeUniName 	: String,
			level		   	: String,
			major		 	: String,
			year			: Date,
			modified		: String
		}
	],
	skills 		: [
		{
			name : String,
			level : String
		}
	],
	userId 	: ObjectId
}
```
Company
```
{
	name 		: String,
	logo 		: String,
	website 	: String,
	phones		: [String],
	email		: String,
	location 	: String,
	markets 	: Array,
	teamSize 	: String,
	slogan		: String,
	whyus		: String,
	product 	: String,
	userId      : ObjectId
}
```
Job
```
{
	title 			: String,
	description 	: String,
	expiry			: Date,
	archived		: Boolean,
	role 			: String,
	jobType			: String,
	location 		: String,
	coworkers 		: Array,
	canRemote		: Boolean,
	visaSponsor 	: Boolean,
	skills 			: Array,
	salary 			: String,
	salaryCurrency 	: String,
	modified		: String,
	company         : {
		name : String,
		logo : String,
		location : String,
		website  : String,
		teamSize : String
	},
	interests : [
		{
			userId : ObjectId
		}
	]
	companyId   	: ObjectId,
	userId			: ObjectId
}
```
#### Indexing
Index script is available in [deployment/mongodb.setupIndices.js](deployment/mongodb.setupIndices.js).

Execute the script via Mongo shell to build database indexes.

## Workflow
Grunt as the development automation tool.
* [Grunt watch](https://github.com/gruntjs/grunt-contrib-watch) is used to monitor file changes and reload page.

## Deployment
This app had been deployed on DigitalOcean cloud hosting.

Miscellaneuos deployment scripts are available in [deployment](deployment), they are used to carry out one-time deployment setup.
* [elasticSearch.setupSettingsAndMappings.js](deployment/elasticSearch.setupSettingsAndMappings.js)
* [mongodb.setupIndices.js](deployment/mongodb.setupIndices.js)
* [nginx.jasoncheng.ninja.conf](deployment/nginx.jasoncheng.ninja.conf)