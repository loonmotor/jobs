



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
	type 			: String,
	location 		: String,
	canRemote 		: Boolean,
	canRelocate 	: Boolean,
	salaryCurrency 	: String,
	photo : String,
	miniResume : String,
	accomplishment : String,
	links : {
		resume 		: String,
		website 	: String,
		linkedin 	: String,
		twitter 	: String,
		blog 		: String,
		github 		: String,
		facebook 	: String,
		dribble 	: String,
		behance 	: String
	},
	experience 	: Array,
	education 	: Array,
	skills 		: [
		{
			name : String,
			level : String
		}
	],
	userId 	: ObjectId,
	userName: String
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
	companyId   	: ObjectId,
	companyName		: String,
	companyLogo     : String,
	companyLocation : String
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