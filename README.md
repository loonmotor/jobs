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
There are many ways to introduce this app.
I prefer to walk you through with the assumption that you are the developer who is going to maintain this app, as doing so gives a better context to carry out the explanation.
## Overview
**Jobs** is a RESTful web app, with AngularJS as the front end Javascript framework, MongoDB as the database, whereas the RESTful APIs are powered by Nodejs and the ExpressJS framework.
Redis is used as session store as it provides scalability, Elasticsearch allows for tunable query and NginX functions as a reverse proxy.

Maintainability was put into mind while developing this app, so I had applied some patterns and techniques. They will be covered and mentioned in detail in the corresponding subsections below. The aim is not to over-engineer stuff, rather to produce an app with balanced and flexible design.
## Web Server
NginX as the web server :
* Reverse proxy to NodeJS app
* Serve static contents (e.g. : html, javascript, css, font, image)
* Configuration file is available at [deployment/nginx.jasoncheng.ninja.conf](deployment/nginx.jasoncheng.ninja.conf)
## Front End
AngularJS as the front end Javascript framework.

### Code Organization
* Source code is available in [public/js](tree/master/public/js)
 * The main module is called **Jobs** and is declared in [public/js/main.js](blob/master/public/js/main.js)
 * Third party modules are located in [public/js/external](tree/master/public/js/external)
 * Custom modules are located in [public/js/modules](tree/master/public/js/modules)
 * [Controllers](blob/master/public/js/controllers.js), [directives](blob/master/public/js/directives.js), [filters](blob/master/public/js/filters.js), and [services](blob/master/public/js/services.js) had been organized into their respective file
 * Configuration is available at [public/js/config.js](blob/master/public/js/config.js)

## Back End

### Database
MongoDB as the NoSQL database.

The database for this app is called **jobs**.

#### Collections and Their Schemas

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
Index script is available in [blob/master/deployment/mongodb.setupIndices.js](blob/master/deployment/mongodb.setupIndices.js).

Execute the script via Mongo shell to build database indexes.

## Workflow

## Deployment