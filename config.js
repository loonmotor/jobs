module.exports = {
	"siteName" : "Jobs",
	"host" : "http://localhost:3008",
	"port" : 3008,
	"logPath" : "logs",
	"logFile" : "logs.log",
	"staticPath" : "public",
	"staticMaxAge" : 0,
	"mongodb.databaseUrl"  : "mongodb://127.0.0.1:27017/jobs",
	"mongodb.databaseName" : "jobs",
	"auth.google.clientID"     : "1088557290877-k1h93vl0kvdjkrn3rurc50dbt66g8gbr.apps.googleusercontent.com",
	"auth.google.clientSecret" : "spv_ZDhNRvQhMcKTdgYYQcES",
	"auth.google.callbackURL"  : "/auth/google/return",
	"auth.google.successRedirect" : "/",
	"auth.facebook.clientID"     : "1139553276073524",
	"auth.facebook.clientSecret" : "cb02a0964ec1891c2d6a743dba0d30ec",
	"auth.facebook.callbackURL"  : "/auth/facebook/return",
	"auth.facebook.successRedirect" : "/",
	"auth.signOutRedirect" : "/",
	"session.secret" : "1FRlUu7Jledo1JOp6otFhCIFddUHEY2m",
	"session.maxAge" : 604800000,
	"profile.roles" : [
		{ "name" : 'Marketing', group : 'Marketing' },
		{ "name" : 'Full-Stack Developer', group : 'Software Engineer' },
		{ "name" : 'Backend Developer', group : 'Software Engineer' },
		{ "name" : 'Frontend Developer', group : 'Software Engineer' },
		{ "name" : 'Data Scientist', group : 'Software Engineer' },
		{ "name" : 'Mobile Developer', group : 'Software Engineer' },
		{ "name" : 'DevOps', group : 'Software Engineer' },
		{ "name" : 'Product Manager', group : 'Product Manager' },
		{ "name" : 'Finance/Accounting', group : 'Operations' },
		{ "name" : 'Office Manager', group : 'Operations' },
		{ "name" : 'H.R.', group : 'Operations' },
		{ "name" : 'Attorney', group : 'Operations' },
		{ "name" : 'Sales', group : 'Sales' },
		{ "name" : 'UI/UX Designer', group : 'Designer' },
		{ "name" : 'Visual Designer', group : 'Designer' },
		{ "name" : 'User Researcher', group : 'Designer' },
	],
	"profile.jobTypes" : [
		"Full-time Employee",
		"Contractor",
		"Intern",
		"Co-founder"
	],
	"profile.salaryCurrencies" : [
		{ "name" : "United States Dollars ($)", "symbol" : "$", value : "USD" },
		{ "name" : "Euros (€)", "symbol" : "€", value : "EUR" },
		{ "name" : "British Pounds (£)", "symbol" : "£", value : "GBP" },
		{ "name" : "Canadian Dollars ($)", "symbol" : "$", value : "CAD" },
		{ "name" : "Japanese Yens (¥)", "symbol" : "¥", value : "JPY" },
		{ "name" : "Chinese Renminbi Yuans (¥)", "symbol" : "¥", value : "CNY" },
		{ "name" : "Indian Rupees (₹)", "symbol" : "₹", value : "INR" },
		{ "name" : "Singapore Dollars ($)", "symbol" : "$", value : "SGD" }
	],
	"profile.accomplishment.maxLength" : 1000,
	"profile.positionDescription.maxLength" : 500,
	"profile.photo.maxFileSize" : 100000,
	"company.teamSizes" : [
		"1-10",
		"11-50",
		"51-200",
		"201-500",
		"501-1000",
		"1001-5000",
		"5000+"
	],
	"company.whyus.maxLength" : 2000,
	"company.product.maxLength" : 1000,
	"job.description.maxLength" : 2000,
	"urlencoded.limit" : "1mb",
	"jsonencoded.limit" : "1mb",
	"jobListing.home.paginationSize" : 12
};