var
	mongo = new Mongo()
	, db = mongo.getDB('jobs');

db.User.dropIndexes();
db.User.createIndex({ 'name' : 1 });
db.User.createIndex({ 'google.id' : 1 }, { unique : true, sparse : true });
db.User.createIndex({ 'facebook.id' : 1 }, { unique : true, sparse : true });
db.User.createIndex({ 'local.username' : 1 }, { unique : true, sparse : true });

db.Company.dropIndexes();
db.Company.createIndex({ 'userId' : 1, 'modified' : 1 });

db.Profile.dropIndexes();
db.Profile.createIndex({ 'userId' : 1 });

db.Job.dropIndexes();
db.Job.createIndex({ 'companyId' : 1 });
db.Job.createIndex({ 'modified' : 1 });
db.Job.createIndex({ 'archived' : 1 });
db.Job.createIndex({ 'interests.userId' : 1 });
db.Job.createIndex({ 'userId' : 1 });