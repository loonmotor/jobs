var
	mongo = new Mongo()
	, db = mongo.getDB('jobs');

db.User.ensureIndex({ 'name' : 1 });
db.User.ensureIndex({ 'google.id' : 1 });
db.User.ensureIndex({ 'facebook.id' : 1 });
db.User.ensureIndex({ 'local.username' : 1 });

db.Company.ensureIndex({ 'userId' : 1, 'modified' : 1 });

db.Profile.ensureIndex({ 'userId' : 1 });

db.Job.ensureIndex({ 'companyId' : 1 });
db.Job.ensureIndex({ 'modified' : 1 });
db.Job.ensureIndex({ 'archived' : 1 });
db.Job.ensureIndex({ 'interests.userId' : 1 });
db.Job.ensureIndex({ 'userId' : 1 });