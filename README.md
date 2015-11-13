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

# Walkthrough
Quick walkthrough with the assumption that you are developers who are going to maintain this app.
## Overview

## Web Server

## Front End

## Back End

### Database

## Workflow

## Deployment


Collections and Their Schemas

<br>

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

<br>

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

<br>

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

<br>

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
	userId			: userId
}
```