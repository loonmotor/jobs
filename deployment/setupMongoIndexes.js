var
	mongo = new Mongo()
	, db = mongo.getDB('jobs');

db.User.ensureIndex({ 'name' : 1 });
db.User.ensureIndex({ 'google.id' : 1 });
db.User.ensureIndex({ 'facebook.id' : 1 });
db.User.ensureIndex({ 'local.username' : 1 });