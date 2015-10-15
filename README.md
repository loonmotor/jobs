



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
	name  			: String,
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
	expiry			: String,
	archived		: Boolean,
	role 			: String,
	type 			: String,
	location 		: String,
	coworkers 		: Array,
	canRemote		: Boolean,
	visaSponsor 	: Boolean,
	skills 			: Array,
	salary 			: String,
	salaryCurrency 	: String,
	companyName		: String,
	companyLogo     : String,
	companyLocation : String,
	companyId   	: ObjectId
}
```

<br>

Interest
```
{
	jobId	  : ObjectId,
	profiles  : [ObjectId]
}
```